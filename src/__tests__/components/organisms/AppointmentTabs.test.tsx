import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppointmentTabs } from '@/features/customer/components/organisms/AppointmentTabs';
import { Appointment } from '@/types';
import { vi, expect, describe, it, beforeEach } from 'vitest';

// Mocks
const mockRouterPush = vi.fn();
const mockRouterReplace = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockRouterPush,
        replace: mockRouterReplace,
    }),
    useSearchParams: () => mockSearchParams,
    usePathname: () => '/profile',
}));

vi.mock('@/i18n/LanguageContext', () => ({
    useTranslation: () => ({
        t: {
            profile: {
                tabs: { upcoming: 'Upcoming', history: 'History' },
                cancelButton: 'Cancel',
                emptyTitle: 'No upcoming',
                emptySubtitle: 'Book now',
                emptyHistoryTitle: 'No history',
                emptyHistorySubtitle: 'Book a service',
            },
            status: {
                pending: 'Pending',
                washing: 'Washing',
                drying: 'Drying',
                ready: 'Ready',
                completed: 'Completed',
                cancelled: 'Cancelled',
            },
            hero: { ctaBooking: 'Book Now' },
        },
    }),
}));

vi.mock('@/hooks/useBusinessSettings', () => ({
    useBusinessSettings: () => ({
        settings: { cancellation_window_hours: 24 },
        loading: false,
    }),
}));

const mockAppointments: Appointment[] = [
    {
        id: 1,
        pet_name: 'Buddy',
        service: 'Bath',
        date: new Date(Date.now() + 86400000 + 3600000).toISOString(),
        status: 'pending',
        created_at: '',
        user_id: '1',
        price: 100,
        mp_payment_id: null,
        mp_preference_id: null,
        mp_status: null,
        payment_status: 'unpaid',
    },
    {
        id: 2,
        pet_name: 'Max',
        service: 'Grooming',
        date: new Date().toISOString(),
        status: 'pending',
        created_at: '',
        user_id: '1',
        price: 120,
        mp_payment_id: null,
        mp_preference_id: null,
        mp_status: null,
        payment_status: 'unpaid',
    },
    {
        id: 3,
        pet_name: 'Lucy',
        service: 'Nails',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
        created_at: '',
        user_id: '1',
        price: 50,
        mp_payment_id: null,
        mp_preference_id: null,
        mp_status: null,
        payment_status: 'paid',
    },
    {
        id: 4,
        pet_name: 'Rocky',
        service: 'Bath',
        date: new Date().toISOString(),
        status: 'washing',
        created_at: '',
        user_id: '1',
        price: 90,
        mp_payment_id: null,
        mp_preference_id: null,
        mp_status: null,
        payment_status: 'unpaid',
    }
];

describe('AppointmentTabs', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSearchParams.delete('tab');
    });

    it('renders "In Progress" tab', () => {
        render(<AppointmentTabs appointments={mockAppointments} onCancel={vi.fn()} />);
        expect(screen.getByText('En Curso')).toBeInTheDocument();
    });

    it('shows in-progress appointments (active status OR current time) in the correct tab', async () => {
        render(<AppointmentTabs appointments={mockAppointments} onCancel={vi.fn()} />);

        // Click "En Curso"
        fireEvent.click(screen.getByText('En Curso'));

        await waitFor(() => {
            // Max is pending but happening NOW -> Should be visible
            expect(screen.getByText('Max')).toBeInTheDocument();
            // Rocky is washing -> Should be visible
            expect(screen.getByText('Rocky')).toBeInTheDocument();
        });
        expect(screen.queryByText('Buddy')).not.toBeInTheDocument();
        expect(screen.queryByText('Lucy')).not.toBeInTheDocument();
    });

    it('shows tracking button for in-progress appointments', async () => {
        render(<AppointmentTabs appointments={mockAppointments} onCancel={vi.fn()} />);
        fireEvent.click(screen.getByText('En Curso'));

        await waitFor(() => {
            const buttons = screen.getAllByText('🔍 Seguimiento en vivo');
            // Should be 2 now: Max (pending but current) AND Rocky (washing)
            expect(buttons.length).toBe(2);
        });
    });

    it('navigates to tracking page when tracking button is clicked', async () => {
        render(<AppointmentTabs appointments={mockAppointments} onCancel={vi.fn()} />);
        fireEvent.click(screen.getByText('En Curso'));

        await waitFor(() => {
            expect(screen.getAllByText('🔍 Seguimiento en vivo')[0]).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('🔍 Seguimiento en vivo')[0]);

        // Could be id 2 or 4, but should navigate
        expect(mockRouterPush).toHaveBeenCalledWith(expect.stringMatching(/\/tracking\?id=/));
    });

    it('shows "Ver Próximos" button when no in-progress appointments', async () => {
        const noCurrentMock = [mockAppointments[0], mockAppointments[2]]; // Only future and history
        render(<AppointmentTabs appointments={noCurrentMock} onCancel={vi.fn()} />);

        fireEvent.click(screen.getByText('En Curso'));

        await waitFor(() => {
            expect(screen.getByText('Ver Próximos')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Ver Próximos'));
        // Should switch tab logic (router replace or similar state change)
        // With current implementation, it calls handleTabChange('upcoming')
        // We can verify if the button text (Upcoming content) is visible or router replace called

        await waitFor(() => {
            // After clicking Ver Proximos, we expect to see Buddy
            expect(screen.getByText('Buddy')).toBeInTheDocument();
        });
    });

    it('hides Cancel button in "In Progress" tab even for pending appointments', async () => {
        render(<AppointmentTabs appointments={mockAppointments} onCancel={vi.fn()} />);

        // Go to In Progress
        fireEvent.click(screen.getByText('En Curso'));

        await waitFor(() => {
            expect(screen.getByText('Max')).toBeInTheDocument(); // Max is pending
        });

        // "Max" should NOT have a Cancel button
        // "Rocky" (washing) should NOT have a Cancel button (status logic)
        const cancelButtons = screen.queryAllByText('Cancel');
        expect(cancelButtons.length).toBe(0);
    });

    it('shows Cancel button in "Upcoming" tab', async () => {
        render(<AppointmentTabs appointments={mockAppointments} onCancel={vi.fn()} />);

        // Default is upcoming (Buddy)
        await waitFor(() => {
            expect(screen.getByText('Buddy')).toBeInTheDocument();
        });

        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
});
