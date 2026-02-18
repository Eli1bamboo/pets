import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { SettingsSidebar } from '@/features/admin/components/organisms/SettingsSidebar';

// Mocks
const mockCloseSidebar = vi.fn();
const mockSaveSettings = vi.fn();
const mockUpdateSetting = vi.fn();

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

const mockSettings = { cancellation_window_hours: 24 };

vi.mock('@/hooks/useBusinessSettings', () => ({
    useBusinessSettings: () => ({
        settings: mockSettings,
        loading: false,
        updateSetting: mockUpdateSetting,
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

    it('renders business hours and cancellation policy', () => {
        render(<SettingsSidebar />);
        expect(screen.getByText('Lunes')).toBeDefined();
        expect(screen.getByText(/Política de Cancelación/)).toBeDefined();
        expect(screen.getByLabelText(/Tiempo mínimo para cancelar/)).toBeDefined();
        // Check default value
        const input = screen.getByLabelText(/Tiempo mínimo para cancelar/) as HTMLInputElement;
        expect(input.value).toBe('24');
    });

    it('saves settings and cancellation policy successfully', async () => {
        mockSaveSettings.mockResolvedValue({ success: true });
        mockUpdateSetting.mockResolvedValue({ success: true });
        render(<SettingsSidebar />);

        const input = screen.getByLabelText(/Tiempo mínimo para cancelar/);
        fireEvent.change(input, { target: { value: '48' } });

        const saveBtn = screen.getByText('Guardar');
        await act(async () => {
            fireEvent.click(saveBtn);
        });

        expect(mockSaveSettings).toHaveBeenCalled();
        expect(mockUpdateSetting).toHaveBeenCalledWith('cancellation_window_hours', 48);

        await waitFor(() => {
            expect(screen.getByText(/Configuración guardada correctamente/i)).toBeDefined();
        });
    });

    it('handles save failure in business hours', async () => {
        mockSaveSettings.mockResolvedValue({ success: false, error: { message: 'Hours API Error' } });
        mockUpdateSetting.mockResolvedValue({ success: true });
        render(<SettingsSidebar />);

        const saveBtn = screen.getByText('Guardar');
        await act(async () => {
            fireEvent.click(saveBtn);
        });

        await waitFor(() => {
            expect(screen.getByText(/Error al guardar: Hours API Error/i)).toBeDefined();
        });
    });

    it('handles save failure in settings', async () => {
        mockSaveSettings.mockResolvedValue({ success: true });
        mockUpdateSetting.mockResolvedValue({ success: false, error: 'Settings API Error' });
        render(<SettingsSidebar />);

        const saveBtn = screen.getByText('Guardar');
        await act(async () => {
            fireEvent.click(saveBtn);
        });

        await waitFor(() => {
            expect(screen.getByText(/Error al guardar: Settings API Error/i)).toBeDefined();
        });
    });
});
