import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLoginPage from '@/app/admin/login/page';

// Mocks
const mockPush = vi.fn();
const mockAdminLogin = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/hooks/useAdminAuth', () => ({
    useAdminAuth: vi.fn(),
}));

vi.mock('@/hooks/useAdminLogin', () => ({
    useAdminLogin: vi.fn(),
}));

vi.mock('@/i18n/LanguageContext', () => ({
    useTranslation: () => ({
        t: {
            admin: {
                login: {
                    loadingPortal: 'Loading...',
                    title: 'Admin Portal',
                    subtitle: 'Login to manage',
                    emailLabel: 'Email',
                    passwordLabel: 'Password',
                    submit: 'Enter',
                    backToPublic: 'Back to site',
                    version: 'v1.0'
                }
            }
        },
    }),
}));

// Import the mocked hook to change its return value
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminLogin } from '@/hooks/useAdminLogin';

describe('AdminLoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: Not admin, not loading
        (useAdminAuth as any).mockReturnValue({ isAdmin: false, loading: false });
        // Reset default login mock
        (useAdminLogin as any).mockReturnValue({
            adminLogin: mockAdminLogin,
            loading: false,
            error: null,
        });
    });

    it('redirects if already logged in as admin', () => {
        (useAdminAuth as any).mockReturnValue({ isAdmin: true, loading: false });
        render(<AdminLoginPage />);
        expect(mockPush).toHaveBeenCalledWith('/admin');
    });

    it('renders login form', () => {
        render(<AdminLoginPage />);
        expect(screen.getByText('Admin Portal')).toBeDefined();
        expect(screen.getByLabelText('Email')).toBeDefined();
        expect(screen.getByLabelText('Password')).toBeDefined();
    });

    it('handles successful login', async () => {
        mockAdminLogin.mockResolvedValue({ success: true });
        render(<AdminLoginPage />);

        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@test.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });

        const submitBtn = screen.getByRole('button', { name: 'Enter' });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockAdminLogin).toHaveBeenCalledWith('admin@test.com', 'password');
        });

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/admin');
        });
    });

    it('handles login failure', async () => {
        // We need to re-mock useAdminLogin to return the error state *after* the function call,
        // or just rely on the component using the `error` prop from the hook.
        // The component uses `const { error } = useAdminLogin()`.
        // To test the error display, we can mock the hook to return an error initially or rerender.
        // But `useAdminLogin` hook state updates internal error. The component consumes it.
        // Since we mocked `useAdminLogin` to return `error: null` constant, we can't test dynamic update unless we mock the implementation to use state or rerender with new mock.

        // Let's just render with error state directly to verify UI
        (useAdminLogin as any).mockReturnValue({
            adminLogin: mockAdminLogin,
            loading: false,
            error: 'Invalid credentials',
        });

        render(<AdminLoginPage />);
        expect(screen.getByText('Invalid credentials')).toBeDefined();
    });

    it('navigates back to public site', () => {
        render(<AdminLoginPage />);
        const backBtn = screen.getByText('Back to site');
        fireEvent.click(backBtn);
        expect(mockPush).toHaveBeenCalledWith('/');
    });
});
