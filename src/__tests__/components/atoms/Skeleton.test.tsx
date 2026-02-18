import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '@/components/atoms/Skeleton';

describe('Skeleton', () => {
    it('renders with default styles', () => {
        const { container } = render(<Skeleton />);
        const skeleton = container.firstChild as HTMLElement;
        expect(skeleton.className).toContain('animate-pulse');
        expect(skeleton.className).toContain('rounded-md');
        expect(skeleton.className).toContain('bg-gray-200');
    });

    it('merges custom class names', () => {
        const { container } = render(<Skeleton className="h-4 w-1/2" />);
        const skeleton = container.firstChild as HTMLElement;
        expect(skeleton.className).toContain('h-4');
        expect(skeleton.className).toContain('w-1/2');
    });

    it('spreads other props', () => {
        const { container } = render(<Skeleton data-testid="skeleton-test" />);
        const skeleton = container.firstChild as HTMLElement;
        expect(skeleton.getAttribute('data-testid')).toBe('skeleton-test');
    });
});
