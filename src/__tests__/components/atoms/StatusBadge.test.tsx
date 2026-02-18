import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { AppointmentStatus } from '@/types';

describe('StatusBadge', () => {
    // Status mappings based on config/appointments.ts
    const testCases: { status: AppointmentStatus; label: string; colorClass: string }[] = [
        { status: 'pending', label: 'Pendiente', colorClass: 'bg-slate-100' },
        { status: 'washing', label: 'En Baño', colorClass: 'bg-blue-100' },
        { status: 'drying', label: 'En Secado', colorClass: 'bg-orange-100' },
        { status: 'ready', label: 'Listo', colorClass: 'bg-purple-100' },
        { status: 'completed', label: 'Completado', colorClass: 'bg-emerald-100' },
        { status: 'cancelled', label: 'Cancelado', colorClass: 'bg-red-100' },
    ];

    testCases.forEach(({ status, label, colorClass }) => {
        it(`renders correct label and color for status: ${status}`, () => {
            const { container } = render(<StatusBadge status={status} />);
            const badge = container.firstChild as HTMLElement;

            expect(screen.getByText(label)).toBeDefined();
            expect(badge.className).toContain(colorClass);
        });
    });

    it('handles unknown status gracefully', () => {
        // @ts-ignore - testing runtime behavior for unknown status
        const { container } = render(<StatusBadge status="unknown-status" />);
        const badge = container.firstChild as HTMLElement;

        expect(screen.getByText('unknown-status')).toBeDefined();
        // Default color from config
        expect(badge.className).toContain('bg-gray-100');
    });
});
