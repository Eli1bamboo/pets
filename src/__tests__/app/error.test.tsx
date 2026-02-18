import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerError from '@/app/(customer)/error';

// Mock specific customer atoms if needed, or rely on shallow rendering if they are simple
// The component uses Button from @/features/customer/components/atoms/Button
// We can test interaction by finding the button by text

describe('Error Page', () => {
    const mockReset = vi.fn();
    const mockError = new Error('Test Error');

    it('renders error message', () => {
        render(<CustomerError error={mockError} reset={mockReset} />);
        expect(screen.getByText('Algo salió mal')).toBeDefined();
        expect(screen.getByText(/Ocurrió un error inesperado/)).toBeDefined();
    });

    it('calls reset function when "Intentar de nuevo" is clicked', () => {
        render(<CustomerError error={mockError} reset={mockReset} />);
        const retryBtn = screen.getByText('Intentar de nuevo');
        fireEvent.click(retryBtn);
        expect(mockReset).toHaveBeenCalled();
    });

    it('renders "Volver al Inicio" button', () => {
        render(<CustomerError error={mockError} reset={mockReset} />);
        expect(screen.getByText('Volver al Inicio')).toBeDefined();
    });
});
