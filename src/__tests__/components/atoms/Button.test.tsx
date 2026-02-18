import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/atoms/Button';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Loader2: () => <span data-testid="icon-loader" />,
}));

describe('Button Atom', () => {
    it('renders children correctly', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('handles onClick events', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);

        fireEvent.click(screen.getByRole('button', { name: /click me/i }));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows loading state and disables button', () => {
        render(<Button isLoading>Click Me</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(screen.getByTestId('icon-loader')).toBeInTheDocument();
    });

    it('applies variant classes', () => {
        render(<Button variant="danger">Delete</Button>);
        const button = screen.getByRole('button', { name: /delete/i });
        // danger variant classes: 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
        expect(button).toHaveClass('bg-red-50');
        expect(button).toHaveClass('text-red-700');
    });

    it('applies size classes', () => {
        render(<Button size="lg">Big Button</Button>);
        const button = screen.getByRole('button', { name: /big button/i });
        // lg size: 'px-8 py-4 text-base'
        expect(button).toHaveClass('px-8');
        expect(button).toHaveClass('py-4');
    });
});
