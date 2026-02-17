import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAppointments } from '@/hooks/useAppointments';

// Mock refresh
vi.mock('@/providers/AdminUIProvider', () => ({
    useRefresh: () => ({ refreshTrigger: 0 }),
}));

// Mock Supabase
const mockFrom = vi.fn();
const mockGetUser = vi.fn();
const mockChannel = vi.fn();

vi.mock('@/utils/supabase/client', () => ({
    createClient: () => ({
        from: mockFrom,
        auth: { getUser: mockGetUser },
        channel: mockChannel,
        removeChannel: vi.fn(),
    }),
}));

const mockAppointments = [
    { id: 1, date: '2023-10-27T10:00:00Z', status: 'pending', pet_name: 'Rex' },
    { id: 2, date: '2023-10-27T11:00:00Z', status: 'completed', pet_name: 'Fido' },
];

describe('useAppointments', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default channel mock
        mockChannel.mockReturnValue({
            on: vi.fn().mockReturnThis(),
            subscribe: vi.fn(),
        });
    });

    const setupFetchMock = (data = mockAppointments, error = null) => {
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect, update: vi.fn(), insert: vi.fn() });

        // Mock chain
        const mockChain = {
            order: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            gte: vi.fn().mockReturnThis(),
            lte: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            ilike: vi.fn().mockReturnThis(),
            range: vi.fn().mockReturnThis(),
            then: (cb: any) => Promise.resolve({ data, error, count: data?.length ?? 0 }).then(cb),
        };

        mockSelect.mockReturnValue(mockChain);

        // Allow accessing the spies from the test
        return { mockSelect, mockChain };
    };

    it('fetches appointments for admin', async () => {
        const { mockSelect, mockChain } = setupFetchMock();

        const { result } = renderHook(() => useAppointments({ isAdmin: true }));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.appointments).toEqual(mockAppointments);
        // Should not query user
        expect(mockGetUser).not.toHaveBeenCalled();
        // Should order by date asc
        expect(mockChain.order).toHaveBeenCalledWith('date', { ascending: true });
    });

    it('fetches appointments for customer', async () => {
        const { mockSelect, mockChain } = setupFetchMock();
        mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });

        const { result } = renderHook(() => useAppointments({ isAdmin: false }));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.appointments).toEqual(mockAppointments);
        expect(mockGetUser).toHaveBeenCalled();
        expect(mockChain.eq).toHaveBeenCalledWith('user_id', 'user-123');
    });

    it('applies filters', async () => {
        const { mockChain } = setupFetchMock();
        const date = new Date('2023-10-27');

        const { result } = renderHook(() => useAppointments({
            isAdmin: true,
            startDate: date,
            searchQuery: 'Rex',
            statuses: ['pending']
        }));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(mockChain.gte).toHaveBeenCalledWith('date', date.toISOString());
        expect(mockChain.ilike).toHaveBeenCalledWith('pet_name', '%Rex%');
        expect(mockChain.in).toHaveBeenCalledWith('status', ['pending']);
    });

    it('updates status and logs it', async () => {
        // Setup fetch
        const mockSelect = vi.fn();
        const mockChain = {
            order: vi.fn().mockReturnThis(),
            range: vi.fn().mockReturnThis(),
            then: (cb: any) => Promise.resolve({ data: mockAppointments, error: null, count: 2 }).then(cb),
        };
        mockSelect.mockReturnValue(mockChain);

        // Setup update and insert
        const mockUpdate = vi.fn();
        const mockInsert = vi.fn();
        const mockEq = vi.fn().mockResolvedValue({ error: null });

        mockUpdate.mockReturnValue({ eq: mockEq });
        mockInsert.mockResolvedValue({ error: null });

        mockFrom.mockReturnValue({
            select: mockSelect,
            update: mockUpdate,
            insert: mockInsert // For logging
        });

        const { result } = renderHook(() => useAppointments({ isAdmin: true }));
        await waitFor(() => expect(result.current.loading).toBe(false));

        let response: any;
        await act(async () => {
            response = await result.current.updateStatus(1, 'completed');
        });

        expect(response.success).toBe(true);
        // Verify update
        expect(mockUpdate).toHaveBeenCalledWith({ status: 'completed' });
        expect(mockEq).toHaveBeenCalledWith('id', 1);

        // Verify optimistic update in state
        const updatedApp = result.current.appointments.find(a => a.id === 1);
        expect(updatedApp?.status).toBe('completed');

        // Verify logging
        expect(mockInsert).toHaveBeenCalledWith([expect.objectContaining({
            appointment_id: 1,
            description: 'Estado cambiado a completed'
        })]);
    });

    it('handles update status failure', async () => {
        setupFetchMock();
        const mockEq = vi.fn().mockResolvedValue({ error: { message: 'Update failed' } });

        mockFrom.mockImplementation((table) => {
            if (table === 'appointments') {
                return {
                    select: vi.fn().mockReturnValue({
                        order: vi.fn().mockReturnThis(),
                        range: vi.fn().mockReturnThis(),
                        then: (cb: any) => Promise.resolve({ data: mockAppointments, error: null, count: 2 }).then(cb),
                    }),
                    update: vi.fn().mockReturnValue({ eq: mockEq })
                };
            }
            return { insert: vi.fn().mockResolvedValue({ error: null }) };
        });

        const { result } = renderHook(() => useAppointments({ isAdmin: true }));
        await waitFor(() => expect(result.current.loading).toBe(false));

        let response: any;
        await act(async () => {
            response = await result.current.updateStatus(1, 'completed');
        });

        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
    });

    it('handles real-time updates', async () => {
        let realtimeCallback: any;
        mockChannel.mockReturnValue({
            on: vi.fn().mockImplementation((event, filter, callback) => {
                realtimeCallback = callback;
                return { subscribe: vi.fn() };
            }),
            subscribe: vi.fn(),
        });

        setupFetchMock();
        const { result } = renderHook(() => useAppointments({ isAdmin: true }));
        await waitFor(() => expect(result.current.loading).toBe(false));

        const updatedAppointment = { ...mockAppointments[0], status: 'washing' };

        await act(async () => {
            realtimeCallback({ new: updatedAppointment });
        });

        const app = result.current.appointments.find(a => a.id === 1);
        expect(app?.status).toBe('washing');
    });
});
