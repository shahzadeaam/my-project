
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, LayoutGrid, ShoppingBag, Users, Settings, LogOut, Bell, UserCircle, BellRing } from 'lucide-react'; // Added BellRing
import Logo from '@/components/common/logo';
import Link from 'next/link';
import AdminHeader from '@/components/admin/admin-header';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/admin/dashboard', label: 'داشبورد', icon: LayoutGrid },
  { href: '/admin/products', label: 'محصولات', icon: ShoppingBag },
  { href: '/admin/orders', label: 'سفارش‌ها', icon: Home }, // Using Home as placeholder
  { href: '/admin/users', label: 'کاربران', icon: Users },
  { href: '/admin/notifications', label: 'تنظیمات اطلاع‌رسانی', icon: BellRing }, // Added Notification Settings
  { href: '/admin/settings', label: 'تنظیمات عمومی', icon: Settings },
];

export default function AdminMainLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon" side="right" className="border-l">
          <SidebarHeader className="p-4">
             <div className="flex items-center justify-between">
                <Logo />
                <SidebarTrigger className="md:hidden" /> {/* Show trigger on mobile inside header */}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild tooltip={{children: item.label, side: 'left'}}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{children: "بازگشت به سایت", side: 'left'}}>
                        <Link href="/">
                            <Home />
                            <span>بازگشت به سایت</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={{children: "خروج از حساب", side: 'left'}}>
                        {/* In a real app, this would trigger a logout function */}
                        <Link href="/admin/login"> 
                            <LogOut />
                            <span>خروج (نمایشی)</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <AdminHeader />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/30 min-h-[calc(100vh-4rem)]"> {/* Adjust min-h if header height changes */}
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
