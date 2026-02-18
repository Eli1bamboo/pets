import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '@/components/atoms/Input';
import { Mail, Search } from 'lucide-react';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Mail: (props: any) => <span data-testid="icon-mail" {...props} />,
    Search: (props: any) => <span data-testid="icon-search" {...props} />,
}));

describe('Input Atom', () => {
    it('renders correctly', () => {
        render(<Input placeholder="Enter text" />);
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('handles value changes', () => {
        const handleChange = vi.fn();
        render(<Input onChange={handleChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test' } });

        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('renders left icon', () => {
        render(<Input leftIcon={Mail} />);
        expect(screen.getByTestId('icon-mail')).toBeInTheDocument();
    });

    it('renders right icon and handles click', () => {
        const handleIconClick = vi.fn();
        render(<Input rightIcon={Search} onRightIconClick={handleIconClick} />);

        const icon = screen.getByTestId('icon-search');
        expect(icon).toBeInTheDocument();

        // The icon is inside a div with onClick
        fireEvent.click(icon.parentElement!);
        expect(handleIconClick).toHaveBeenCalledTimes(1);
    });

    it('shows error state', () => {
        render(<Input error />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-red-300');
    });
});
