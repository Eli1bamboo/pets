import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppointmentDetailsSidebar } from '../../components/organisms/AppointmentDetailsSidebar';
import { Appointment } from '@/types';

// Mocks
const mockUpdateStatus = vi.fn();
const mockCloseSidebar = vi.fn();
const mockTriggerRefresh = vi.fn();

vi.mock('@/providers/AdminUIProvider', () => ({
    useAdminUI: () => ({
        closeSidebar: mockCloseSidebar,
    }),
    useRefresh: () => ({
        triggerRefresh: mockTriggerRefresh,
    }),
}));

vi.mock('@/hooks/useAppointments', () => ({
    useAppointments: () => ({
        updateStatus: mockUpdateStatus,
    }),
}));

const mockAppointmentData: Appointment = {
    id: 123,
    created_at: '2024-02-14T10:00:00Z',
    user_id: 'user-1',
    pet_name: 'Rex',
    service: 'Baño',
    date: '2024-02-15T10:00:00',
    status: 'pending',
    price: 50,
    profiles: {
        full_name: 'Juan Perez',
    },
};

vi.mock('@/hooks/useAppointment', () => ({
    useAppointment: () => ({
        appointment: mockAppointmentData,
        loading: false,
    }),
}));

vi.mock('@/hooks/useAppointmentLogs', () => ({
    useAppointmentLogs: () => ({
        logs: [
            { id: '1', appointment_id: 123, description: 'Log 1', created_at: '2024-02-14T10:05:00Z' },
        ],
        loading: false,
    }),
}));

// Mock simple components to avoid complex rendering
vi.mock('@/components/molecules/SidebarSheet', () => ({
    SheetHeader: ({ children }: any) => <div>{children}</div>,
    SheetTitle: ({ children }: any) => <h1>{children}</h1>,
    SheetDescription: ({ children }: any) => <p>{children}</p>,
}));

vi.mock('@/components/molecules/Modal', () => ({
    Modal: ({ open, onConfirm, title }: any) => open ? (
        <div data-testid="modal">
            <h2>{title}</h2>
            <button onClick={onConfirm}>Confirmar Modal</button>
        </div>
    ) : null,
}));

describe('AppointmentDetailsSidebar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders appointment details', () => {
        render(<AppointmentDetailsSidebar appointment={mockAppointmentData} />);

        expect(screen.getByText('Detalles del Turno')).toBeInTheDocument();
        expect(screen.getByText('Juan Perez')).toBeInTheDocument();
        expect(screen.getByText('Rex')).toBeInTheDocument();
        expect(screen.getByText('Baño')).toBeInTheDocument();
        expect(screen.getByText('Log 1')).toBeInTheDocument();
    });

    it('updates status', async () => {
        render(<AppointmentDetailsSidebar appointment={mockAppointmentData} />);

        // Find status option 'Completado' (assuming label is 'Completado' or similar in config, 
        // looking at code it maps APPOINTMENT_STATUSES. Let's assume 'completed' value has label 'Completado')
        // We can just click the element.
        // In the code: APPOINTMENT_STATUSES.map... option.label
        // Let's assume standard labels. I'll search by text if possible, or just click the one with right value logic if I could.
        // I will suspect the text "Completado" exists.

        const completedOption = screen.getByText(/Completado/i);
        fireEvent.click(completedOption);

        const saveButton = screen.getByText('Guardar');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockUpdateStatus).toHaveBeenCalledWith(123, 'completed');
            expect(mockTriggerRefresh).toHaveBeenCalled();
            expect(mockCloseSidebar).toHaveBeenCalled();
        });
    });

    it('handles cancellation with modal confirmation', async () => {
        render(<AppointmentDetailsSidebar appointment={mockAppointmentData} />);

        // Click 'Cancelado'
        const cancelledOption = screen.getByText(/Cancelado/i);
        fireEvent.click(cancelledOption);

        // Click Save
        fireEvent.click(screen.getByText('Guardar'));

        // Modal should appear
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('¿Cancelar turno?')).toBeInTheDocument();

        // Confirm in modal
        fireEvent.click(screen.getByText('Confirmar Modal'));

        await waitFor(() => {
            expect(mockUpdateStatus).toHaveBeenCalledWith(123, 'cancelled');
        });
    });
});
