import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '@/components/molecules/Modal';

// Mock dependencies
vi.mock('@/i18n/LanguageContext', () => ({
    useTranslation: () => ({
        t: {
            common: {
                confirm: 'Confirmar',
                cancel: 'Cancelar',
                understood: 'Entendido',
            }
        },
    }),
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick }: any) => (
            <div className={className} onClick={onClick}>
                {children}
            </div>
        ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock('lucide-react', () => ({
    X: () => <span data-testid="icon-x" />,
    AlertTriangle: () => <span data-testid="icon-alert" />,
    CheckCircle: () => <span data-testid="icon-check" />,
    Info: () => <span data-testid="icon-info" />,
    Loader2: () => <span data-testid="icon-loader" />, // Used by Button
}));

describe('Modal Molecule', () => {
    const defaultProps = {
        open: true,
        onClose: vi.fn(),
        title: 'Test Modal',
        message: 'This is a test message',
    };

    it('renders when open is true', () => {
        render(<Modal {...defaultProps} />);
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('This is a test message')).toBeInTheDocument();
    });

    it('does not render when open is false', () => {
        render(<Modal {...defaultProps} open={false} />);
        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(<Modal {...defaultProps} />);
        // X icon button
        const closeButton = screen.getByTestId('icon-x').parentElement;
        fireEvent.click(closeButton!);
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('renders confirm and cancel buttons when onConfirm is provided', () => {
        const onConfirm = vi.fn();
        render(<Modal {...defaultProps} onConfirm={onConfirm} />);

        expect(screen.getByText('Confirmar')).toBeInTheDocument();
        expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('calls onConfirm when confirm button is clicked', () => {
        const onConfirm = vi.fn();
        render(<Modal {...defaultProps} onConfirm={onConfirm} />);

        fireEvent.click(screen.getByText('Confirmar'));
        expect(onConfirm).toHaveBeenCalled();
        expect(defaultProps.onClose).toHaveBeenCalled(); // Should also close
    });

    it('renders correctly based on type', () => {
        const { unmount } = render(<Modal {...defaultProps} type="success" />);
        expect(screen.getByTestId('icon-check')).toBeInTheDocument();
        unmount();

        render(<Modal {...defaultProps} type="error" />);
        expect(screen.getByTestId('icon-alert')).toBeInTheDocument();
    });
});
