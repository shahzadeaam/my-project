
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form'; // Controller was already imported
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { UserProfileDocument } from '@/types/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const editUserFormSchema = z.object({
  fullName: z.string().min(3, { message: 'نام کامل باید حداقل ۳ حرف باشد.' }),
  phoneNumber: z.string().optional().or(z.literal('')),
  role: z.enum(['customer', 'admin'], { required_error: 'نقش کاربر الزامی است.' }),
  disabled: z.boolean().default(false),
});

export type EditUserFormValues = z.infer<typeof editUserFormSchema>;

interface EditUserFormProps {
  user: UserProfileDocument;
  onSave: (data: EditUserFormValues) => Promise<void>;
  isSaving: boolean;
}

export default function EditUserForm({ user, onSave, isSaving }: EditUserFormProps) {
  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      fullName: user.fullName || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role || 'customer',
      disabled: user.disabled || false,
    },
  });

  useEffect(() => {
    reset({
      fullName: user.fullName || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role || 'customer',
      disabled: user.disabled || false,
    });
  }, [user, reset]);

  const onSubmit: SubmitHandler<EditUserFormValues> = async (data) => {
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
      <div>
        <Label htmlFor="emailEditForm">ایمیل (غیرقابل ویرایش)</Label>
        <Input id="emailEditForm" value={user.email} disabled className="mt-1.5 h-11" dir="ltr" />
      </div>
      <div>
        <Label htmlFor="fullNameEditForm">نام و نام خانوادگی</Label>
        <Input id="fullNameEditForm" {...register('fullName')} className="mt-1.5 h-11" />
        {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
      </div>
      <div>
        <Label htmlFor="phoneNumberEditForm">شماره تماس</Label>
        <Input id="phoneNumberEditForm" {...register('phoneNumber')} className="mt-1.5 h-11" dir="ltr" />
        {errors.phoneNumber && <p className="text-sm text-destructive mt-1">{errors.phoneNumber.message}</p>}
      </div>
      <div>
        <Label htmlFor="roleEditForm">نقش کاربر</Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select 
              onValueChange={field.onChange} 
              value={field.value} // Changed from defaultValue to value
              dir="rtl" // Added dir for consistency
            >
              <SelectTrigger id="roleEditForm" className="mt-1.5 h-11">
                <SelectValue placeholder="انتخاب نقش..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">مشتری (Customer)</SelectItem>
                <SelectItem value="admin">ادمین (Admin)</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && <p className="text-sm text-destructive mt-1">{errors.role.message}</p>}
      </div>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Switch
          id="disabledEditForm"
          checked={control._getWatch('disabled')}
          onCheckedChange={(checked) => setValue('disabled', checked)}
        />
        <Label htmlFor="disabledEditForm">غیرفعال کردن حساب (شبیه‌سازی شده)</Label>
      </div>
      {control._getWatch('disabled') && (
         <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-700">
            <Info className="h-4 w-4 !text-yellow-700" />
            <AlertDescription className="text-xs">
             توجه: این گزینه در حال حاضر کاربر را به طور واقعی در Firebase Authentication غیرفعال نمی‌کند، بلکه فقط یک وضعیت در پایگاه داده Firestore برای او تنظیم می‌کند.
            </AlertDescription>
        </Alert>
      )}
      {errors.disabled && <p className="text-sm text-destructive mt-1">{errors.disabled.message}</p>}
      
      <div className="flex justify-end pt-3">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </Button>
      </div>
    </form>
  );
}
