import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/types'

interface UseAuthOptions {
    redirectToLogin?: boolean;
}

export function useAuth({ redirectToLogin = false }: UseAuthOptions = {}) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchProfile = async (userId: string) => {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()
            setProfile(profile)
            setLoading(false)
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(session.user)
                fetchProfile(session.user.id)
            } else {
                setUser(null)
                setProfile(null)
                setLoading(false)
                if (redirectToLogin && (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION')) {
                    router.push("/login")
                }
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase, router, redirectToLogin])

    const signOut = async () => {
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
    }

    return { user, profile, isAdmin: profile?.role === 'admin', loading, signOut }
}
