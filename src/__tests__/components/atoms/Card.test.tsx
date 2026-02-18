import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/atoms/Card';

describe('Card', () => {
    it('renders children correctly', () => {
        render(<Card>Test Content</Card>);
        expect(screen.getByText('Test Content')).toBeDefined();
    });

    it('applies standard variant styles by default', () => {
        const { container } = render(<Card />);
        const card = container.firstChild as HTMLElement;
        expect(card.className).toContain('bg-white');
        expect(card.className).toContain('rounded-3xl');
        expect(card.className).toContain('shadow-sm');
    });

    it('applies admin variant styles', () => {
        const { container } = render(<Card variant="admin" />);
        const card = container.firstChild as HTMLElement;
        expect(card.className).toContain('bg-white');
        expect(card.className).toContain('rounded-xl');
        expect(card.className).toContain('border-slate-200');
    });

    it('applies flat variant styles', () => {
        const { container } = render(<Card variant="flat" />);
        const card = container.firstChild as HTMLElement;
        expect(card.className).toContain('bg-transparent');
    });

    it('applies highlight variant styles', () => {
        const { container } = render(<Card variant="highlight" />);
        const card = container.firstChild as HTMLElement;
        expect(card.className).toContain('border-brand-500');
        expect(card.className).toContain('shadow-lg');
    });

    it('applies padding classes', () => {
        const { container: c1 } = render(<Card padding="none" />);
        expect((c1.firstChild as HTMLElement).className).toContain('p-0');

        const { container: c2 } = render(<Card padding="sm" />);
        expect((c2.firstChild as HTMLElement).className).toContain('p-4');

        const { container: c3 } = render(<Card padding="lg" />);
        expect((c3.firstChild as HTMLElement).className).toContain('p-8');
    });

    it('merges custom class names', () => {
        const { container } = render(<Card className="custom-class" />);
        const card = container.firstChild as HTMLElement;
        expect(card.className).toContain('custom-class');
    });

    it('forwards ref', () => {
        const ref = { current: null };
        render(<Card ref={ref} />);
        expect(ref.current).toBeDefined();
    });
});
