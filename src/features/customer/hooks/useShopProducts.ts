import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Product, ProductCategory } from '@/types'

export function useShopProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<ProductCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [supabase] = useState(() => createClient())

    const fetchProducts = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    category:product_categories(*),
                    images:product_images(*)
                `)
                .eq('is_active', true)
                .order('is_featured', { ascending: false })
                .order('sort_order', { ascending: true })

            if (error) throw error
            setProducts(data || [])
        } catch (err) {
            console.error('Error fetching products:', err)
            setError('Error loading products')
        }
    }, [supabase])

    const fetchCategories = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('product_categories')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true })

            if (error) throw error
            setCategories(data || [])
        } catch (err) {
            console.error('Error fetching categories:', err)
        }
    }, [supabase])

    useEffect(() => {
        Promise.all([fetchProducts(), fetchCategories()]).finally(() => setLoading(false))
    }, [fetchProducts, fetchCategories])

    return { products, categories, loading, error }
}
