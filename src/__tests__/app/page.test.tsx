import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/(customer)/page';

// Mock dependencies
vi.mock('@/features/customer/components/organisms/HomeHero', () => ({
    HomeHero: () => <div data-testid="home-hero">Home Hero</div>
}));

vi.mock('@/features/customer/components/molecules/ServiceCard', () => ({
    ServiceCard: ({ title }: { title: string }) => <div data-testid="service-card">{title}</div>
}));

// Mock hooks
const mockUseServices = vi.fn();
vi.mock('@/features/customer/hooks/useServices', () => ({
    useServices: () => mockUseServices()
}));

vi.mock('@/i18n/LanguageContext', () => ({
    useTranslation: () => ({
        t: {
            services: {
                sectionTag: 'Our Services',
                sectionTitle: 'What we offer',
                sectionSubtitle: 'Best care for your pets'
            }
        },
        language: 'es'
    })
}));

describe('Home Page', () => {
    it('renders the hero section', () => {
        mockUseServices.mockReturnValue({ services: [], loading: false });
        render(<Home />);
        expect(screen.getByTestId('home-hero')).toBeDefined();
    });

    it('renders services section static text', () => {
        mockUseServices.mockReturnValue({ services: [], loading: false });
        render(<Home />);
        expect(screen.getByText('Our Services')).toBeDefined();
        expect(screen.getByText('What we offer')).toBeDefined();
        expect(screen.getByText('Best care for your pets')).toBeDefined();
    });

    it('shows loading state for services', () => {
        mockUseServices.mockReturnValue({ services: [], loading: true });
        const { container } = render(<Home />);
        // Look for the spinner
        expect(container.getElementsByClassName('animate-spin')).toBeDefined();
    });

    it('renders service cards when data is loaded', () => {
        const mockServices = [
            { id: 1, name: 'Baño', price: 100, icon: 'bath', features: [] },
            { id: 2, name: 'Corte', price: 200, icon: 'scissors', features: [] }
        ];
        mockUseServices.mockReturnValue({ services: mockServices, loading: false });

        render(<Home />);
        const cards = screen.getAllByTestId('service-card');
        expect(cards).toHaveLength(2);
        expect(screen.getByText('Baño')).toBeDefined();
        expect(screen.getByText('Corte')).toBeDefined();
    });
});
