import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AdminHeader } from '@/components/organisms/AdminHeader';

// Mocks
const mockSignOut = vi.fn();
const mockSetLanguage = vi.fn();

vi.mock('@/hooks/useAdminAuth', () => ({
    useAdminAuth: () => ({
        signOut: mockSignOut,
    }),
}));

vi.mock('@/i18n/LanguageContext', () => ({
    useTranslation: () => ({
        t: {
            admin: {
                header: {
                    dashboard: 'Dashboard',
                    appointments: 'Appointments',
                    services: 'Services',
                    history: 'History',
                    logout: 'Logout',
                    logoutMobile: 'Logout Mobile',
                }
            }
        },
        language: 'es',
        setLanguage: mockSetLanguage,
    }),
}));

describe('AdminHeader', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders navigation items', () => {
        render(<AdminHeader />);
        expect(screen.getByText('Dashboard')).toBeDefined();
        expect(screen.getByText('Appointments')).toBeDefined();
        expect(screen.getByText('Services')).toBeDefined();
        expect(screen.getByText('History')).toBeDefined();
    });

    it('changes language', () => {
        render(<AdminHeader />);
        const select = screen.getAllByRole('combobox')[0]; // Desktop select
        fireEvent.change(select, { target: { value: 'en' } });
        expect(mockSetLanguage).toHaveBeenCalledWith('en');
    });

    it('calls signOut', () => {
        render(<AdminHeader />);
        const logoutBtn = screen.getByText('Logout');
        fireEvent.click(logoutBtn);
        expect(mockSignOut).toHaveBeenCalledWith('/admin/login');
    });

    it('toggles mobile menu and interacts with mobile items', async () => {
        render(<AdminHeader />);

        // Find menu button
        const buttons = screen.getAllByRole('button');
        const menuBtn = buttons[buttons.length - 1];

        await act(async () => {
            fireEvent.click(menuBtn);
        });

        expect(screen.getByText('Logout Mobile')).toBeDefined();

        // Check mobile links
        const dashboardLinks = screen.getAllByText('Dashboard');
        expect(dashboardLinks).toHaveLength(2); // One desktop, one mobile

        // Check mobile language switcher
        const selects = screen.getAllByRole('combobox');
        expect(selects).toHaveLength(2); // One desktop, one mobile
        fireEvent.change(selects[1], { target: { value: 'en' } });
        expect(mockSetLanguage).toHaveBeenCalledWith('en');

        // Check mobile logout
        const mobileLogout = screen.getByText('Logout Mobile');
        fireEvent.click(mobileLogout);
        expect(mockSignOut).toHaveBeenCalledWith('/admin/login');

        // Close menu
        await act(async () => {
            fireEvent.click(menuBtn);
        });

        expect(screen.queryByText('Logout Mobile')).toBeNull();
    });
});
