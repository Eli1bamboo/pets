import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useBusinessHours } from '@/hooks/useBusinessHours';

// Mock Supabase
const mockFrom = vi.fn();

vi.mock('@/utils/supabase/client', () => ({
    createClient: () => ({
        from: mockFrom,
    }),
}));

const mockHours = [
    { id: 1, day_of_week: 1, open_time: '09:00', close_time: '18:00', is_active: true },
    { id: 2, day_of_week: 2, open_time: '09:00', close_time: '18:00', is_active: true },
];

describe('useBusinessHours', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches business hours on mount', async () => {
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect });

        const mockOrder = vi.fn().mockResolvedValue({ data: mockHours, error: null });
        mockSelect.mockReturnValue({ order: mockOrder });

        const { result } = renderHook(() => useBusinessHours());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.businessHours).toEqual(mockHours);
        expect(mockSelect).toHaveBeenCalledWith('*');
    });

    it('updates a single business hour', async () => {
        // Setup initial fetch
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect });
        mockSelect.mockReturnValue({ order: vi.fn().mockResolvedValue({ data: mockHours, error: null }) });

        const { result } = renderHook(() => useBusinessHours());
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Mock update
        const mockUpdate = vi.fn();
        const mockEq = vi.fn().mockResolvedValue({ error: null });
        mockUpdate.mockReturnValue({ eq: mockEq });
        mockFrom.mockReturnValue({
            select: mockSelect,
            update: mockUpdate
        });

        let success;
        await act(async () => {
            const res = await result.current.updateBusinessHour(1, { open_time: '10:00' });
            success = res.success;
        });

        expect(success).toBe(true);
        expect(mockUpdate).toHaveBeenCalledWith({ open_time: '10:00' });
        expect(mockEq).toHaveBeenCalledWith('id', 1);

        // Verify optimistic update
        expect(result.current.businessHours[0].open_time).toBe('10:00');
    });

    it('saves multiple settings (upsert)', async () => {
        // Setup initial fetch
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect });
        mockSelect.mockReturnValue({ order: vi.fn().mockResolvedValue({ data: [], error: null }) });

        const { result } = renderHook(() => useBusinessHours());
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Mock upsert
        const mockUpsert = vi.fn().mockResolvedValue({ error: null });
        mockFrom.mockReturnValue({
            select: mockSelect,
            upsert: mockUpsert
        });

        let success;
        await act(async () => {
            const res = await result.current.saveSettings(mockHours);
            success = res.success;
        });

        expect(success).toBe(true);
        expect(mockUpsert).toHaveBeenCalledWith(mockHours, { onConflict: 'day_of_week' });
        expect(result.current.businessHours).toEqual(mockHours);
    });

    it('handles fetch error', async () => {
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect });
        mockSelect.mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Fetch failed' } })
        });

        const { result } = renderHook(() => useBusinessHours());
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.businessHours).toEqual([]);
    });

    it('handles update error', async () => {
        // Setup initial fetch
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect });
        mockSelect.mockReturnValue({ order: vi.fn().mockResolvedValue({ data: mockHours, error: null }) });

        const { result } = renderHook(() => useBusinessHours());
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Mock update error
        const mockUpdate = vi.fn();
        const mockEq = vi.fn().mockResolvedValue({ error: { message: 'Update failed' } });
        mockUpdate.mockReturnValue({ eq: mockEq });
        mockFrom.mockReturnValue({
            select: mockSelect,
            update: mockUpdate
        });

        let res: any;
        await act(async () => {
            res = await result.current.updateBusinessHour(1, { open_time: '10:00' });
        });

        expect(res?.success).toBe(false);
        // State should NOT change on error
        expect(result.current.businessHours[0].open_time).toBe('09:00');
    });
});
