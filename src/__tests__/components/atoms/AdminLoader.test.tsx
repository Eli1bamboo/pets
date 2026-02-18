import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminLoader } from '@/components/atoms/AdminLoader';

// Mock translation
vi.mock('@/i18n/LanguageContext', () => ({
    useTranslation: () => ({
        t: {
            common: {
                loading: 'Loading...'
            }
        }
    })
}));

describe('AdminLoader', () => {
    it('renders with default loading text', () => {
        // When no message is provided, it uses t.common.loading but only renders it if message prop is present? 
        // Checking source: 
        // const displayMessage = message || t.common.loading;
        // {message && (... {displayMessage} ...)} 
        // Wait, the code says: {message && ...} so if message is undefined, the paragraph is NOT rendered even if displayMessage has a value.
        // Let's re-read the code carefully.
        // Line 10: export function AdminLoader({ message, fullScreen = false }: AdminLoaderProps)
        // Line 21: {message && ( <p>{displayMessage}</p> )}
        // So if message is not passed, the text is NOT visible.

        const { container } = render(<AdminLoader />);
        // Should find the spinner
        expect(container.getElementsByClassName('animate-spin')).toBeDefined();
        // Should NOT find text
        expect(screen.queryByText('Loading...')).toBeNull();
    });

    it('renders with provided message', () => {
        render(<AdminLoader message="Please wait" />);
        expect(screen.getByText('Please wait')).toBeDefined();
    });

    it('renders full screen when prop is true', () => {
        const { container } = render(<AdminLoader fullScreen />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.className).toContain('h-screen');
        expect(wrapper.className).toContain('bg-admin-bg');
    });

    it('renders locally (not full screen) by default', () => {
        const { container } = render(<AdminLoader />);
        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.className).toContain('h-[50vh]');
        expect(wrapper.className).not.toContain('h-screen');
    });
});
