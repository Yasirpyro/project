'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  Target,
  Briefcase,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

interface SidebarProps {
  role: 'advisor' | 'student';
}

const advisorLinks = [
  {
    href: '/advisor/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/advisor/students',
    label: 'Students',
    icon: Users,
  },
  {
    href: '/advisor/reports',
    label: 'Reports',
    icon: FileText,
  },
];

const studentLinks = [
  {
    href: '/student/pathway',
    label: 'Career Pathway',
    icon: Target,
  },
  {
    href: '/student/opportunities',
    label: 'Opportunities',
    icon: Briefcase,
  },
  {
    href: '/student/courses',
    label: 'Courses',
    icon: BookOpen,
  },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = role === 'advisor' ? advisorLinks : studentLinks;

  return (
    <aside className="w-64 border-r bg-background h-screen sticky top-0 hidden md:block">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 rounded-lg bg-blue-600">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Scholaris</h2>
            <p className="text-xs text-muted-foreground capitalize">{role} Portal</p>
          </div>
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
