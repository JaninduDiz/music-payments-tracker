'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/balance', label: 'Balance', icon: Home },
  { href: '/members', label: 'Members', icon: Users },
  { href: '/payments', label: 'Payments', icon: DollarSign },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <header className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-sm" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <nav className="container flex h-16 max-w-4xl justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 p-2 text-xs font-medium transition-all duration-300 ease-in-out',
                isActive
                  ? 'text-primary scale-110'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
