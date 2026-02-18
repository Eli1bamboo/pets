import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StatusTracker } from '@/features/customer/components/organisms/StatusTracker';

// Mock Mock Lucide icons
vi.mock('lucide-react', () => ({
    CheckCircle2: () => <span data-testid="icon-check" />,
    Clock: () => <span data-testid="icon-clock" />,
    Bath: () => <span data-testid="icon-bath" />,
    Wind: () => <span data-testid="icon-wind" />,
    Sparkles: () => <span data-testid="icon-sparkles" />,
    Loader2: () => <span data-testid="icon-loader" />,
}));

// Mock framer-motion to avoid complex animation logic in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, style, ...props }: any) => (
            <div className={className} style={style} {...props}>
                {children}
            </div>
        ),
    },
}));

describe('StatusTracker', () => {
    it('renders all status steps', () => {
        render(<StatusTracker status="pending" />);

        expect(screen.getByText('Esperando')).toBeInTheDocument();
        expect(screen.getByText('Baño')).toBeInTheDocument();
        expect(screen.getByText('Secado')).toBeInTheDocument();
        expect(screen.getByText('Listo')).toBeInTheDocument();
        expect(screen.getByText('Retirado')).toBeInTheDocument();
    });

    it('highlights the active step (pending)', () => {
        render(<StatusTracker status="pending" />);

        // "Esperando" label should have brand-900 (active text color)
        // Others should have brand-400 (inactive/future)
        const activeLabel = screen.getByText('Esperando');
        expect(activeLabel).toHaveClass('text-brand-900');

        const inactiveLabel = screen.getByText('Baño');
        expect(inactiveLabel).toHaveClass('text-brand-400');
    });

    it('marks previous steps as completed (washing)', () => {
        render(<StatusTracker status="washing" />);

        // "Esperando" (previous) should be completed
        // logic: isCompleted ? "bg-brand-500 border-brand-500 text-white" 
        // We can check classes on the container div. 
        // Since we mocked motion.div, we can look for testid or structure.
        // Actually, looking at the code:
        // Render structure: div (group) -> motion.div (circle) -> motion.div (icon)
        // We can find the step by text, then find the circle above it.

        // Let's rely on text classes for simplicity first, as the circle classes are complex
        // completed label: "text-brand-600"
        // active label: "text-brand-900"
        // future: "text-brand-400"

        const completedLabel = screen.getByText('Esperando');
        expect(completedLabel).toHaveClass('text-brand-600');

        const activeLabel = screen.getByText('Baño');
        expect(activeLabel).toHaveClass('text-brand-900');

        const futureLabel = screen.getByText('Secado');
        expect(futureLabel).toHaveClass('text-brand-400');
    });

    it('handles completed status (all done)', () => {
        // "completed" is the last step
        render(<StatusTracker status="completed" />);

        const activeLabel = screen.getByText('Retirado');
        expect(activeLabel).toHaveClass('text-brand-900');

        const previousLabel = screen.getByText('Listo');
        expect(previousLabel).toHaveClass('text-brand-600');
    });
});
