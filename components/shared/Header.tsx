'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, User, LogOut, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { signOut } from '@/supabaseclient';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  role: 'advisor' | 'student';
}

export function Header({ userName = 'User', userEmail, role }: HeaderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
      router.push('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              placeholder={role === 'advisor' ? 'Search students...' : 'Search opportunities, courses...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <div className="p-3 hover:bg-muted cursor-pointer border-b">
                  <p className="text-sm font-medium">New opportunity match</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You have a new 85% match for Software Engineer position
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
                <div className="p-3 hover:bg-muted cursor-pointer border-b">
                  <p className="text-sm font-medium">Course grade updated</p>
                  <p className="text-xs text-muted-foreground mt-1">Your CS301 assignment has been graded</p>
                  <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                </div>
                <div className="p-3 hover:bg-muted cursor-pointer">
                  <p className="text-sm font-medium">Upcoming meeting</p>
                  <p className="text-xs text-muted-foreground mt-1">Academic advising session tomorrow at 2 PM</p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-white">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{userName}</p>
                  {userEmail && <p className="text-xs text-muted-foreground">{userEmail}</p>}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
