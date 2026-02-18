import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

describe('Not Found Page', () => {
    it('renders 404 heading', () => {
        render(<NotFound />);
        expect(screen.getByText('404')).toBeDefined();
    });

    it('renders descriptive message', () => {
        render(<NotFound />);
        expect(screen.getByText('Página no encontrada')).toBeDefined();
        expect(screen.getByText(/La página que buscás no existe/)).toBeDefined();
    });

    it('renders link to home', () => {
        render(<NotFound />);
        const link = screen.getByRole('link', { name: /Volver al Inicio/i });
        expect(link).toBeDefined();
        expect(link.getAttribute('href')).toBe('/');
    });
});
