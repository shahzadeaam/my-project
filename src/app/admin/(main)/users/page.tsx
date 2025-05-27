
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, UsersRound, Loader2, Edit, UserX, UserCheck, Info } from 'lucide-react';
import type { UserProfileDocument } from '@/types/firestore';
import { db, Timestamp } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EditUserForm, { type EditUserFormValues } from '@/components/admin/users/edit-user-form';
import { Alert, AlertDescription } from '@/components/ui/alert';


export default function AdminUsersPage() {
  const { currentUser: adminUser, userDocument: adminUserDoc, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [userList, setUserList] = useState<UserProfileDocument[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserProfileDocument | null>(null);
  const [isSavingUser, setIsSavingUser] = useState(false);

  const isAdmin = adminUserDoc?.role === 'admin';

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setFetchError(null);
    try {
      const usersCol = collection(db, 'users');
      const usersSnapshot = await getDocs(query(usersCol, orderBy('createdAt', 'desc')));
      const fetchedUsers = usersSnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          uid: docSnap.id,
          fullName: data.fullName || "نامشخص",
          email: data.email || "ایمیل نامشخص",
          phoneNumber: data.phoneNumber || "ثبت نشده",
          createdAt: data.createdAt,
          role: data.role || 'customer',
          disabled: data.disabled || false,
        } as UserProfileDocument;
      });
      setUserList(fetchedUsers);
    } catch (error: any) {
      console.error("Error fetching users for admin page:", error);
      if (error.message && (error.message.toLowerCase().includes("permission") || error.message.toLowerCase().includes("missing or insufficient permissions"))) {
        setFetchError("شما مجوز کافی برای دسترسی به لیست کاربران را ندارید. لطفاً با مدیر سیستم تماس بگیرید یا از صحت قوانین امنیتی Firestore اطمینان حاصل کنید.");
      } else {
        setFetchError("خطا در بارگذاری کاربران از پایگاه داده.");
      }
      toast({ title: "خطا", description: "مشکلی در بارگذاری لیست کاربران رخ داد.", variant: "destructive" });
    } finally {
      setIsLoadingUsers(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && adminUser && isAdmin) {
      fetchUsers();
    } else if (!authLoading && (!adminUser || !isAdmin)) {
        setIsLoadingUsers(false);
        // Error message for non-admin access is handled by the main return block
    }
  }, [adminUser, adminUserDoc, authLoading, fetchUsers, isAdmin]);

  const handleOpenEditDialog = (user: UserProfileDocument) => {
    setSelectedUserForEdit(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = async (data: EditUserFormValues) => {
    if (!selectedUserForEdit || !isAdmin) {
      toast({ title: "خطا", description: "امکان ذخیره تغییرات وجود ندارد.", variant: "destructive"});
      return;
    }
    setIsSavingUser(true);
    try {
      const userDocRef = doc(db, 'users', selectedUserForEdit.uid);
      await updateDoc(userDocRef, {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        role: data.role,
        disabled: data.disabled,
        updatedAt: Timestamp.now(),
      });
      toast({ title: "موفقیت", description: `اطلاعات کاربر "${data.fullName}" با موفقیت به‌روزرسانی شد.`});
      setIsEditDialogOpen(false);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error updating user:", error);
      toast({ title: "خطا در ذخیره‌سازی", description: "مشکلی در به‌روزرسانی اطلاعات کاربر رخ داد.", variant: "destructive"});
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleToggleUserDisabledStatus = async (user: UserProfileDocument) => {
    if (!isAdmin) {
       toast({ title: "دسترسی غیرمجاز", description: "شما اجازه تغییر وضعیت کاربر را ندارید.", variant: "destructive"});
      return;
    }
    const newDisabledStatus = !user.disabled;
    const actionText = newDisabledStatus ? "غیرفعال" : "فعال";
    if (window.confirm(`آیا از ${actionText} کردن کاربر "${user.fullName}" مطمئن هستید؟ (این عملیات شبیه‌سازی شده است)`)) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          disabled: newDisabledStatus,
          updatedAt: Timestamp.now(),
        });
        toast({ title: "موفقیت", description: `وضعیت کاربر "${user.fullName}" به ${actionText} تغییر یافت (شبیه‌سازی شده).`});
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error(`Error toggling user disabled status for ${user.uid}:`, error);
        toast({ title: "خطا", description: `مشکلی در ${actionText} کردن کاربر پیش آمد.`, variant: "destructive"});
      }
    }
  };


  if (authLoading || isLoadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 rtl:mr-2">در حال بارگذاری اطلاعات...</p>
      </div>
    );
  }

  if (!adminUser || !isAdmin) {
     return (
      <div className="text-center py-12">
        <UsersRound className="mx-auto h-12 w-12 mb-4 text-destructive" />
        <h3 className="text-xl font-semibold text-destructive">دسترسی غیرمجاز</h3>
        <p className="text-muted-foreground mt-2">شما اجازه مشاهده یا مدیریت کاربران را ندارید.</p>
         <Button asChild className="mt-4">
            <Link href="/admin/dashboard">بازگشت به داشبورد</Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">مدیریت کاربران</h2>
        <p className="text-sm text-muted-foreground">
          مشاهده و ویرایش کاربران ثبت نام شده در سایت.
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
                <UsersRound className="mx-auto h-12 w-12 mb-4" />
                {fetchError}
            </div>
          ) : userList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام کامل</TableHead>
                  <TableHead>ایمیل</TableHead>
                  <TableHead className="hidden sm:table-cell">شماره تماس</TableHead>
                  <TableHead className="hidden md:table-cell">نقش</TableHead>
                  <TableHead className="hidden md:table-cell">وضعیت</TableHead>
                  <TableHead className="hidden lg:table-cell">تاریخ عضویت</TableHead>
                  <TableHead className="text-left">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userList.map((user) => (
                  <TableRow key={user.uid} className={user.disabled ? 'opacity-60 bg-muted/30' : ''}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell className="dir-ltr">{user.email}</TableCell>
                    <TableCell className="hidden sm:table-cell dir-ltr">
                      {user.phoneNumber || <Badge variant="outline" className="font-normal">ثبت نشده</Badge>}
                    </TableCell>
                     <TableCell className="hidden md:table-cell">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-primary/80 hover:bg-primary' : ''}>
                        {user.role === 'admin' ? 'ادمین' : 'مشتری'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={user.disabled ? 'destructive' : 'default'} className={user.disabled ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}>
                        {user.disabled ? 'غیرفعال' : 'فعال'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                        {user.createdAt ? (user.createdAt as Timestamp).toDate().toLocaleDateString('fa-IR') : 'نامشخص'}
                    </TableCell>
                    <TableCell className="text-left">
                      <DropdownMenu dir="rtl">
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!isAdmin}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">منوی عملیات</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleOpenEditDialog(user)} disabled={!isAdmin}>
                            <Edit className="ml-2 h-3.5 w-3.5 rtl:mr-2 rtl:ml-0" />
                            ویرایش کاربر
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onSelect={() => handleToggleUserDisabledStatus(user)} 
                            disabled={!isAdmin || user.uid === adminUser?.uid} // Admin cannot disable themselves
                            className={user.disabled ? "text-green-600 focus:text-green-700 focus:bg-green-50" : "text-destructive focus:text-destructive focus:bg-destructive/10"}
                          >
                            {user.disabled ? (
                              <UserCheck className="ml-2 h-3.5 w-3.5 rtl:mr-2 rtl:ml-0" />
                            ) : (
                              <UserX className="ml-2 h-3.5 w-3.5 rtl:mr-2 rtl:ml-0" />
                            )}
                            {user.disabled ? 'فعال کردن (شبیه‌سازی)' : 'غیرفعال کردن (شبیه‌سازی)'}
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
              هنوز کاربری در پایگاه داده ثبت نشده است.
            </div>
          )}
        </CardContent>
      </Card>

      {selectedUserForEdit && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>ویرایش کاربر: {selectedUserForEdit.fullName}</DialogTitle>
              <DialogDescription>
                اطلاعات کاربر را در فرم زیر ویرایش کنید.
              </DialogDescription>
            </DialogHeader>
            <EditUserForm
              user={selectedUserForEdit}
              onSave={handleSaveUser}
              isSaving={isSavingUser}
            />
             <Alert variant="default" className="mt-4 text-xs">
                <Info className="h-4 w-4" />
                <AlertDescription>
                 تغییر نقش به "ادمین" به کاربر دسترسی‌های مدیریتی در Firestore (طبق قوانین امنیتی) خواهد داد. تغییر وضعیت "غیرفعال" در حال حاضر شبیه‌سازی شده است.
                </AlertDescription>
            </Alert>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
