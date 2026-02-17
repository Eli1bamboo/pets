import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useServices } from '@/hooks/useServices';

// Mock Supabase
const mockFrom = vi.fn();

vi.mock('@/utils/supabase/client', () => ({
    createClient: () => ({
        from: mockFrom,
    }),
}));

const mockServices = [
    { id: 1, name: 'Service 1', is_active: true, sort_order: 1 },
    { id: 2, name: 'Service 2', is_active: false, sort_order: 2 },
];

describe('useServices', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches active services by default', async () => {
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect });

        // Mock chain: .from('services').select('*').order('sort_order', ...).eq('is_active', true)
        const mockEq = vi.fn().mockResolvedValue({ data: [mockServices[0]], error: null });
        const mockOrder = vi.fn().mockReturnValue({ eq: mockEq });
        mockSelect.mockReturnValue({ order: mockOrder });

        const { result } = renderHook(() => useServices());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.services).toEqual([mockServices[0]]);
        expect(mockEq).toHaveBeenCalledWith('is_active', true);
    });

    it('fetches all services when includeInactive is true', async () => {
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect });

        // Mock chain: .from('services').select('*').order('sort_order', ...) -> resolves directly
        const mockOrder = vi.fn().mockResolvedValue({ data: mockServices, error: null });
        mockSelect.mockReturnValue({ order: mockOrder });

        const { result } = renderHook(() => useServices({ includeInactive: true }));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.services).toEqual(mockServices);
        // Should NOT call eq('is_active', true)
    });

    it('handles fetch error', async () => {
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect });

        // Force error
        const mockOrder = vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: new Error("Fetch failed") })
        });
        mockSelect.mockReturnValue({ order: mockOrder });

        const { result } = renderHook(() => useServices());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe("Error loading services");
        expect(result.current.services).toEqual([]);
    });

    it('creates a service', async () => {
        // Setup initial fetch mock (empty)
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect, insert: vi.fn() });
        const mockOrder = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) });
        mockSelect.mockReturnValue({ order: mockOrder });

        const { result } = renderHook(() => useServices());
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Mock insert
        const mockInsert = vi.fn().mockResolvedValue({ error: null });
        mockFrom.mockReturnValue({
            select: mockSelect, // Need select for refetch
            insert: mockInsert
        });

        const newService = { name: 'New Service', price: 100, is_active: true, sort_order: 3 } as any;

        let success;
        await act(async () => {
            const res = await result.current.createService(newService);
            success = res.success;
        });

        expect(success).toBe(true);
        expect(mockInsert).toHaveBeenCalledWith(newService);
        // Should trigger refetch (mockSelect called twice total)
        expect(mockSelect).toHaveBeenCalledTimes(2);
    });

    it('updates a service', async () => {
        // Setup initial fetch
        const mockSelect = vi.fn();
        const mockOrder = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) });
        mockSelect.mockReturnValue({ order: mockOrder });
        mockFrom.mockReturnValue({ select: mockSelect });

        const { result } = renderHook(() => useServices());
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Mock update
        const mockEq = vi.fn().mockResolvedValue({ error: null });
        const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
        mockFrom.mockReturnValue({
            select: mockSelect,
            update: mockUpdate
        });

        const updateData = { name: 'Updated' };
        let success;
        await act(async () => {
            const res = await result.current.updateService(1, updateData);
            success = res.success;
        });

        expect(success).toBe(true);
        expect(mockUpdate).toHaveBeenCalledWith(updateData);
        expect(mockEq).toHaveBeenCalledWith('id', 1);
        expect(mockSelect).toHaveBeenCalledTimes(2); // Initial + Refetch
    });

    it('soft deletes a service', async () => {
        // Setup initial fetch
        const mockSelect = vi.fn();
        const mockOrder = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) });
        mockSelect.mockReturnValue({ order: mockOrder });
        mockFrom.mockReturnValue({ select: mockSelect });

        const { result } = renderHook(() => useServices());
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Mock update (soft delete)
        const mockEq = vi.fn().mockResolvedValue({ error: null });
        const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
        mockFrom.mockReturnValue({
            select: mockSelect,
            update: mockUpdate
        });

        let success;
        await act(async () => {
            const res = await result.current.deleteService(1);
            success = res.success;
        });

        expect(success).toBe(true);
        expect(mockUpdate).toHaveBeenCalledWith({ is_active: false }); // Soft delete check
        expect(mockEq).toHaveBeenCalledWith('id', 1);
        expect(mockSelect).toHaveBeenCalledTimes(2);
    });

    it('handles create service failure', async () => {
        const mockSelect = vi.fn().mockReturnValue({ order: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) });
        mockFrom.mockReturnValue({ select: mockSelect });

        const { result } = renderHook(() => useServices());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockFrom.mockReturnValue({
            select: mockSelect,
            insert: vi.fn().mockResolvedValue({ error: { message: 'Insert failed' } })
        });

        let response: any;
        await act(async () => {
            response = await result.current.createService({ name: 'New' } as any);
        });

        expect(response.success).toBe(false);
    });

    it('handles update service failure', async () => {
        const mockSelect = vi.fn().mockReturnValue({ order: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) });
        mockFrom.mockReturnValue({ select: mockSelect });

        const { result } = renderHook(() => useServices());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockFrom.mockReturnValue({
            select: mockSelect,
            update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: { message: 'Update failed' } }) })
        });

        let response: any;
        await act(async () => {
            response = await result.current.updateService(1, { name: 'New' });
        });

        expect(response.success).toBe(false);
    });

    it('handles delete service failure', async () => {
        const mockSelect = vi.fn().mockReturnValue({ order: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) });
        mockFrom.mockReturnValue({ select: mockSelect });

        const { result } = renderHook(() => useServices());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockFrom.mockReturnValue({
            select: mockSelect,
            update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: { message: 'Delete failed' } }) })
        });

        let response: any;
        await act(async () => {
            response = await result.current.deleteService(1);
        });

        expect(response.success).toBe(false);
    });
});
