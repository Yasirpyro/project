'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Loader2 } from 'lucide-react';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { signInWithRole } from '@/supabaseclient';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const roleFromQuery = searchParams.get('role');
  const lockedRole = roleFromQuery === 'advisor' || roleFromQuery === 'student' ? roleFromQuery : null;
  const initialRole = (lockedRole ?? 'advisor') as 'advisor' | 'student';
  const [activeTab, setActiveTab] = useState<'advisor' | 'student'>(initialRole);

  const handleLogin = async (e: React.FormEvent, role: 'advisor' | 'student') => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithRole({ email, password, role });

      if (result.error) {
        throw result.error;
      }

      if (!('role' in result) || !result.role) {
        throw new Error('Unable to determine account role.');
      }

      toast({
        title: 'Login Successful',
        description: `Welcome back! Redirecting to ${result.role} dashboard...`,
      });

      if (result.role === 'advisor') {
        router.push('/advisor/dashboard');
      } else {
        router.push('/student/pathway');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in. Please try again.';
      toast({
        title: 'Authentication Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderForm = (role: 'advisor' | 'student') => {
    const roleLabel = role === 'advisor' ? 'Advisor' : 'Student';
    return (
      <form onSubmit={(e) => handleLogin(e, role)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${role}-email`}>Email</Label>
          <Input
            id={`${role}-email`}
            type="email"
            placeholder={`${role}@university.edu`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${role}-password`}>Password</Label>
          <Input
            id={`${role}-password`}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`remember-${role}`}
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <label
              htmlFor={`remember-${role}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Link href="#" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            `Sign in as ${roleLabel}`
          )}
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-600 mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to access your dashboard</p>
          </div>

          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                {lockedRole ? `Signed in as ${lockedRole === 'advisor' ? 'Advisor' : 'Student'}` : 'Choose your role and enter your credentials'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lockedRole ? (
                <div className="space-y-6">
                  <div className="rounded-xl bg-muted/40 px-4 py-3 text-sm font-medium">
                    You are signing in as {lockedRole === 'advisor' ? 'Advisor' : 'Student'}
                  </div>
                  {renderForm(lockedRole)}
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'advisor' | 'student')}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="advisor">Advisor</TabsTrigger>
                    <TabsTrigger value="student">Student</TabsTrigger>
                  </TabsList>

                  <TabsContent value="advisor">{renderForm('advisor')}</TabsContent>
                  <TabsContent value="student">{renderForm('student')}</TabsContent>
                </Tabs>
              )}

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>Demo credentials: Use any email and password</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
