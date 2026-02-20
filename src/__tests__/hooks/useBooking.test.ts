import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBooking } from '@/features/customer/hooks/useBooking';

// Mock Supabase Chain — supports .insert().select().single()
const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({ single: mockSingle }));
const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockFrom = vi.fn(() => ({
    insert: mockInsert,
}));

const mockSupabase = {
    from: mockFrom,
};

vi.mock('@/utils/supabase/client', () => ({
    createClient: () => mockSupabase,
}));

describe('useBooking', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initializes with default state', () => {
        const { result } = renderHook(() => useBooking());
        expect(result.current.submitting).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('creates a booking successfully and returns appointmentId', async () => {
        mockSingle.mockResolvedValue({ data: { id: 42 }, error: null });

        const { result } = renderHook(() => useBooking());

        const bookingData = {
            userId: 'user-123',
            petName: 'Rex',
            service: 'Grooming',
            date: '2024-02-15',
            time: '10:00',
            price: 50
        };

        await act(async () => {
            const res = await result.current.createBooking(bookingData);
            expect(res).toEqual({ success: true, appointmentId: 42 });
        });

        expect(mockFrom).toHaveBeenCalledWith('appointments');
        expect(mockInsert).toHaveBeenCalledWith({
            user_id: 'user-123',
            pet_name: 'Rex',
            service: 'Grooming',
            date: expect.stringContaining('2024-02-15'),
            status: 'pending',
            price: 50,
        });
        expect(mockSelect).toHaveBeenCalledWith('id');

        await waitFor(() => {
            expect(result.current.submitting).toBe(false);
            expect(result.current.error).toBeNull();
        });
    });

    it('handles booking creation error', async () => {
        mockSingle.mockResolvedValue({ data: null, error: { message: 'Database error' } });

        const { result } = renderHook(() => useBooking());

        const bookingData = {
            userId: 'user-123',
            petName: 'Rex',
            service: 'Grooming',
            date: '2024-02-15',
            time: '10:00',
            price: 50
        };

        await act(async () => {
            const res = await result.current.createBooking(bookingData);
            expect(res).toEqual({ success: false, error: 'Database error' });
        });

        await waitFor(() => {
            expect(result.current.submitting).toBe(false);
            expect(result.current.error).toBe('Database error');
        });
    });
});
