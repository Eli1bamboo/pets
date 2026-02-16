import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCustomerLogin } from '../../hooks/useCustomerLogin';

// Mock Supabase
const mockSignInWithPassword = vi.fn();
const mockSupabase = {
    auth: {
        signInWithPassword: mockSignInWithPassword,
    },
};

vi.mock('@/utils/supabase/client', () => ({
    createClient: () => mockSupabase,
}));

describe('useCustomerLogin', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initializes with default state', () => {
        const { result } = renderHook(() => useCustomerLogin());
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('handles successful login', async () => {
        mockSignInWithPassword.mockResolvedValue({ data: { user: { id: '123' } }, error: null });

        const { result } = renderHook(() => useCustomerLogin());

        // Call login
        await act(async () => {
            await result.current.login('test@example.com', 'password');
        });

        // Check loading state during? (Might be too fast with mockResolvedValue)
        // Check final state
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password',
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBeNull();
        });
    });

    it('handles login error', async () => {
        mockSignInWithPassword.mockResolvedValue({
            data: null,
            error: new Error('Invalid credentials'),
        });

        const { result } = renderHook(() => useCustomerLogin());

        await act(async () => {
            await result.current.login('test@example.com', 'wrong');
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe('Invalid credentials');
        });
    });
});
