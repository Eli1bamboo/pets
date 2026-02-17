import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(customer)/login/page';
import { useRouter } from 'next/navigation';

// Mocks
const mockLogin = vi.fn();
const mockSignup = vi.fn();
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// Default mock values, can be overridden in tests
const defaultUserAuth = { user: null };
const defaultLoginHook = {
    login: mockLogin,
    signup: mockSignup,
    loading: false,
    error: null,
};

vi.mock('@/hooks/useCustomerAuth', () => ({
    useCustomerAuth: vi.fn(() => defaultUserAuth),
}));

vi.mock('@/hooks/useCustomerLogin', () => ({
    useCustomerLogin: vi.fn(() => defaultLoginHook),
}));

vi.mock('@/i18n/LanguageContext', () => ({
    useTranslation: () => ({
        t: {
            login: {
                titleLogin: 'Login',
                subtitleLogin: 'Welcome back',
                titleSignup: 'Sign Up',
                subtitleSignup: 'Create account',
                email: 'Email',
                password: 'Password',
                submitLogin: 'Log In',
                submitSignup: 'Sign Up Btn',
                switchToSignup: 'New here?',
                linkSignup: 'Create account',
                switchToLogin: 'Already have account?',
                linkLogin: 'Log in',
                signupSuccess: 'Success',
                signupSuccessMsg: 'Account created',
                sideTitleHighlight: 'Pets',
                sideSubtitle: 'Manage care',
            },
            common: {
                confirm: 'Confirm',
                cancel: 'Cancel',
                understood: 'Understood',
            }
        },
    }),
}));

vi.mock('@/components/molecules/Modal', () => ({
    Modal: ({ open, title }: any) => open ? <div data-testid="modal">{title}</div> : null,
}));

// Helper to update mocks dynamically
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { useCustomerLogin } from '@/hooks/useCustomerLogin';

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useCustomerAuth as any).mockReturnValue({ user: null });
        (useCustomerLogin as any).mockReturnValue(defaultLoginHook);
    });

    it('redirects if user is already logged in', () => {
        (useCustomerAuth as any).mockReturnValue({ user: { id: '123' } });
        render(<LoginPage />);
        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('renders login form by default', () => {
        render(<LoginPage />);
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument(); // Email placeholder
        expect(screen.getByText('Log In')).toBeInTheDocument(); // Submit button
    });

    it('switches to signup and attempts signup', async () => {
        (useCustomerLogin as any).mockReturnValue({
            ...defaultLoginHook,
            signup: mockSignup.mockResolvedValue({ success: true }),
        });

        render(<LoginPage />);

        // Switch to signup
        fireEvent.click(screen.getByText('Create account'));
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByText('Sign Up Btn')).toBeInTheDocument();

        // Fill form
        fireEvent.change(screen.getByPlaceholderText('tu@email.com'), { target: { value: 'new@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

        // Submit
        fireEvent.click(screen.getByText('Sign Up Btn'));

        await waitFor(() => {
            expect(mockSignup).toHaveBeenCalledWith('new@example.com', 'password123');
        });

        // Modal should appear on success
        expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('handles login submission', async () => {
        render(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText('tu@email.com'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password' } });

        fireEvent.click(screen.getByText('Log In'));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password');
        });
    });

    it('displays error message', () => {
        (useCustomerLogin as any).mockReturnValue({
            ...defaultLoginHook,
            error: 'Invalid credentials',
        });

        render(<LoginPage />);
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
});
