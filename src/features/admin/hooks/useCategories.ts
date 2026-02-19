import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ProductCategory } from '@/types'
import { useRefresh } from '@/providers/AdminUIProvider'

export function useCategories() {
    const [categories, setCategories] = useState<ProductCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [supabase] = useState(() => createClient())
    const { refreshTrigger } = useRefresh()

    const fetchCategories = useCallback(async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('product_categories')
                .select('*')
                .order('sort_order', { ascending: true })

            if (error) throw error
            setCategories(data || [])
        } catch (err) {
            console.error('Error fetching categories:', err)
            setError('Error al cargar categorías')
        } finally {
            setLoading(false)
        }
    }, [supabase, refreshTrigger])

    const createCategory = async (category: Omit<ProductCategory, 'id' | 'created_at'>) => {
        try {
            const { error } = await supabase.from('product_categories').insert(category)
            if (error) throw error
            await fetchCategories()
            return { success: true }
        } catch (error) {
            console.error('Error creating category:', error)
            return { success: false, error }
        }
    }

    const updateCategory = async (id: number, updates: Partial<ProductCategory>) => {
        try {
            const { error } = await supabase.from('product_categories').update(updates).eq('id', id)
            if (error) throw error
            await fetchCategories()
            return { success: true }
        } catch (error) {
            console.error('Error updating category:', error)
            return { success: false, error }
        }
    }

    const deleteCategory = async (id: number) => {
        try {
            const { error } = await supabase.from('product_categories').delete().eq('id', id)
            if (error) throw error
            await fetchCategories()
            return { success: true }
        } catch (error) {
            console.error('Error deleting category:', error)
            return { success: false, error }
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    }
}
