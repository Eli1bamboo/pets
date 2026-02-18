import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAvailability } from '@/features/customer/hooks/useAvailability';

// Mock specific chains - Defined externally to allowing mocking return values
const mockBusinessHoursChain: any = {
    select: vi.fn(),
    eq: vi.fn(),
    single: vi.fn(),
};
mockBusinessHoursChain.select.mockReturnValue(mockBusinessHoursChain);
mockBusinessHoursChain.eq.mockReturnValue(mockBusinessHoursChain);

const mockAppointmentsChain: any = {
    select: vi.fn(),
    gte: vi.fn(),
    lte: vi.fn(),
    neq: vi.fn(),
};
mockAppointmentsChain.select.mockReturnValue(mockAppointmentsChain);
mockAppointmentsChain.gte.mockReturnValue(mockAppointmentsChain);
mockAppointmentsChain.lte.mockReturnValue(mockAppointmentsChain);

const mockSupabase = {
    from: vi.fn((table: string) => {
        if (table === 'business_hours') return mockBusinessHoursChain;
        if (table === 'appointments') return mockAppointmentsChain;
        return { select: vi.fn().mockReturnThis() };
    }),
};

vi.mock('@/utils/supabase/client', () => ({
    createClient: () => mockSupabase,
}));

describe('useAvailability', () => {
    const originalToLocaleTimeString = Date.prototype.toLocaleTimeString;

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock ONLY Date, keep setTimeout/setInterval real for waitFor
        vi.useFakeTimers({ toFake: ['Date'] });
        const date = new Date(2024, 1, 14, 10, 0, 0); // Wednesday
        vi.setSystemTime(date);

        // Patch toLocaleTimeString to avoid JSDOM issues/locale inconsistencies
        Date.prototype.toLocaleTimeString = vi.fn(() => '10:00');
    });

    afterEach(() => {
        vi.useRealTimers();
        Date.prototype.toLocaleTimeString = originalToLocaleTimeString;
    });

    it('returns empty availability when date is missing', () => {
        const { result } = renderHook(() => useAvailability(''));
        expect(result.current.availableHours).toEqual([]);
        expect(result.current.busySlots).toEqual([]);
    });

    it('fetching business hours (filters past slots)', async () => {
        // Mock Business Hours
        mockBusinessHoursChain.single.mockResolvedValue({
            data: { open_time: '09:00', close_time: '17:00', is_active: true },
            error: null
        });

        // Mock Appointments - Use null to skip processing logic (focus on BH logic)
        mockAppointmentsChain.neq.mockResolvedValue({ data: null, error: null });

        const { result } = renderHook(() => useAvailability('2024-02-14'));

        await waitFor(() => {
            expect(mockSupabase.from).toHaveBeenCalledWith('business_hours');
            expect(result.current.loading).toBe(false);
        });

        // 9 and 10 should be skipped (mock time 10:00). 11:00 onwards available.
        expect(result.current.availableHours[0]).toBe('11:00');
        expect(result.current.availableHours).toContain('16:00');
        expect(result.current.availableHours).not.toContain('17:00');
    });

    it('handles closed days', async () => {
        // Mock Business Hours: Closed or inactive
        mockBusinessHoursChain.single.mockResolvedValue({
            data: null,
            error: { message: 'No rows' }
        });

        // Mock Appointments (still called, but return null/empty)
        mockAppointmentsChain.neq.mockResolvedValue({ data: null, error: null });

        const { result } = renderHook(() => useAvailability('2024-02-18')); // Sunday

        await waitFor(() => {
            expect(result.current.availableHours).toEqual([]);
            expect(result.current.loading).toBe(false);
        });
    });

    it('fetches existing appointments', async () => {
        // Mock Business Hours: Open 09:00 - 12:00
        mockBusinessHoursChain.single.mockResolvedValue({
            data: { open_time: '09:00', close_time: '12:00', is_active: true },
            error: null
        });

        // Mock Appointments: One at 11:00
        // We ensure data is returned to verify busySlots processing
        mockAppointmentsChain.neq.mockResolvedValue({
            data: [{ date: '2024-02-15T11:00:00' }],
            error: null
        });

        const { result } = renderHook(() => useAvailability('2024-02-15')); // Future date

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.busySlots.length).toBeGreaterThan(0);
        });
    });
});
