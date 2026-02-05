import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminContext } from '@/providers/AdminProvider'

interface UseAdminAuthOptions {
    redirectToLogin?: boolean;
    loginPath?: string;
}

export function useAdminAuth({ redirectToLogin = false, loginPath = "/admin/login" }: UseAdminAuthOptions = {}) {
    const { user, profile, loading, isAdmin, signOut } = useAdminContext();
    const router = useRouter();

    useEffect(() => {
        if (!loading && redirectToLogin && (!user || !isAdmin)) {
            router.push(loginPath);
        }
    }, [user, isAdmin, loading, redirectToLogin, loginPath, router]);

    return { user, profile, isAdmin, loading, signOut }
}
