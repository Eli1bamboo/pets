import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tooltip } from '@/components/atoms/Tooltip';

describe('Tooltip', () => {
    it('renders children', () => {
        render(<Tooltip content="Test Tooltip"><button>Hover me</button></Tooltip>);
        expect(screen.getByText('Hover me')).toBeDefined();
    });

    it('shows content on hover', () => {
        render(<Tooltip content="Test Tooltip"><button>Hover me</button></Tooltip>);

        expect(screen.queryByText('Test Tooltip')).toBeNull();

        fireEvent.mouseEnter(screen.getByText('Hover me'));
        expect(screen.getByText('Test Tooltip')).toBeDefined();

        fireEvent.mouseLeave(screen.getByText('Hover me'));
        expect(screen.queryByText('Test Tooltip')).toBeNull();
    });
});
