import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

// Mocks
const mockPush = vi.fn();
const mockUseAdminContext = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/providers/AdminProvider', () => ({
    useAdminContext: () => mockUseAdminContext(),
}));

describe('useAdminAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns context values', () => {
        mockUseAdminContext.mockReturnValue({
            user: { id: '1' },
            profile: { role: 'admin' },
            loading: false,
            isAdmin: true,
            signOut: vi.fn(),
        });

        const { result } = renderHook(() => useAdminAuth());

        expect(result.current.user).toBeDefined();
        expect(result.current.isAdmin).toBe(true);
    });

    it('redirects to login if not authenticated and redirectToLogin is true', () => {
        mockUseAdminContext.mockReturnValue({
            user: null, // Not logged in
            loading: false,
            isAdmin: false,
        });

        renderHook(() => useAdminAuth({ redirectToLogin: true }));

        expect(mockPush).toHaveBeenCalledWith('/admin/login');
    });

    it('does not redirect if loading', () => {
        mockUseAdminContext.mockReturnValue({
            user: null,
            loading: true, // Still loading
            isAdmin: false,
        });

        renderHook(() => useAdminAuth({ redirectToLogin: true }));

        expect(mockPush).not.toHaveBeenCalled();
    });

    it('does not redirect if authenticated', () => {
        mockUseAdminContext.mockReturnValue({
            user: { id: '1' },
            loading: false,
            isAdmin: true, // Logged in as admin
        });

        renderHook(() => useAdminAuth({ redirectToLogin: true }));

        expect(mockPush).not.toHaveBeenCalled();
    });
});
