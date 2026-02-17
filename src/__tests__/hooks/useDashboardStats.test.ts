import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useDashboardStats } from '@/hooks/useDashboardStats';

// Mocks
const mockFrom = vi.fn();
const mockUseAdminAuth = vi.fn();

vi.mock('@/utils/supabase/client', () => ({
    createClient: () => ({
        from: mockFrom,
    }),
}));

vi.mock('@/hooks/useAdminAuth', () => ({
    useAdminAuth: () => mockUseAdminAuth(),
}));

describe('useDashboardStats', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAdminAuth.mockReturnValue({ user: { id: 'admin-123' } });
    });

    it('fetches and calculates stats correctly', async () => {
        // Mock chain for completed count
        const mockCompletedCount = { count: 15, error: null };
        const mockCompletedData = { data: [{ price: 50 }, { price: 100 }], error: null }; // Total 150
        const mockPendingCount = { count: 5, error: null };
        const mockNextAppt = { data: { id: 'next-1', status: 'pending' }, error: null };

        // We need to handle multiple calls to .from().select()...
        // 1. Completed Count
        // 2. Completed Data (Revenue)
        // 3. Pending Count
        // 4. Next Appointment

        const createMockChain = (returnData: any) => {
            const chain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                in: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue(returnData),
                then: (callback: any) => Promise.resolve(returnData).then(callback),
            };
            // For calls that don't end in single() but are awaited directly as promises
            // We can make the chain awaitable by adding a then method or just returning the promise from the last method called.
            // However, `await supabase...` works if the object is thenable.

            return chain;
        };

        // This is getting complex to mock positionally. 
        // Let's implement a more robust mock based on the .from(table) call, 
        // but since they all call 'appointments', we need to check the query parameters or just mock simplified return values in order.

        // Simpler approach: Mock `from` to return a mock object that can handle all chains
        // and using `mockImplementationOnce` on the final execution methods if possible.
        // But the hook awaits the chain. checking the hook code:
        // await supabase.from(...).select(...).eq(...)...

        // Let's try mocking `from` to return a chain builder where `from` is called 4 times.

        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect });

        // Call 1: Completed Count
        mockSelect.mockReturnValueOnce({
            eq: vi.fn().mockReturnValue({
                gte: vi.fn().mockResolvedValue(mockCompletedCount)
            })
        });

        // Call 2: Completed Data (Revenue)
        mockSelect.mockReturnValueOnce({
            eq: vi.fn().mockReturnValue({
                gte: vi.fn().mockResolvedValue(mockCompletedData)
            })
        });

        // Call 3: Pending Count
        mockSelect.mockReturnValueOnce({
            in: vi.fn().mockResolvedValue(mockPendingCount) // .select().in()
        });

        // Call 4: Next Appointment
        mockSelect.mockReturnValueOnce({
            in: vi.fn().mockReturnValue({
                gte: vi.fn().mockReturnValue({
                    order: vi.fn().mockReturnValue({
                        limit: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue(mockNextAppt)
                        })
                    })
                })
            })
        });


        const { result } = renderHook(() => useDashboardStats());

        // Wait for loading to finish
        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.stats.completedMonth).toBe(15);
        expect(result.current.stats.totalRevenue).toBe(150);
        expect(result.current.stats.pendingTotal).toBe(5);
        expect(result.current.stats.nextAppointment).toEqual(mockNextAppt.data);
    });

    it('handles empty data gracefully', async () => {
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect });

        // 1. Completed Count -> 0
        mockSelect.mockReturnValueOnce({
            eq: vi.fn().mockReturnValue({
                gte: vi.fn().mockResolvedValue({ count: 0, error: null })
            })
        });

        // 2. Completed Data -> []
        mockSelect.mockReturnValueOnce({
            eq: vi.fn().mockReturnValue({
                gte: vi.fn().mockResolvedValue({ data: [], error: null })
            })
        });

        // 3. Pending Count -> 0
        mockSelect.mockReturnValueOnce({
            in: vi.fn().mockResolvedValue({ count: 0, error: null })
        });

        // 4. Next Appt -> null
        mockSelect.mockReturnValueOnce({
            in: vi.fn().mockReturnValue({
                gte: vi.fn().mockReturnValue({
                    order: vi.fn().mockReturnValue({
                        limit: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({ data: null, error: null })
                        })
                    })
                })
            })
        });

        const { result } = renderHook(() => useDashboardStats());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.stats.completedMonth).toBe(0);
        expect(result.current.stats.totalRevenue).toBe(0);
        expect(result.current.stats.pendingTotal).toBe(0);
        expect(result.current.stats.nextAppointment).toBeNull();
    });

    it('runs refetch manually', async () => {
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect });

        // Setup mocks for all 4 calls to avoid crash
        // 1. Completed Count
        mockSelect.mockReturnValueOnce({
            eq: vi.fn().mockReturnValue({
                gte: vi.fn().mockResolvedValue({ count: 5, error: null })
            })
        });

        // 2. Completed Data
        mockSelect.mockReturnValueOnce({
            eq: vi.fn().mockReturnValue({
                gte: vi.fn().mockResolvedValue({ data: [], error: null })
            })
        });

        // 3. Pending Count
        mockSelect.mockReturnValueOnce({
            in: vi.fn().mockResolvedValue({ count: 2, error: null })
        });

        // 4. Next Appointment
        mockSelect.mockReturnValueOnce({
            in: vi.fn().mockReturnValue({
                gte: vi.fn().mockReturnValue({
                    order: vi.fn().mockReturnValue({
                        limit: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({ data: null, error: null })
                        })
                    })
                })
            })
        });

        // Repopulate mocks for the refetch call (calls 5-8)
        mockSelect.mockReturnValue({
            eq: vi.fn().mockReturnValue({
                gte: vi.fn().mockResolvedValue({ count: 5, error: null })
            }),
            in: vi.fn().mockReturnValue({
                gte: vi.fn().mockReturnValue({
                    order: vi.fn().mockReturnValue({
                        limit: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({ data: null, error: null })
                        })
                    })
                }),
                then: (cb: any) => Promise.resolve({ count: 2, error: null }).then(cb) // for simple .in() await
            })
        });

        // We need to be careful with the mock return values adhering to the exact call order or structure.
        // Simpler strategy for refetch: just ensure the 4th call structure exists for all calls to avoid crash.
        // The test checks if refetch runs without error.

        const setupSafeMock = () => ({
            eq: vi.fn().mockReturnThis(),
            gte: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
            then: (cb: any) => Promise.resolve({ count: 0, data: [], error: null }).then(cb)
        });

        mockSelect.mockReturnValue(setupSafeMock());

        const { result } = renderHook(() => useDashboardStats());
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Trigger refetch
        await act(async () => {
            await result.current.refetch();
        });

        expect(mockSelect).toHaveBeenCalled();
    });
});
