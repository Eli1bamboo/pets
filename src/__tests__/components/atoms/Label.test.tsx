import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Label } from '@/components/atoms/Label';

describe('Label Atom', () => {
    it('renders children correctly', () => {
        render(<Label>Username</Label>);
        expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('applies customer variant classes by default', () => {
        render(<Label>Username</Label>);
        const label = screen.getByText('Username');
        expect(label).toHaveClass('text-brand-900');
    });

    it('applies admin variant classes', () => {
        render(<Label variant="admin">Username</Label>);
        const label = screen.getByText('Username');
        expect(label).toHaveClass('text-slate-700');
    });

    it('passes additional props', () => {
        render(<Label htmlFor="username">Username</Label>);
        const label = screen.getByText('Username');
        expect(label).toHaveAttribute('for', 'username');
    });
});
