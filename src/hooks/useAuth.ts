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
        const checkUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser()

            if (error || !user) {
                setUser(null)
                setProfile(null)
                if (redirectToLogin) {
                    router.push("/login")
                }
            } else {
                setUser(user)
                // Fetch profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                setProfile(profile)
            }
            setLoading(false)
        }

        checkUser()
    }, [supabase, router, redirectToLogin])

    return { user, profile, isAdmin: profile?.role === 'admin', loading }
}
