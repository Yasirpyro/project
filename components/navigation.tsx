'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, GraduationCap, LogOut, Menu, Moon, Settings, Sun, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface NavigationProps {
  role?: 'advisor' | 'student';
}

export function Navigation({ role }: NavigationProps) {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const current = (resolvedTheme ?? theme ?? 'light') as 'light' | 'dark';
    setTheme(current === 'light' ? 'dark' : 'light');
  };

  const currentTheme = (resolvedTheme ?? theme ?? 'light') as 'light' | 'dark';

  const navLinks = role === 'advisor'
    ? [
        { href: '/advisor/dashboard', label: 'Dashboard' },
        { href: '/advisor/students', label: 'Students' },
        { href: '/advisor/reports', label: 'Reports' },
      ]
    : role === 'student'
    ? [
        { href: '/student/pathway', label: 'My Pathway' },
        { href: '/student/courses', label: 'Courses' },
        { href: '/student/opportunities', label: 'Opportunities' },
      ]
    : [];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-600">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl hidden sm:inline">University AI</span>
            </Link>

            {navLinks.length > 0 && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                      pathname === link.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {role && (
              <Badge variant="outline" className="hidden sm:flex">
                {role === 'advisor' ? 'Advisor' : 'Student'}
              </Badge>
            )}

            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {mounted ? (
                currentTheme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )
              ) : (
                <span className="w-5 h-5" aria-hidden />
              )}
            </Button>

            {role && (
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                  3
                </Badge>
              </Button>
            )}

            {role && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {role === 'advisor' ? 'AD' : 'JS'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {navLinks.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            )}
          </div>
        </div>

        {mobileMenuOpen && navLinks.length > 0 && (
          <div className="md:hidden py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
