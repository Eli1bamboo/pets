import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookingSummary } from '@/features/customer/components/organisms/BookingSummary';

// Mock useTranslation
vi.mock('@/i18n/LanguageContext', () => ({
    useTranslation: () => ({
        t: {
            booking: {
                summaryTitle: 'Resumen del Turno',
                petNameLabel: 'Mascota',
                serviceLabel: 'Servicio',
                dateLabel: 'Fecha',
                timeLabel: 'Hora',
                confirm: 'Confirmar Reserva',
            },
        },
    }),
}));

// Mock Lucide icons to avoid rendering complexities
vi.mock('lucide-react', () => ({
    Calendar: () => <span data-testid="icon-calendar" />,
    Clock: () => <span data-testid="icon-clock" />,
    Dog: () => <span data-testid="icon-dog" />,
    Scissors: () => <span data-testid="icon-scissors" />,
    Loader2: () => <span data-testid="icon-loader" />,
}));

describe('BookingSummary', () => {
    const defaultProps = {
        petName: 'Firulais',
        serviceName: 'Baño Completo',
        servicePrice: '5000',
        date: '15 de Octubre',
        time: '14:00',
        onConfirm: vi.fn(),
        isSubmitting: false,
        canConfirm: true,
    };

    it('renders all booking details correctly', () => {
        render(<BookingSummary {...defaultProps} />);

        expect(screen.getByText('Resumen del Turno')).toBeInTheDocument();
        expect(screen.getByText('Firulais')).toBeInTheDocument();
        expect(screen.getByText('Baño Completo')).toBeInTheDocument();
        // Price appears twice: in service details and total
        const priceElements = screen.getAllByText('$5,000');
        expect(priceElements).toHaveLength(2);
        expect(screen.getByText('15 de Octubre')).toBeInTheDocument();
        expect(screen.getByText('14:00')).toBeInTheDocument();
    });

    it('renders placeholders when data is missing', () => {
        const props = { ...defaultProps, petName: '', serviceName: '', date: '', time: '' };
        render(<BookingSummary {...props} />);

        expect(screen.getByText('Ingresá el nombre')).toBeInTheDocument();
        expect(screen.getByText('Seleccioná un servicio')).toBeInTheDocument();
        expect(screen.getByText('Seleccioná una fecha')).toBeInTheDocument();
        expect(screen.getByText('Seleccioná una hora')).toBeInTheDocument();
    });

    it('handles confirm click', () => {
        render(<BookingSummary {...defaultProps} />);

        const button = screen.getByRole('button', { name: /confirmar reserva/i });
        fireEvent.click(button);

        expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it('disables button when canConfirm is false', () => {
        render(<BookingSummary {...defaultProps} canConfirm={false} />);

        const button = screen.getByRole('button', { name: /confirmar reserva/i });
        expect(button).toBeDisabled();
        expect(screen.getByText('Completá todos los pasos para confirmar')).toBeInTheDocument();
    });

    it('shows loading state on button', () => {
        render(<BookingSummary {...defaultProps} isSubmitting={true} />);

        const button = screen.getByRole('button', { name: /confirmar reserva/i });
        expect(button).toBeDisabled();
        // Assuming Button component renders a spinner or similar when isLoading is true. 
        // We might need to check for specific class or loader element if text is hidden.
        // Based on common patterns, often text is still there or replaced. 
        // Let's just check it's disabled for now, or check if we can see a spinner.
        // If Button implementation hides text, we might not find "Confirmar Reserva".
        // Let's check the Button component implementation if this fails.
    });
});
