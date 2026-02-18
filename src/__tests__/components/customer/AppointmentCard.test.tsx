import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppointmentCard } from '@/features/customer/components/molecules/AppointmentCard';
import { Appointment } from '@/types';

vi.mock('@/i18n/LanguageContext', () => ({
    useTranslation: () => ({
        t: {
            status: {
                pending: 'Pendiente',
                confirmed: 'Confirmado',
                completed: 'Completado',
                cancelled: 'Cancelado'
            },
            profile: {
                cancelButton: 'Cancelar'
            }
        }
    })
}));

const mockOnCancel = vi.fn();

const createMockAppointment = (date: Date): Appointment => ({
    id: 1,
    date: date.toISOString(),
    status: 'pending',
    pet_name: 'Buddy',
    service: 'Bath',
    price: 100,
    user_id: 'user1',
    created_at: new Date().toISOString()
});

describe('AppointmentCard', () => {
    it('allows cancellation when outside window', () => {
        // Appointment is 48 hours away
        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + 48);
        const apt = createMockAppointment(futureDate);

        render(<AppointmentCard appointment={apt} onCancel={mockOnCancel} cancellationWindow={24} />);

        const cancelBtn = screen.getByText('Cancelar');
        expect(cancelBtn).toBeDefined();

        fireEvent.click(cancelBtn);
        expect(mockOnCancel).toHaveBeenCalledWith(apt);
    });

    it('disables cancellation when inside window', () => {
        // Appointment is 2 hours away
        const nearDate = new Date();
        nearDate.setHours(nearDate.getHours() + 2);
        const apt = createMockAppointment(nearDate);

        render(<AppointmentCard appointment={apt} onCancel={mockOnCancel} cancellationWindow={24} />);

        // Should find "No se puede cancelar" button
        const disabledBtn = screen.getByText('No se puede cancelar');
        expect(disabledBtn).toBeDefined();

        // Should show tooltip text on hover (if tooltip is reachable in test DOM)
        // Since we are mocking Tooltip logic, we might just check props or implementation detail?
        // But let's check if the button is indeed disabled or has visually disabled classes
        expect(disabledBtn.closest('button')).toHaveProperty('disabled', true);
    });

    it('shows time remaining when cancellable', () => {
        vi.useFakeTimers();
        const now = new Date(2024, 1, 1, 10, 0, 0); // Feb 1, 10:00 AM
        vi.setSystemTime(now);

        const futureDate = new Date(now);
        futureDate.setHours(now.getHours() + 26); // Feb 2, 12:00 PM (26 hours away)

        const apt = createMockAppointment(futureDate);

        render(<AppointmentCard appointment={apt} onCancel={mockOnCancel} cancellationWindow={24} />);

        // 26 - 24 = 2 hours remaining
        expect(screen.getByText(/Tenés hasta 2h para cancelar/)).toBeDefined();

        vi.useRealTimers();
    });
});
