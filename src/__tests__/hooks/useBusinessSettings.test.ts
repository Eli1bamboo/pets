import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';

// Mock Supabase
const mockSelect = vi.fn();
const mockUpsert = vi.fn();
const mockFrom = vi.fn();

vi.mock('@/utils/supabase/client', () => ({
    createClient: () => ({
        from: mockFrom
    })
}));

describe('useBusinessSettings', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFrom.mockReturnValue({
            select: mockSelect,
            upsert: mockUpsert
        });
        mockUpsert.mockReturnValue({ select: vi.fn().mockResolvedValue({ data: [], error: null }) });
    });

    it('fetches settings on mount', async () => {
        const mockData = [
            { key: 'cancellation_window_hours', value: 24 },
            { key: 'site_name', value: 'Pet Spa' }
        ];
        mockSelect.mockResolvedValue({ data: mockData, error: null });

        const { result } = renderHook(() => useBusinessSettings());

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.settings).toEqual({
            cancellation_window_hours: 24,
            site_name: 'Pet Spa'
        });
    });

    it('handles fetch error', async () => {
        mockSelect.mockResolvedValue({ data: null, error: { message: 'Fetch error' } });

        const { result } = renderHook(() => useBusinessSettings());

        await waitFor(() => {
            expect(result.current.error).toBe('Fetch error');
        });
    });

    it('updates a setting successfully', async () => {
        mockSelect.mockResolvedValue({ data: [], error: null });
        mockUpsert.mockReturnValue({ select: vi.fn().mockResolvedValue({ data: [], error: null }) });

        const { result } = renderHook(() => useBusinessSettings());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        let response;
        await act(async () => {
            response = await result.current.updateSetting('cancellation_window_hours', 48);
        });

        expect(response).toEqual({ success: true });
        expect(mockUpsert).toHaveBeenCalledWith({ key: 'cancellation_window_hours', value: 48 });
        expect(result.current.settings['cancellation_window_hours']).toBe(48);
    });

    it('handles update error', async () => {
        mockSelect.mockResolvedValue({ data: [], error: null });
        mockUpsert.mockReturnValue({ select: vi.fn().mockRejectedValue(new Error('Update failed')) });

        const { result } = renderHook(() => useBusinessSettings());
        await waitFor(() => { expect(result.current.loading).toBe(false); });

        let response;
        await act(async () => {
            response = await result.current.updateSetting('cancellation_window_hours', 48);
        });

        expect(response).toEqual({ success: false, error: 'Update failed' });
    });
});
