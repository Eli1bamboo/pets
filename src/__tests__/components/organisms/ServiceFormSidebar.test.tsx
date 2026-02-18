import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ServiceFormSidebar } from '@/features/admin/components/organisms/ServiceFormSidebar';
import { Service } from '@/types';
import { AdminUIContextType } from '@/providers/AdminUIProvider';

// Mocks
const mockCloseSidebar = vi.fn();
const mockTriggerRefresh = vi.fn();
const mockCreateService = vi.fn();
const mockUpdateService = vi.fn();
const mockDeleteService = vi.fn();

const adminUIObj: Partial<AdminUIContextType> = {
    closeSidebar: mockCloseSidebar,
    triggerRefresh: mockTriggerRefresh,
};

const servicesObj = {
    createService: mockCreateService,
    updateService: mockUpdateService,
    deleteService: mockDeleteService,
};

vi.mock('@/providers/AdminUIProvider', () => ({
    useAdminUI: () => adminUIObj,
    useRefresh: () => ({ refreshTrigger: 0, triggerRefresh: mockTriggerRefresh }),
}));

vi.mock('@/features/admin/hooks/useServices', () => ({
    useServices: () => servicesObj,
}));

vi.mock('@/i18n/LanguageContext', () => ({
    useTranslation: () => ({
        t: {
            admin: {
                services: {
                    newTitle: 'New Service',
                    editTitle: 'Edit Service',
                    newDescription: 'Create a new service',
                    editDescription: 'Modify service details',
                    nameLabel: 'Name',
                    nameRequired: 'Name is required',
                    price: 'Price',
                    descriptionLabel: 'Description',
                    featuresLabel: 'Features',
                    addFeaturePlaceholder: 'Add feature',
                    iconLabel: 'Icon',
                    sortOrderLabel: 'Sort Order',
                    activeLabel: 'Active',
                    close: 'Close',
                    create: 'Create',
                    save: 'Save',
                    created: 'Service created',
                    updated: 'Service updated',
                    saveError: 'Error saving',
                    deleteError: 'Error deleting',
                }
            }
        },
    }),
}));

// Mock SidebarSheet components
vi.mock('@/components/molecules/SidebarSheet', () => ({
    SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SheetTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    SheetDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

const mockService: Service = {
    id: 1,
    name: 'Corte',
    name_en: 'Haircut',
    price: 3000,
    description: 'Corte de pelo',
    description_en: 'Haircut service',
    features: ['Baño'],
    features_en: ['Bath'],
    icon: 'scissors',
    is_active: true,
    sort_order: 1,
    created_at: '2023-01-01T00:00:00Z',
};

describe('ServiceFormSidebar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    it('renders for a new service', () => {
        render(<ServiceFormSidebar />);
        expect(screen.getByText('New Service')).toBeDefined();
        expect(screen.getByPlaceholderText('Baño y Secado')).toBeDefined();
    });

    it('renders for editing an existing service', () => {
        render(<ServiceFormSidebar service={mockService} />);
        expect(screen.getByText('Edit Service')).toBeDefined();
        expect(screen.getByDisplayValue('Corte')).toBeDefined();
    });

    it('validates required name', async () => {
        render(<ServiceFormSidebar />);

        const createBtn = screen.getByText('Create');
        await act(async () => {
            fireEvent.click(createBtn);
        });

        expect(screen.getByText('Name is required')).toBeDefined();
        expect(mockCreateService).not.toHaveBeenCalled();
    });

    it('switches languages', async () => {
        render(<ServiceFormSidebar service={mockService} />);

        const enTab = screen.getByText(/English/i);
        await act(async () => {
            fireEvent.click(enTab);
        });

        expect(screen.getByDisplayValue('Haircut')).toBeDefined();
        expect(screen.getByPlaceholderText('Bath & Dry')).toBeDefined();
    });

    it('creates a service successfully', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        mockCreateService.mockResolvedValue({ success: true });
        render(<ServiceFormSidebar />);

        fireEvent.change(screen.getByPlaceholderText('Baño y Secado'), { target: { value: 'New Service' } });
        fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '500' } });
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'New Desc' } });
        fireEvent.change(screen.getByLabelText(/Icon/i), { target: { value: 'scissors' } });
        fireEvent.change(screen.getByLabelText(/Sort Order/i), { target: { value: '10' } });

        await act(async () => {
            fireEvent.click(screen.getByText('Create'));
        });

        expect(mockCreateService).toHaveBeenCalledWith(expect.objectContaining({
            price: 500,
            icon: 'scissors',
            sort_order: 10
        }));

        // Advance timers to trigger the setTimeout call
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        await waitFor(() => {
            expect(screen.getByText('Service created')).toBeDefined();
            expect(mockCloseSidebar).toHaveBeenCalled();
        }, { timeout: 2000 });

        vi.useRealTimers();
    });

    it('handles create failure', async () => {
        mockCreateService.mockResolvedValue({ success: false, error: 'API Error' });
        render(<ServiceFormSidebar />);

        fireEvent.change(screen.getByPlaceholderText('Baño y Secado'), { target: { value: 'New Service' } });
        await act(async () => {
            fireEvent.click(screen.getByText('Create'));
        });

        await waitFor(() => {
            expect(screen.getByText('API Error')).toBeDefined();
        });
    });

    it('adds and removes features', async () => {
        render(<ServiceFormSidebar />);

        const input = screen.getByPlaceholderText('Add feature');
        const addBtn = screen.getByLabelText('Add Feature');

        fireEvent.change(input, { target: { value: 'F1' } });
        await act(async () => {
            fireEvent.click(addBtn);
        });

        expect(screen.getByText('F1')).toBeDefined();

        const removeBtn = screen.getByLabelText('Remove Feature F1');
        await act(async () => {
            fireEvent.click(removeBtn);
        });

        expect(screen.queryByText('F1')).toBeNull();
    });

    it('deletes a service', async () => {
        mockDeleteService.mockResolvedValue({ success: true });
        render(<ServiceFormSidebar service={mockService} />);

        const deleteBtn = screen.getByLabelText('Delete Service');
        await act(async () => {
            fireEvent.click(deleteBtn);
        });

        expect(mockDeleteService).toHaveBeenCalledWith(mockService.id);
        expect(mockTriggerRefresh).toHaveBeenCalled();
        expect(mockCloseSidebar).toHaveBeenCalled();
    });
});
