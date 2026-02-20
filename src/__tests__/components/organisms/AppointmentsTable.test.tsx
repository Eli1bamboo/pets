import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppointmentsTable } from '@/features/admin/components/organisms/AppointmentsTable';
import { Appointment } from '@/types';

// Mock Translation
vi.mock('@/i18n/LanguageContext', () => ({
    useTranslation: () => ({
        t: {
            admin: {
                appointments: {
                    viewDetails: 'View Details',
                    cancelAppointment: 'Cancel Appointment',
                    cannotCancel: 'Cannot Cancel',
                    cancelled: 'Cancelled'
                }
            }
        }
    }),
}));

// Mock Config
vi.mock('@/config/appointments', () => ({
    APPOINTMENT_STATUSES: [
        { value: 'pending', label: 'Pending', color: 'bg-slate-100 text-slate-700' },
        { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
        { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-700' }
    ],
    getStatusColor: (status: string) => 'bg-gray-100 text-gray-800',
    getStatusLabel: (status: string) => status,
}));

const mockAppointments: Appointment[] = [
    {
        id: 1,
        user_id: 'u1',
        pet_name: 'Rex',
        service: 'Bath',
        date: '2023-10-27T10:00:00Z',
        status: 'pending',
        price: 50,
        profiles: { full_name: 'John Doe' },
        created_at: '2023-10-20T10:00:00Z',
        mp_payment_id: null,
        mp_preference_id: null,
        mp_status: null,
        payment_status: 'unpaid',
    },
    {
        id: 2,
        user_id: 'u2',
        pet_name: 'Fido',
        service: 'Cut',
        date: '2023-10-27T11:00:00Z',
        status: 'completed',
        price: 60,
        profiles: { full_name: 'Jane Doe' },
        created_at: '2023-10-20T11:00:00Z',
        mp_payment_id: null,
        mp_preference_id: null,
        mp_status: null,
        payment_status: 'paid',
    }
];

describe('AppointmentsTable', () => {
    it('renders loading skeletons', () => {
        const { container } = render(
            <AppointmentsTable
                appointments={[]}
                isLoading={true}
                itemsPerPage={5}
            />
        );
        // We expect 5 rows of skeletons. 
        // AppointmentRow is rendered 5 times. Skeletons inside.
        // Let's check for "tr" elements
        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBe(5);
    });

    it('renders appointments', () => {
        render(
            <AppointmentsTable
                appointments={mockAppointments}
                isLoading={false}
                itemsPerPage={5}
            />
        );

        expect(screen.getByText('Rex')).toBeDefined();
        expect(screen.getByText('Fido')).toBeDefined();
        expect(screen.getByText('John Doe')).toBeDefined();
        expect(screen.getByText('Jane Doe')).toBeDefined();
    });

    it('renders empty rows padding', () => {
        const { container } = render(
            <AppointmentsTable
                appointments={mockAppointments} // 2 items
                isLoading={false}
                itemsPerPage={5}
            />
        );

        // Should have 2 data rows + 3 empty rows = 5 total
        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBe(5);

        // Check for empty row content (which is "-")
        const dashes = screen.getAllByText('-');
        expect(dashes.length).toBeGreaterThan(0);
    });

    it('calls onStatusUpdate', () => {
        const onStatusUpdate = vi.fn();
        render(
            <AppointmentsTable
                appointments={mockAppointments}
                isLoading={false}
                itemsPerPage={5}
                onStatusUpdate={onStatusUpdate}
            />
        );

        // Find the select for the first appointment (pending)
        // Since we have multiple rows, we need to be specific.
        // The first row corresponds to mockAppointments[0] status 'pending'
        const selects = screen.getAllByRole('combobox'); // hidden select for status?
        // Actually the AppointmentRow renders a select with value={appointment.status}

        fireEvent.change(selects[0], { target: { value: 'completed' } });

        expect(onStatusUpdate).toHaveBeenCalledWith(1, 'completed');
    });

    it('calls onViewDetails', () => {
        const onViewDetails = vi.fn();
        render(
            <AppointmentsTable
                appointments={mockAppointments}
                isLoading={false}
                itemsPerPage={5}
                onViewDetails={onViewDetails}
            />
        );

        // Eye icon button. Title "View Details"
        const viewBtns = screen.getAllByTitle('View Details');
        fireEvent.click(viewBtns[0]);

        expect(onViewDetails).toHaveBeenCalledWith(mockAppointments[0]);
    });

    it('calls onCancel', () => {
        const onCancel = vi.fn();
        render(
            <AppointmentsTable
                appointments={mockAppointments}
                isLoading={false}
                itemsPerPage={5}
                onCancel={onCancel}
            />
        );

        // Cancel button. Title "Cancel Appointment"
        // Note: Second appointment is completed, so button should be disabled/different title "Cannot Cancel"
        const cancelBtns = screen.getAllByTitle('Cancel Appointment');
        fireEvent.click(cancelBtns[0]); // First one is pending, cancellable

        expect(onCancel).toHaveBeenCalledWith(mockAppointments[0]);
    });
});
