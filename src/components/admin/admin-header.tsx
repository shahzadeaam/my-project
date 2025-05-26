
'use client';

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, UserCircle, Search, Settings, LogOut } from "lucide-react"; // Added Settings and LogOut
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith('/admin/dashboard')) return 'داشبورد';
  if (pathname.startsWith('/admin/products')) return 'مدیریت محصولات';
  if (pathname.startsWith('/admin/orders')) return 'مدیریت سفارش‌ها';
  if (pathname.startsWith('/admin/users')) return 'مدیریت کاربران';
  if (pathname.startsWith('/admin/settings')) return 'تنظیمات';
  return 'پنل مدیریت';
};

export default function AdminHeader() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 shadow-sm">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      
      <h1 className="text-xl font-semibold hidden md:block">{pageTitle}</h1>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 ml-auto">
        <form className="ml-auto flex-1 sm:flex-initial hidden md:block">
          {/* <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:right-2.5 rtl:left-auto" />
            <Input
              type="search"
              placeholder="جستجو..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] h-9 bg-muted/50"
              dir="rtl"
            />
          </div> */}
        </form>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" aria-label="اعلانات">
          <Bell className="h-5 w-5" />
          <span className="sr-only">نمایش اعلانات</span>
        </Button>
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
              <UserCircle className="h-6 w-6" />
              <span className="sr-only">منوی کاربر</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">ادمین سیستم</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        admin@example.com (نمایشی)
                    </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                <span>تنظیمات حساب</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
                <Bell className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                <span>اعلانات (نمایشی)</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/login"> {/* Should be a logout action */}
                <LogOut className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                <span>خروج (نمایشی)</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
