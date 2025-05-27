
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, UsersRound, PackageOpen } from 'lucide-react'; // آیکون UsersRound استفاده خواهد شد
import type { UserProfileDocument } from '@/types/firestore'; 
import { db, Timestamp } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

async function getUsersFromFirestore(): Promise<UserProfileDocument[]> {
  const usersCol = collection(db, 'users');
  // مرتب‌سازی بر اساس تاریخ ایجاد به صورت نزولی
  const usersSnapshot = await getDocs(query(usersCol, orderBy('createdAt', 'desc')));
  const userList = usersSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      uid: doc.id, 
      fullName: data.fullName || "نامشخص",
      email: data.email || "ایمیل نامشخص",
      phoneNumber: data.phoneNumber || "ثبت نشده",
      createdAt: data.createdAt,
      role: data.role || 'customer', // اضافه کردن نقش برای نمایش احتمالی یا فیلتر در آینده
    } as UserProfileDocument;
  });
  return userList;
}

export default async function AdminUsersPage() {
  let userList: UserProfileDocument[] = [];
  let fetchError: string | null = null;

  try {
    userList = await getUsersFromFirestore();
  } catch (error: any) {
    console.error("Error fetching users for admin page:", error);
    if (error.message && (error.message.toLowerCase().includes("permission") || error.message.toLowerCase().includes("missing or insufficient permissions"))) {
        fetchError = "شما مجوز کافی برای دسترسی به لیست کاربران را ندارید. لطفاً با مدیر سیستم تماس بگیرید یا از صحت قوانین امنیتی Firestore اطمینان حاصل کنید.";
    } else {
        fetchError = "خطا در بارگذاری کاربران از پایگاه داده. لطفاً کنسول مرورگر را برای جزئیات بیشتر بررسی کنید.";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">مدیریت کاربران</h2>
        <p className="text-sm text-muted-foreground">
          مشاهده کاربران ثبت نام شده در سایت. (عملیات ویرایش و مدیریت دسترسی بزودی)
        </p>
      </div>
      
      <Card>
        <CardHeader className="px-7">
          <CardTitle>لیست کاربران</CardTitle>
          <CardDescription>
            {fetchError ? fetchError : `در مجموع ${userList.length} کاربر در سیستم موجود است.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError ? (
             <div className="text-center py-12 text-destructive">
                <UsersRound className="mx-auto h-12 w-12 mb-4" /> {/* استفاده از آیکون مناسب‌تر */}
                {fetchError}
            </div>
          ) : userList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام کامل</TableHead>
                  <TableHead>ایمیل</TableHead>
                  <TableHead className="hidden md:table-cell">شماره تماس</TableHead>
                  <TableHead className="hidden md:table-cell">نقش</TableHead>
                  <TableHead className="hidden md:table-cell">تاریخ عضویت</TableHead>
                  <TableHead className="text-left">
                    <span className="sr-only">عملیات</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userList.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell className="dir-ltr">{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell dir-ltr">
                      {user.phoneNumber || <Badge variant="outline">ثبت نشده</Badge>}
                    </TableCell>
                     <TableCell className="hidden md:table-cell">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'ادمین' : 'مشتری'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {user.createdAt ? (user.createdAt as Timestamp).toDate().toLocaleDateString('fa-IR') : 'نامشخص'}
                    </TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu dir="rtl">
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">منوی عملیات</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                          <DropdownMenuItem disabled>
                            ویرایش (نمایشی)
                          </DropdownMenuItem>
                           <DropdownMenuItem disabled>
                            مشاهده پروفایل (نمایشی)
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            غیرفعال کردن (نمایشی)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
               <UsersRound className="mx-auto h-12 w-12 mb-4" />
              هنوز کاربری در پایگاه داده ثبت نشده است یا شما به آن‌ها دسترسی ندارید.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
