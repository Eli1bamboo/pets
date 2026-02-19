import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Product } from '@/types'
import { useRefresh } from '@/providers/AdminUIProvider'

interface UseProductsOptions {
    includeInactive?: boolean;
}

export function useProducts({ includeInactive = true }: UseProductsOptions = {}) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [supabase] = useState(() => createClient())
    const { refreshTrigger } = useRefresh()

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            let query = supabase
                .from('products')
                .select(`
                    *,
                    category:product_categories(*),
                    images:product_images(*)
                `)
                .order('sort_order', { ascending: true })

            if (!includeInactive) {
                query = query.eq('is_active', true)
            }

            const { data, error } = await query

            if (error) throw error

            setProducts(data || [])
        } catch (err) {
            console.error('Error fetching products:', err)
            setError('Error al cargar productos')
        } finally {
            setLoading(false)
        }
    }, [supabase, includeInactive, refreshTrigger])

    const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category' | 'images'>) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert(product)
                .select()
                .single()
            if (error) throw error
            await fetchProducts()
            return { success: true, data }
        } catch (error) {
            console.error('Error creating product:', error)
            return { success: false, error }
        }
    }

    const updateProduct = async (id: number, updates: Partial<Product>) => {
        try {
            // Remove joined relations before updating
            const { category, images, ...cleanUpdates } = updates
            const { error } = await supabase
                .from('products')
                .update({ ...cleanUpdates, updated_at: new Date().toISOString() })
                .eq('id', id)
            if (error) throw error
            await fetchProducts()
            return { success: true }
        } catch (error) {
            console.error('Error updating product:', error)
            return { success: false, error }
        }
    }

    const deleteProduct = async (id: number) => {
        try {
            const { error } = await supabase.from('products').delete().eq('id', id)
            if (error) throw error
            await fetchProducts()
            return { success: true }
        } catch (error) {
            console.error('Error deleting product:', error)
            return { success: false, error }
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
    }
}
