import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBooking } from '../../hooks/useBooking';
import { useRouter } from 'next/navigation';

// Mock Router
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

// Mock Supabase Chain
const mockInsert = vi.fn();
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
    const mockRouter = { push: vi.fn() };

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue(mockRouter);
    });

    it('initializes with default state', () => {
        const { result } = renderHook(() => useBooking());
        expect(result.current.submitting).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('creates a booking successfully', async () => {
        mockInsert.mockResolvedValue({ error: null });

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
            expect(res).toEqual({ success: true });
        });

        expect(mockFrom).toHaveBeenCalledWith('appointments');
        expect(mockInsert).toHaveBeenCalledWith({
            user_id: 'user-123',
            pet_name: 'Rex',
            service: 'Grooming',
            // Allow loose matching for ISO string to avoid timezone headaches
            date: expect.stringContaining('2024-02-15'),
            status: 'pending',
            price: 50,
        });

        expect(mockRouter.push).toHaveBeenCalledWith('/profile');

        await waitFor(() => {
            expect(result.current.submitting).toBe(false);
            expect(result.current.error).toBeNull();
        });
    });

    it('handles booking creation error', async () => {
        mockInsert.mockResolvedValue({ error: { message: 'Database error' } });

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

        expect(mockRouter.push).not.toHaveBeenCalled();

        await waitFor(() => {
            expect(result.current.submitting).toBe(false);
            expect(result.current.error).toBe('Database error');
        });
    });
});
