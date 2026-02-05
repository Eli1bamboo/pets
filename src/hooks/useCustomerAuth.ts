import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCustomerContext } from '@/providers/CustomerProvider'

interface UseCustomerAuthOptions {
    redirectToLogin?: boolean;
    loginPath?: string;
}

export function useCustomerAuth({ redirectToLogin = false, loginPath = "/login" }: UseCustomerAuthOptions = {}) {
    const { user, profile, loading, signOut } = useCustomerContext();
    const router = useRouter();

    useEffect(() => {
        if (!loading && redirectToLogin && !user) {
            router.push(loginPath);
        }
    }, [user, loading, redirectToLogin, loginPath, router]);

    return { user, profile, loading, signOut }
}
