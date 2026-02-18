import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SidebarContainer } from '@/features/admin/components/organisms/SidebarContainer';

// Mocks
const mockCloseSidebar = vi.fn();

vi.mock('@/providers/AdminUIProvider', () => ({
    useAdminUI: vi.fn(),
    useRefresh: () => ({ refreshTrigger: 0, triggerRefresh: vi.fn() }),
}));

vi.mock('@/components/molecules/SidebarSheet', () => ({
    SidebarSheet: ({ children, open }: any) => open ? <div data-testid="sidebar-sheet">{children}</div> : null,
    SheetContent: ({ children }: any) => <div data-testid="sidebar-content">{children}</div>,
    SheetHeader: ({ children }: any) => <div data-testid="sheet-header">{children}</div>,
    SheetTitle: ({ children }: any) => <div data-testid="sheet-title">{children}</div>,
    SheetDescription: ({ children }: any) => <div data-testid="sheet-description">{children}</div>,
}));

vi.mock('@/features/admin/components/organisms/AppointmentDetailsSidebar', () => ({
    AppointmentDetailsSidebar: () => <div data-testid="appointment-details-view">Appointment Details</div>,
}));

vi.mock('@/features/admin/components/organisms/SettingsSidebar', () => ({
    SettingsSidebar: () => <div data-testid="settings-view">Settings</div>,
}));

vi.mock('@/features/admin/components/organisms/ServiceFormSidebar', () => ({
    ServiceFormSidebar: () => <div data-testid="service-form-view">Service Form</div>,
}));

import { useAdminUI } from '@/providers/AdminUIProvider';

describe('SidebarContainer', () => {
    it('renders nothing when closed', () => {
        vi.mocked(useAdminUI).mockReturnValue({
            sidebar: { isOpen: false, view: null },
            closeSidebar: mockCloseSidebar,
            triggerRefresh: vi.fn(),
        } as any);

        render(<SidebarContainer />);
        expect(screen.queryByTestId('sidebar-sheet')).toBeNull();
    });

    it('renders appointment details view', () => {
        vi.mocked(useAdminUI).mockReturnValue({
            sidebar: { isOpen: true, view: 'appointment_details', data: { appointment: { id: 1 } } },
            closeSidebar: mockCloseSidebar,
            triggerRefresh: vi.fn(),
        } as any);

        render(<SidebarContainer />);
        expect(screen.getByTestId('appointment-details-view')).toBeDefined();
    });

    it('renders settings view', () => {
        vi.mocked(useAdminUI).mockReturnValue({
            sidebar: { isOpen: true, view: 'settings' },
            closeSidebar: mockCloseSidebar,
            triggerRefresh: vi.fn(),
        } as any);

        render(<SidebarContainer />);
        expect(screen.getByTestId('settings-view')).toBeDefined();
    });

    it('renders service form view', () => {
        vi.mocked(useAdminUI).mockReturnValue({
            sidebar: { isOpen: true, view: 'service_form', data: { service: { id: 1 } } },
            closeSidebar: mockCloseSidebar,
            triggerRefresh: vi.fn(),
        } as any);

        render(<SidebarContainer />);
        expect(screen.getByTestId('service-form-view')).toBeDefined();
    });
});
