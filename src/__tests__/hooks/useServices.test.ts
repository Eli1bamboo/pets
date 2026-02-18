import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useServices } from '@/features/admin/hooks/useServices';
import { Service } from '@/types';
import { PostgrestError } from '@supabase/supabase-js';

// Mock Supabase
const mockFrom = vi.fn();

vi.mock('@/utils/supabase/client', () => ({
    createClient: () => ({
        from: mockFrom,
    }),
}));

const mockServices: Service[] = [
    { id: 1, name: 'Service 1', name_en: null, is_active: true, sort_order: 1, price: 50, description: 'Desc 1', description_en: null, features: [], features_en: [], icon: 'icon1', created_at: '2023-01-01' },
    { id: 2, name: 'Service 2', name_en: null, is_active: false, sort_order: 2, price: 100, description: 'Desc 2', description_en: null, features: [], features_en: [], icon: 'icon2', created_at: '2023-01-01' },
];

// Mock AdminUIProvider
vi.mock('@/providers/AdminUIProvider', () => ({
    useAdminUI: vi.fn(),
    useRefresh: () => ({ refreshTrigger: 0, triggerRefresh: vi.fn() }),
}));

// Typed Mock Builder
interface MockPostgrestBuilder {
    select: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    insert: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
}

describe('useServices', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches active services when includeInactive is false', async () => {
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect });

        // Mock chain: .from('services').select('*').order('sort_order', ...).eq('is_active', true)
        const mockEq = vi.fn().mockResolvedValue({ data: [mockServices[0]], error: null });
        const mockOrder = vi.fn().mockReturnValue({ eq: mockEq });
        mockSelect.mockReturnValue({ order: mockOrder });

        const { result } = renderHook(() => useServices({ includeInactive: false }));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.services).toEqual([mockServices[0]]);
        expect(mockEq).toHaveBeenCalledWith('is_active', true);
    });

    it('fetches all services when includeInactive is true', async () => {
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect });

        // Mock chain: .from('services').select('*').order('sort_order', ...) -> resolves directly
        const mockOrder = vi.fn().mockResolvedValue({ data: mockServices, error: null });
        mockSelect.mockReturnValue({ order: mockOrder });

        const { result } = renderHook(() => useServices({ includeInactive: true }));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.services).toEqual(mockServices);
        // Should NOT call eq('is_active', true)
    });

    it('handles fetch error', async () => {
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect });

        // Force error
        const mockOrder = vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: new Error("Fetch failed") })
        });
        mockSelect.mockReturnValue({ order: mockOrder });

        const { result } = renderHook(() => useServices({ includeInactive: false }));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe("Error al cargar servicios");
        expect(result.current.services).toEqual([]);
    });

    it('creates a service', async () => {
        // Setup initial fetch mock (empty)
        const mockSelect = vi.fn();
        mockFrom.mockReturnValue({ select: mockSelect, insert: vi.fn() });
        const mockOrder = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) });
        mockSelect.mockReturnValue({ order: mockOrder });

        const { result } = renderHook(() => useServices());
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Mock insert
        const mockInsert = vi.fn().mockResolvedValue({ error: null });
        mockFrom.mockReturnValue({
            select: mockSelect, // Need select for refetch
            insert: mockInsert
        });

        const newService: Omit<Service, "id" | "created_at" | "updated_at"> = {
            name: 'New Service', name_en: null, price: 100, is_active: true, sort_order: 3, description: 'Test',
            description_en: null, features: [], features_en: [], icon: 'icon-new'
        };

        let success;
        await act(async () => {
            const res = await result.current.createService(newService);
            success = res.success;
        });

        expect(success).toBe(true);
        expect(mockInsert).toHaveBeenCalledWith(newService);
        // Should trigger refetch (mockSelect called twice total)
        expect(mockSelect).toHaveBeenCalledTimes(2);
    });

    it('updates a service', async () => {
        // Setup initial fetch
        const mockSelect = vi.fn();
        const mockOrder = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) });
        mockSelect.mockReturnValue({ order: mockOrder });
        mockFrom.mockReturnValue({ select: mockSelect });

        const { result } = renderHook(() => useServices());
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Mock update
        const mockEq = vi.fn().mockResolvedValue({ error: null });
        const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
        mockFrom.mockReturnValue({
            select: mockSelect,
            update: mockUpdate
        });

        const updateData = { name: 'Updated' };
        let success;
        await act(async () => {
            const res = await result.current.updateService(1, updateData);
            success = res.success;
        });

        expect(success).toBe(true);
        expect(mockUpdate).toHaveBeenCalledWith(updateData);
        expect(mockEq).toHaveBeenCalledWith('id', 1);
        expect(mockSelect).toHaveBeenCalledTimes(2); // Initial + Refetch
    });

    it('deletes a service', async () => {
        // Setup initial fetch
        const mockSelect = vi.fn();
        const mockOrder = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) });
        mockSelect.mockReturnValue({ order: mockOrder });

        // Mock delete
        const mockEqDelete = vi.fn().mockResolvedValue({ error: null });
        const mockDelete = vi.fn().mockReturnValue({ eq: mockEqDelete });

        mockFrom.mockReturnValue({
            select: mockSelect,
            delete: mockDelete
        });

        const { result } = renderHook(() => useServices());
        await waitFor(() => expect(result.current.loading).toBe(false));

        let success;
        await act(async () => {
            const res = await result.current.deleteService(1);
            success = res.success;
        });

        expect(success).toBe(true);
        expect(mockDelete).toHaveBeenCalled();
        expect(mockEqDelete).toHaveBeenCalledWith('id', 1);
        expect(mockSelect).toHaveBeenCalledTimes(2);
    });

    it('handles create service failure', async () => {
        const mockSelect = vi.fn().mockReturnValue({ order: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) });
        mockFrom.mockReturnValue({ select: mockSelect });

        const { result } = renderHook(() => useServices());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockFrom.mockReturnValue({
            select: mockSelect,
            insert: vi.fn().mockResolvedValue({ error: { message: 'Insert failed' } })
        });

        let response: { success: boolean; error?: any };
        await act(async () => {
            const newService: Omit<Service, "id" | "created_at" | "updated_at"> = {
                name: 'New', name_en: null, price: 0, description: '', description_en: null,
                features: [], features_en: [], icon: '', is_active: true, sort_order: 0
            };
            response = await result.current.createService(newService);
        });

        expect(response!.success).toBe(false);
    });

    it('handles update service failure', async () => {
        const mockSelect = vi.fn().mockReturnValue({ order: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) });
        mockFrom.mockReturnValue({ select: mockSelect });

        const { result } = renderHook(() => useServices());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockFrom.mockReturnValue({
            select: mockSelect,
            update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: { message: 'Update failed' } }) })
        });

        let response: { success: boolean; error?: any };
        await act(async () => {
            response = await result.current.updateService(1, { name: 'New' });
        });

        expect(response!.success).toBe(false);
    });

    it('handles delete service failure', async () => {
        const mockSelect = vi.fn().mockReturnValue({ order: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ data: [], error: null }) }) });
        mockFrom.mockReturnValue({ select: mockSelect });

        const { result } = renderHook(() => useServices());
        await waitFor(() => expect(result.current.loading).toBe(false));

        mockFrom.mockReturnValue({
            select: mockSelect,
            delete: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: { message: 'Delete failed' } }) })
        });

        let response: { success: boolean; error?: any };
        await act(async () => {
            response = await result.current.deleteService(1);
        });

        expect(response!.success).toBe(false);
    });
});
