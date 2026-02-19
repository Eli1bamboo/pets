import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { InventoryLog, InventoryReason, Product } from '@/types'
import { useRefresh } from '@/providers/AdminUIProvider'

export function useInventory(productId?: number) {
    const [logs, setLogs] = useState<InventoryLog[]>([])
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [supabase] = useState(() => createClient())
    const { refreshTrigger } = useRefresh()

    const fetchLogs = useCallback(async () => {
        setLoading(true)
        try {
            let query = supabase
                .from('inventory_logs')
                .select(`
                    *,
                    product:products(id, name, sku)
                `)
                .order('created_at', { ascending: false })
                .limit(50)

            if (productId) {
                query = query.eq('product_id', productId)
            }

            const { data, error } = await query
            if (error) throw error
            setLogs(data || [])
        } catch (err) {
            console.error('Error fetching inventory logs:', err)
            setError('Error al cargar historial de inventario')
        } finally {
            setLoading(false)
        }
    }, [supabase, productId, refreshTrigger])

    const fetchLowStockProducts = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .filter('stock_quantity', 'lte', 'low_stock_threshold' as unknown as number)
                .eq('is_active', true)
                .order('stock_quantity', { ascending: true })

            if (error) {
                // Fallback: fetch all and filter client-side
                const { data: allProducts, error: allError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true)

                if (allError) throw allError
                setLowStockProducts(
                    (allProducts || []).filter(p => p.stock_quantity <= p.low_stock_threshold)
                )
                return
            }
            setLowStockProducts(data || [])
        } catch (err) {
            console.error('Error fetching low stock products:', err)
        }
    }, [supabase, refreshTrigger])

    const adjustStock = async (
        targetProductId: number,
        changeQuantity: number,
        reason: InventoryReason,
        referenceId?: string
    ) => {
        try {
            // 1. Get current stock
            const { data: product, error: fetchError } = await supabase
                .from('products')
                .select('stock_quantity')
                .eq('id', targetProductId)
                .single()

            if (fetchError) throw fetchError

            const newQuantity = Math.max(0, product.stock_quantity + changeQuantity)

            // 2. Update product stock
            const { error: updateError } = await supabase
                .from('products')
                .update({ stock_quantity: newQuantity, updated_at: new Date().toISOString() })
                .eq('id', targetProductId)

            if (updateError) throw updateError

            // 3. Insert inventory log
            const { error: logError } = await supabase
                .from('inventory_logs')
                .insert({
                    product_id: targetProductId,
                    change_quantity: changeQuantity,
                    new_quantity: newQuantity,
                    reason,
                    reference_id: referenceId || null,
                })

            if (logError) throw logError

            // 4. Refresh data
            await Promise.all([fetchLogs(), fetchLowStockProducts()])

            return { success: true, newQuantity }
        } catch (error) {
            console.error('Error adjusting stock:', error)
            return { success: false, error }
        }
    }

    useEffect(() => {
        fetchLogs()
        fetchLowStockProducts()
    }, [fetchLogs, fetchLowStockProducts])

    return {
        logs,
        lowStockProducts,
        loading,
        error,
        refetchLogs: fetchLogs,
        refetchLowStock: fetchLowStockProducts,
        adjustStock,
    }
}
