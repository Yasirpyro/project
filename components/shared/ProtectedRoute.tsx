'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getCurrentRole } from '@/supabaseclient';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'advisor' | 'student';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!supabase) {
          router.push('/login');
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/login');
          return;
        }

        // Check role if required
        if (requiredRole) {
          const currentRole = await getCurrentRole();
          if (currentRole !== requiredRole) {
            // Redirect to appropriate dashboard
            const targetPath = currentRole === 'advisor' ? '/advisor/dashboard' : '/student/pathway';
            router.push(targetPath);
            return;
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
