import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminLogin } from '@/hooks/useAdminLogin';

// Mock Supabase
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();
const mockFrom = vi.fn();

vi.mock('@/utils/supabase/client', () => ({
    createClient: () => ({
        auth: {
            signInWithPassword: mockSignIn,
            signOut: mockSignOut,
        },
        from: mockFrom,
    }),
}));

describe('useAdminLogin', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('handles successful admin login', async () => {
        // Mock successful sign in
        mockSignIn.mockResolvedValue({ data: { user: { id: 'admin-123' } }, error: null });

        // Mock profile check
        mockFrom.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
                }),
            }),
        });

        const { result } = renderHook(() => useAdminLogin());

        let loginResult;
        await act(async () => {
            loginResult = await result.current.adminLogin('admin@example.com', 'password');
        });

        expect(loginResult).toEqual({ success: true });
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('handles non-admin login attempt', async () => {
        // Mock successful sign in
        mockSignIn.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });

        // Mock profile check (customer role)
        mockFrom.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: { role: 'customer' }, error: null }),
                }),
            }),
        });

        const { result } = renderHook(() => useAdminLogin());

        let loginResult;
        await act(async () => {
            loginResult = await result.current.adminLogin('user@example.com', 'password');
        });

        expect(loginResult).toEqual({
            success: false,
            error: "Acceso denegado. Esta cuenta no tiene permisos de administrador."
        });
        expect(mockSignOut).toHaveBeenCalled(); // Should sign out immediately
    });

    it('handles auth error', async () => {
        mockSignIn.mockResolvedValue({ data: null, error: new Error('Invalid credentials') });

        const { result } = renderHook(() => useAdminLogin());

        let loginResult;
        await act(async () => {
            loginResult = await result.current.adminLogin('wrong@example.com', 'pass');
        });

        expect(loginResult).toEqual({ success: false, error: 'Invalid credentials' });
        expect(result.current.error).toBe('Invalid credentials');
    });
});
