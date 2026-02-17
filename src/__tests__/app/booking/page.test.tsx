import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import BookingPage from '@/app/(customer)/(protected)/booking/page';

// Mocks
const mockCreateBooking = vi.fn();
const mockUser = { id: 'user-123', email: 'test@example.com' };

vi.mock('@/providers/CustomerProvider', () => ({
    useCustomerContext: () => ({
        user: mockUser,
        loading: false,
    }),
}));

vi.mock('@/features/customer/hooks/useBooking', () => ({
    useBooking: () => ({
        createBooking: mockCreateBooking,
        submitting: false,
        error: null,
    }),
}));

vi.mock('@/features/customer/hooks/useServices', () => ({
    useServices: () => ({
        services: [
            { id: '1', name: 'Bath', price: 50, icon: 'bath' },
            { id: '2', name: 'Grooming', price: 80, icon: 'scissors' },
        ],
        loading: false,
    }),
}));

vi.mock('@/features/customer/hooks/useAvailability', () => ({
    useAvailability: (date: string) => ({
        busySlots: [],
        availableHours: ['10:00', '11:00'],
        loading: false,
    }),
}));

vi.mock('@/i18n/LanguageContext', () => ({
    useTranslation: () => ({
        t: {
            booking: {
                title: 'Book Appointment',
                petNameLabel: 'Pet Name',
                petNamePlaceholder: 'Enter pet name',
                serviceLabel: 'Service',
                nextStep: 'Next Step',
                back: 'Back',
                confirm: 'Confirm Booking',
                petNameRequired: 'Pet name is required',
                errorTitle: 'Error',
                errorFallback: 'Something went wrong',
            },
            common: {
                confirm: 'Confirm',
                cancel: 'Cancel',
                understood: 'Understood',
            }
        },
        language: 'en',
    }),
}));

// Mock child components that might use browser APIs or be complex
vi.mock('@/components/molecules/DateSelector', () => ({
    DateSelector: ({ selectedDate, onSelect }: any) => (
        <div data-testid="date-selector">
            <button onClick={() => onSelect('2024-02-15')}>Select Date</button>
            <span>Selected: {selectedDate}</span>
        </div>
    ),
}));

vi.mock('@/components/molecules/TimeSelector', () => ({
    TimeSelector: ({ selectedTime, onSelect, availableHours }: any) => (
        <div data-testid="time-selector">
            {availableHours.map((time: string) => (
                <button key={time} onClick={() => onSelect(time)}>
                    {time}
                </button>
            ))}
            <span>Selected: {selectedTime}</span>
        </div>
    ),
}));

describe('BookingPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockCreateBooking.mockResolvedValue({ success: true });
    });

    it('renders step 1 and validates form', async () => {
        render(<BookingPage />);

        expect(screen.getByText('Book Appointment')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter pet name')).toBeInTheDocument();

        // Try to go next without name
        fireEvent.click(screen.getByText('Next Step'));
        expect(screen.getByText('Pet name is required')).toBeInTheDocument();

        // Fill name
        fireEvent.change(screen.getByPlaceholderText('Enter pet name'), { target: { value: 'Rex' } });

        // Select service (first one is default, but click second)
        const groomingOption = screen.getByText('Grooming').closest('div[class*="cursor-pointer"]');
        if (groomingOption) fireEvent.click(groomingOption);

        // Go next
        fireEvent.click(screen.getByText('Next Step'));

        // Should be on Step 2 (Date Selector visible)
        expect(screen.getByTestId('date-selector')).toBeInTheDocument();
    });

    it('completes booking flow', async () => {
        render(<BookingPage />);

        // Step 1
        fireEvent.change(screen.getByPlaceholderText('Enter pet name'), { target: { value: 'Rex' } });
        fireEvent.click(screen.getByText('Next Step'));

        // Step 2
        fireEvent.click(screen.getByText('Select Date')); // Sets 2024-02-15
        fireEvent.click(screen.getByText('10:00'));       // Sets time

        // Confirm
        fireEvent.click(screen.getByText('Confirm Booking'));

        await waitFor(() => {
            expect(mockCreateBooking).toHaveBeenCalledWith({
                userId: 'user-123',
                petName: 'Rex',
                service: 'Bath', // Default was Bath, we didn't change it here
                date: '2024-02-15',
                time: '10:00',
                price: 50,
            });
        });
    });
});
