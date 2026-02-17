import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { SettingsSidebar } from '@/components/organisms/SettingsSidebar';

// Mocks
const mockCloseSidebar = vi.fn();
const mockSaveSettings = vi.fn();

vi.mock('@/providers/AdminUIProvider', () => ({
    useAdminUI: () => ({
        closeSidebar: mockCloseSidebar,
    }),
}));

const mockBusinessHours = [
    { id: 1, day_of_week: 1, open_time: '09:00:00', close_time: '18:00:00', is_active: true },
    { id: 2, day_of_week: 2, open_time: '09:00:00', close_time: '18:00:00', is_active: false },
];

vi.mock('@/hooks/useBusinessHours', () => ({
    useBusinessHours: () => ({
        businessHours: mockBusinessHours,
        loading: false,
        saveSettings: mockSaveSettings,
    }),
}));

// Mock SidebarSheet components
vi.mock('@/components/molecules/SidebarSheet', () => ({
    SheetHeader: ({ children }: any) => <div>{children}</div>,
    SheetTitle: ({ children }: any) => <h2>{children}</h2>,
    SheetDescription: ({ children }: any) => <p>{children}</p>,
}));

describe('SettingsSidebar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders business hours', () => {
        render(<SettingsSidebar />);
        expect(screen.getByText('Lunes')).toBeDefined();
        expect(screen.getByText('Martes')).toBeDefined();
        // Lunes is active, so it should have time inputs
        expect(screen.getAllByDisplayValue('09:00')).toHaveLength(1); // Open time for Lunes
        expect(screen.getAllByDisplayValue('18:00')).toHaveLength(1); // Close time for Lunes
    });

    it('toggles a day active state', async () => {
        render(<SettingsSidebar />);
        const buttons = screen.getAllByRole('button');
        const lunesToggle = buttons[0]; // First day toggle

        await act(async () => {
            fireEvent.click(lunesToggle);
        });

        // Martes is at buttons[1] (if not loading)
    });

    it('saves settings successfully', async () => {
        mockSaveSettings.mockResolvedValue({ success: true });
        render(<SettingsSidebar />);

        const saveBtn = screen.getByText('Guardar');
        await act(async () => {
            fireEvent.click(saveBtn);
        });

        expect(mockSaveSettings).toHaveBeenCalled();
        await waitFor(() => {
            expect(screen.getByText(/Configuración guardada correctamente/i)).toBeDefined();
        });
    });

    it('handles save failure', async () => {
        mockSaveSettings.mockResolvedValue({ success: false, error: { message: 'API Error' } });
        render(<SettingsSidebar />);

        const saveBtn = screen.getByText('Guardar');
        await act(async () => {
            fireEvent.click(saveBtn);
        });

        await waitFor(() => {
            expect(screen.getByText(/Error al guardar: API Error/i)).toBeDefined();
        });
    });

    it('closes the sidebar', () => {
        render(<SettingsSidebar />);
        const closeBtn = screen.getByText('Cerrar');
        fireEvent.click(closeBtn);
        expect(mockCloseSidebar).toHaveBeenCalled();
    });
});
