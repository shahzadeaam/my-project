
'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User, ShoppingBag, Lock, Settings, Edit3, Save, ListOrdered, Eye, Info, Loader2, KeyRound, EyeOff, MapPin, PlusCircle, Trash2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useAuth } from '@/context/auth-context';
import { updateProfile as updateFirebaseProfile, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth, db, Timestamp } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, writeBatch, serverTimestamp, orderBy, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { UserProfileDocument, Address, OrderDocument, OrderItem } from '@/types/firestore';

const DEFAULT_ORDER_ITEM_IMAGE_PROFILE = "https://placehold.co/64x64.png";
const ICON_PLACEHOLDER_PROFILE = "w-8 h-8 text-muted-foreground";


export default function ProfilePage() {
  const { currentUser, userDocument, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  const [profile, setProfile] = useState<UserProfileDocument | null>(null);
  const [tempProfileData, setTempProfileData] = useState<{fullName: string, phoneNumber: string}>({ fullName: '', phoneNumber: ''});
  
  const [selectedOrder, setSelectedOrder] = useState<OrderDocument | null>(null);
  const [userOrders, setUserOrders] = useState<OrderDocument[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersFetchError, setOrdersFetchError] = useState<React.ReactNode | string | null>(null);


  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true); // Changed from false to true
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [currentAddressForm, setCurrentAddressForm] = useState<Omit<Address, 'id' | 'isDefault' | 'createdAt' | 'updatedAt'>>({
    recipientName: '',
    street: '',
    city: '',
    postalCode: '',
    phoneNumber: '',
  });

  const [privacySettings, setPrivacySettings] = useState<UserProfileDocument['privacySettings']>({
    showPublicProfile: false,
    receiveNewsletter: true,
    shareActivity: false,
  });
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);


  useEffect(() => {
    const fetchUserProfileAndData = async () => {
      if (currentUser && !authLoading) { // Ensure currentUser is available and auth is not loading
        setIsLoadingOrders(true);
        setIsLoadingAddresses(true);

        // Fetch User Profile Document
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data() as UserProfileDocument;
                setProfile(userData);
                setTempProfileData({ fullName: userData.fullName || currentUser.displayName || '', phoneNumber: userData.phoneNumber || '' });
                setPrivacySettings(userData.privacySettings || { showPublicProfile: false, receiveNewsletter: true, shareActivity: false });
            } else {
                 // Create profile if it doesn't exist
                const newProfileData: UserProfileDocument = {
                    uid: currentUser.uid,
                    email: currentUser.email || '',
                    fullName: currentUser.displayName || 'کاربر جدید',
                    phoneNumber: '',
                    role: 'customer', // Default role
                    privacySettings: { showPublicProfile: false, receiveNewsletter: true, shareActivity: false },
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                };
                await setDoc(userDocRef, newProfileData);
                setProfile(newProfileData);
                setTempProfileData({ fullName: newProfileData.fullName, phoneNumber: newProfileData.phoneNumber || '' });
                setPrivacySettings(newProfileData.privacySettings);
                console.log("User profile created in Firestore as it did not exist.");
            }
        } catch (error) {
            console.error("Error fetching/creating user profile:", error);
            setProfile(null); // Reset profile on error
            toast({ title: "خطا", description: "مشکلی در بارگذاری اطلاعات پروفایل شما پیش آمد.", variant: "destructive" });
        }

        // Fetch Addresses
        try {
          const addressesColRef = collection(db, 'users', currentUser.uid, 'addresses');
          const qAddr = query(addressesColRef, orderBy('createdAt', 'desc'));
          const addressSnapshot = await getDocs(qAddr);
          const fetchedAddresses = addressSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Address));
          setAddresses(fetchedAddresses);
        } catch (error) {
          console.error("Error fetching addresses:", error);
          // toast({ title: "خطا", description: "مشکلی در بارگذاری آدرس‌ها پیش آمد.", variant: "destructive" });
        } finally {
          setIsLoadingAddresses(false);
        }

        // Fetch Orders
        setOrdersFetchError(null);
        try {
          const ordersCol = collection(db, 'orders');
          const q = query(ordersCol, where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
          const ordersSnapshot = await getDocs(q);
          const fetchedOrders = ordersSnapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          } as OrderDocument));
          setUserOrders(fetchedOrders);
        } catch (error: any) {
          console.error("Error fetching orders: ", error);
          if (error.message && error.message.includes("indexes?create_composite")) {
              const firestoreConsoleLink = error.message.substring(error.message.indexOf('https://console.firebase.google.com'));
              const errorMessage = (
                  <>
                      ایندکس مورد نیاز برای نمایش سفارش‌ها در پایگاه داده وجود ندارد. لطفاً{' '}
                      <a href={firestoreConsoleLink} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                          با استفاده از این لینک در کنسول Firebase
                      </a>
                      {' '}ایندکس را ایجاد کنید و سپس صفحه را رفرش نمایید.
                  </>
              );
              setOrdersFetchError(errorMessage); 
              toast({ title: "خطای پایگاه داده", description: errorMessage as React.ReactNode, variant: "destructive", duration: 15000 });
          } else {
              const genericError = "مشکلی در بارگذاری سفارش‌ها پیش آمد.";
              setOrdersFetchError(genericError);
              toast({ title: "خطا", description: genericError, variant: "destructive" });
          }
        } finally {
          setIsLoadingOrders(false);
        }

      } else if (!authLoading && !currentUser) {
        setProfile(null);
        setUserOrders([]);
        setAddresses([]);
        setIsLoadingOrders(false);
        setIsLoadingAddresses(false);
      }
    };

    fetchUserProfileAndData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, authLoading, toast]); // toast dependency removed to avoid re-fetch on toast change


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveInfo = async () => {
    if (!currentUser || !profile) {
      toast({ title: "خطا", description: "برای ویرایش اطلاعات باید وارد شده باشید.", variant: "destructive" });
      return;
    }
    
    const userDocRef = doc(db, 'users', currentUser.uid);
    const firestoreUpdates: Partial<UserProfileDocument> = { updatedAt: Timestamp.now() };
    let authProfileNeedsUpdate = false;

    if (tempProfileData.fullName !== (profile.fullName || currentUser.displayName)) {
      firestoreUpdates.fullName = tempProfileData.fullName;
      authProfileNeedsUpdate = true;
    }
    if (tempProfileData.phoneNumber !== profile.phoneNumber) {
      firestoreUpdates.phoneNumber = tempProfileData.phoneNumber;
    }

    try {
      // Update Firebase Auth displayName if changed
      if (authProfileNeedsUpdate && auth.currentUser && auth.currentUser.displayName !== tempProfileData.fullName) {
        await updateFirebaseProfile(auth.currentUser, { displayName: tempProfileData.fullName });
      }
      
      // Update Firestore document
      if (Object.keys(firestoreUpdates).length > 1 || (Object.keys(firestoreUpdates).length === 1 && !('updatedAt' in firestoreUpdates))) { // More than just updatedAt or only updatedAt but with other changes
          await updateDoc(userDocRef, firestoreUpdates);
      }
      
      // Optimistically update local profile state
      setProfile(prev => prev ? ({ 
          ...prev, 
          fullName: firestoreUpdates.fullName ?? prev.fullName, 
          phoneNumber: firestoreUpdates.phoneNumber ?? prev.phoneNumber,
          updatedAt: Timestamp.now() 
        }) : null);

      setIsEditingInfo(false);
      toast({ title: "اطلاعات ذخیره شد", description: "اطلاعات پروفایل شما با موفقیت به‌روزرسانی شد." });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "خطا در ذخیره‌سازی", description: "مشکلی در به‌روزرسانی پروفایل رخ داد.", variant: "destructive" });
    }
  };
  
  const handlePrivacySettingChange = async (key: keyof NonNullable<UserProfileDocument['privacySettings']>, value: boolean) => {
    if (!currentUser || !profile) return;

    const newPrivacySettings = {
      ...(profile.privacySettings || { showPublicProfile: false, receiveNewsletter: true, shareActivity: false }),
      [key]: value,
    };
    
    setIsSavingPrivacy(true);
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, { 
        privacySettings: newPrivacySettings,
        updatedAt: Timestamp.now(),
      });
      setProfile(prev => prev ? ({ ...prev, privacySettings: newPrivacySettings, updatedAt: Timestamp.now() }) : null);
      setPrivacySettings(newPrivacySettings); 
      toast({ title: "تنظیمات ذخیره شد", description: "تنظیمات حریم خصوصی شما به‌روزرسانی شد." });
    } catch (error) {
      console.error("Error saving privacy settings:", error);
      toast({ title: "خطا", description: "مشکلی در ذخیره تنظیمات حریم خصوصی پیش آمد.", variant: "destructive" });
      setPrivacySettings(profile.privacySettings || { showPublicProfile: false, receiveNewsletter: true, shareActivity: false });
    } finally {
      setIsSavingPrivacy(false);
    }
  };


  const handleCancelEdit = () => {
    if (profile) {
        setTempProfileData({ fullName: profile.fullName || currentUser?.displayName || '', phoneNumber: profile.phoneNumber || '' });
    }
    setIsEditingInfo(false);
  };

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(null);
    if (!currentUser || !currentUser.email) {
      setPasswordError("ابتدا باید وارد حساب کاربری خود شوید.");
      return;
    }
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("لطفاً تمام فیلدهای رمز عبور را پر کنید.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("رمز عبور جدید و تکرار آن با هم تطابق ندارند.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("رمز عبور جدید باید حداقل ۶ کاراکتر باشد.");
      return;
    }
    setIsChangingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      toast({ title: "موفقیت", description: "رمز عبور شما با موفقیت تغییر کرد.", variant: "default" });
      setShowChangePasswordForm(false);
      setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
    } catch (error: any) {
      console.error("Error changing password:", error);
      let friendlyMessage = "خطایی در تغییر رمز عبور رخ داد.";
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') friendlyMessage = "رمز عبور فعلی شما نادرست است.";
      else if (error.code === 'auth/weak-password') friendlyMessage = "رمز عبور جدید ضعیف است.";
      else if (error.code === 'auth/too-many-requests') friendlyMessage = "تلاش‌های زیادی برای تغییر رمز عبور انجام شده است.";
      setPasswordError(friendlyMessage);
      toast({ title: "خطا در تغییر رمز عبور", description: friendlyMessage, variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAddressFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenAddAddressDialog = () => {
    setEditingAddress(null);
    setCurrentAddressForm({ recipientName: '', street: '', city: '', postalCode: '', phoneNumber: '' });
    setIsAddressDialogOpen(true);
  };

  const handleOpenEditAddressDialog = (address: Address) => {
    setEditingAddress(address);
    setCurrentAddressForm({
      recipientName: address.recipientName,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      phoneNumber: address.phoneNumber,
    });
    setIsAddressDialogOpen(true);
  };

  const handleSaveAddress = async () => {
    if (!currentUser) {
      toast({ title: "خطا", description: "برای مدیریت آدرس‌ها باید وارد شده باشید.", variant: "destructive" });
      return;
    }
    if (!currentAddressForm.recipientName || !currentAddressForm.street || !currentAddressForm.city || !currentAddressForm.postalCode || !currentAddressForm.phoneNumber) {
      toast({ title: "خطای ورودی", description: "لطفاً تمام فیلدهای آدرس را پر کنید.", variant: "destructive" });
      return;
    }

    const addressesColRef = collection(db, 'users', currentUser.uid, 'addresses');
    
    try {
      let isMakingDefault = addresses.length === 0 || !addresses.some(addr => addr.isDefault);
      if (editingAddress) { // Editing existing address
        const addressRef = doc(db, 'users', currentUser.uid, 'addresses', editingAddress.id);
        await updateDoc(addressRef, { ...currentAddressForm, updatedAt: Timestamp.now() });
        toast({ title: "آدرس به‌روزرسانی شد", description: "تغییرات آدرس شما با موفقیت ذخیره شد." });
      } else { // Adding new address
         // If no addresses exist, or no address is default, make this new one default
        const newAddressData: Omit<Address, 'id'> = { 
            ...currentAddressForm, 
            createdAt: Timestamp.now(), 
            updatedAt: Timestamp.now(),
            isDefault: isMakingDefault 
        };
        const docRef = await addDoc(addressesColRef, newAddressData);
        
        if (isMakingDefault && addresses.length > 0) { // This part seems problematic, if it's new and making default, it's already isDefault=true
            // It should only unset other defaults if this *new* one is made default.
            // This logic should be simpler: if isMakingDefault is true, and there *are* other addresses,
            // then *after* adding the new one, iterate through the *old* addresses and unset their default flag.
            // However, the current newAddressData already sets isDefault based on this logic.
        }
        toast({ title: "آدرس جدید اضافه شد", description: "آدرس جدید شما با موفقیت اضافه شد." });
      }
      
      // Refetch addresses to update the list, including the new/edited one and default status changes
      const q = query(addressesColRef, orderBy('createdAt', 'desc'));
      const addressSnapshot = await getDocs(q);
      const fetchedAddresses = addressSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Address));
      setAddresses(fetchedAddresses); // This will reflect the latest state from Firestore
      
      setIsAddressDialogOpen(false);
    } catch (error) {
      console.error("Error saving address: ", error);
      toast({ title: "خطا در ذخیره آدرس", description: "مشکلی در ذخیره‌سازی آدرس پیش آمد.", variant: "destructive" });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
     if (!currentUser) return;
    try {
      const addressToDelete = addresses.find(addr => addr.id === addressId);
      if (addressToDelete?.isDefault && addresses.length > 1 && !addresses.slice().filter(a => a.id !== addressId).some(a => a.isDefault) ) {
         // If deleting the only default address and other addresses exist, prompt to set another as default first
         // This condition is a bit complex. Simpler: If deleting default, and others exist, one of them must become default.
         toast({ title: "عملیات ناموفق", description: "ابتدا یک آدرس دیگر را به عنوان پیش‌فرض انتخاب کنید، سپس این آدرس را حذف نمایید.", variant: "destructive", duration: 7000});
        return;
      }
      
      await deleteDoc(doc(db, 'users', currentUser.uid, 'addresses', addressId));
      toast({ title: "آدرس حذف شد", description: "آدرس مورد نظر با موفقیت حذف شد." });
      
      let newAddresses = addresses.filter(addr => addr.id !== addressId);
      // If the deleted address was default and there are other addresses left, make the first one default
      if (addressToDelete?.isDefault && newAddresses.length > 0 && !newAddresses.some(addr => addr.isDefault)) {
        const newDefaultAddress = newAddresses[0];
        const addressRef = doc(db, 'users', currentUser.uid, 'addresses', newDefaultAddress.id);
        await updateDoc(addressRef, { isDefault: true, updatedAt: Timestamp.now() });
        newAddresses = newAddresses.map(addr => addr.id === newDefaultAddress.id ? {...addr, isDefault: true} : addr);
      }
      setAddresses(newAddresses);

    } catch (error) {
      console.error("Error deleting address: ", error);
      toast({ title: "خطا در حذف آدرس", description: "مشکلی در حذف آدرس پیش آمد.", variant: "destructive" });
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!currentUser) return;
    const batch = writeBatch(db);
    addresses.forEach(addr => {
      const addressRef = doc(db, 'users', currentUser.uid, 'addresses', addr.id);
      batch.update(addressRef, { isDefault: addr.id === addressId, updatedAt: Timestamp.now() });
    });
    try {
      await batch.commit();
      toast({ title: "آدرس پیش‌فرض تنظیم شد", description: "آدرس مورد نظر به عنوان پیش‌فرض تنظیم شد." });
      setAddresses(prevAddresses => prevAddresses.map(addr => ({...addr, isDefault: addr.id === addressId })));
    } catch (error) {
      console.error("Error setting default address: ", error);
      toast({ title: "خطا", description: "مشکلی در تنظیم آدرس پیش‌فرض پیش آمد.", variant: "destructive" });
    }
  };

  const getOrderStatusBadgeVariant = (status: OrderDocument['status']): "default" | "secondary" | "outline" | "destructive" => {
     switch (status) {
      case 'تحویل داده شده': return "default";
      case 'ارسال شده': return "secondary";
      case 'در حال پردازش': return "outline";
      case 'لغو شده': return "destructive";
      default: return "outline";
    }
  };

  if (authLoading || (!currentUser && profile === null && !authLoading)) { // Updated loading condition
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">در حال بارگذاری اطلاعات کاربر...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentUser && !authLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
          <User className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold mb-2">صفحه پروفایل</h1>
          <p className="text-muted-foreground mb-6">برای مشاهده و مدیریت پروفایل خود، لطفا ابتدا وارد شوید یا ثبت نام کنید.</p>
          <div className="flex gap-4">
            <Button asChild><Link href="/auth/login">ورود</Link></Button>
            <Button variant="outline" asChild><Link href="/auth/signup">ثبت نام</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const formatOrderPrice = (price: number): string => {
    return `${price.toLocaleString('fa-IR')} تومان`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            پروفایل کاربری {profile?.fullName || currentUser?.displayName || ''}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            اطلاعات حساب خود را مدیریت کنید و سفارش‌هایتان را پیگیری نمایید.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-3 space-y-8">
            {/* Personal Info Card */}
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">اطلاعات شخصی</CardTitle>
                </div>
                {!isEditingInfo ? (
                  <Button variant="outline" size="sm" onClick={() => { setIsEditingInfo(true); if(profile) setTempProfileData({fullName: profile.fullName || currentUser?.displayName || '', phoneNumber: profile.phoneNumber || ''})}}>
                    <Edit3 className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> ویرایش
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={handleSaveInfo}>
                      <Save className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> ذخیره
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                      لغو
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                {isEditingInfo ? (
                  <>
                    <div>
                      <Label htmlFor="fullNameEdit">نام و نام خانوادگی</Label>
                      <Input id="fullNameEdit" name="fullName" value={tempProfileData.fullName} onChange={handleInputChange} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="emailEdit">آدرس ایمیل (غیرقابل ویرایش)</Label>
                      <Input id="emailEdit" name="email" type="email" value={profile?.email || currentUser?.email || ''} dir="ltr" className="mt-1" disabled />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumberEdit">شماره تماس</Label>
                      <Input id="phoneNumberEdit" name="phoneNumber" type="tel" value={tempProfileData.phoneNumber} onChange={handleInputChange} dir="ltr" className="mt-1" />
                       <p className="text-xs text-muted-foreground mt-1">این شماره تماس در پایگاه داده (Firestore) ذخیره خواهد شد.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between py-2 border-b border-dashed">
                      <span className="text-sm text-muted-foreground">نام و نام خانوادگی:</span>
                      <span className="font-medium">{profile?.fullName || currentUser?.displayName || "هنوز وارد نشده"}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-dashed">
                      <span className="text-sm text-muted-foreground">آدرس ایمیل:</span>
                      <span className="font-medium dir-ltr">{profile?.email || currentUser?.email || "هنوز وارد نشده"}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">شماره تماس:</span>
                      <span className="font-medium dir-ltr">{profile?.phoneNumber || "ثبت نشده"}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Address Management Card */}
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                 <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">مدیریت آدرس‌ها</CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={handleOpenAddAddressDialog}>
                  <PlusCircle className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> افزودن آدرس جدید
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingAddresses ? (
                  <div className="text-center py-4">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground mt-2">در حال بارگذاری آدرس‌ها...</p>
                  </div>
                ) : addresses.length > 0 ? (
                    <div className="space-y-4">
                        {addresses.map(addr => (
                            <Card key={addr.id} className={`p-4 ${addr.isDefault ? 'border-2 border-primary shadow-md bg-primary/5' : 'shadow-sm'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow">
                                      <div className="flex items-center mb-1"> 
                                        <span className="font-semibold text-foreground">{addr.recipientName}</span>
                                        {addr.isDefault && <Badge variant="secondary" className="mr-2 rtl:ml-2 rtl:mr-0 text-xs bg-primary/20 text-primary border-primary/30">پیش‌فرض</Badge>}
                                      </div>
                                        <p className="text-sm text-muted-foreground">{addr.street}, {addr.city}</p>
                                        <p className="text-sm text-muted-foreground">کدپستی: {addr.postalCode} - تلفن: <span dir="ltr">{addr.phoneNumber}</span></p>
                                    </div>
                                    <div className="flex gap-1 flex-shrink-0">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEditAddressDialog(addr)}>
                                            <Edit3 className="h-4 w-4" />
                                            <span className="sr-only">ویرایش آدرس</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteAddress(addr.id)} >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">حذف آدرس</span>
                                        </Button>
                                    </div>
                                </div>
                                {!addr.isDefault && (
                                    <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-xs text-primary hover:text-primary/80" onClick={() => handleSetDefaultAddress(addr.id)}>
                                        تنظیم به عنوان آدرس پیش‌فرض
                                    </Button>
                                )}
                            </Card>
                        ))}
                    </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">هنوز آدرسی ثبت نکرده‌اید. (آدرس‌ها از Firestore خوانده می‌شوند)</p>
                )}
              </CardContent>
            </Card>

            {/* Order History Card */}
            <Card className="shadow-lg">
              <CardHeader className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">تاریخچه سفارش‌ها</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="text-center py-4">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-2" />
                    <p className="text-muted-foreground">در حال بارگذاری سفارش‌ها...</p>
                  </div>
                ) : ordersFetchError ? (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>خطا در بارگذاری سفارش‌ها</AlertTitle>
                        <AlertDescription>{ordersFetchError}</AlertDescription>
                    </Alert>
                ) : userOrders.length > 0 ? (
                  <div className="relative w-full overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>شناسه سفارش</TableHead>
                          <TableHead className="hidden sm:table-cell">تاریخ</TableHead>
                          <TableHead>مبلغ کل</TableHead>
                          <TableHead>وضعیت</TableHead>
                          <TableHead className="text-left">جزئیات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-xs">{order.paymentDetails?.orderId || order.id}</TableCell>
                            <TableCell className="hidden sm:table-cell">{(order.createdAt as Timestamp)?.toDate().toLocaleDateString('fa-IR') || 'نامشخص'}</TableCell>
                            <TableCell>{formatOrderPrice(order.totalAmount)}</TableCell>
                            <TableCell>
                              <Badge variant={getOrderStatusBadgeVariant(order.status)}
                                className={
                                  order.status === 'تحویل داده شده' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' :
                                  order.status === 'ارسال شده' ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' :
                                  order.status === 'در حال پردازش' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200' :
                                  order.status === 'لغو شده' ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' : ''
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-left">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only sm:not-sr-only sm:ml-1 rtl:sm:mr-1">مشاهده</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">شما تاکنون هیچ سفارشی ثبت نکرده‌اید.</p>
                )}
              </CardContent>
               { !isLoadingOrders && !ordersFetchError && userOrders.length > 0 && (
                <CardFooter>
                    <Alert variant="default" className="w-full bg-muted/40">
                        <Info className="h-4 w-4" />
                        <AlertTitle className="text-xs font-medium">توجه</AlertTitle>
                        <AlertDescription className="text-xs">
                        تاریخچه سفارش‌ها از پایگاه داده Firestore خوانده می‌شود. برای مشاهده سفارشات، ایندکس لازم در Firestore باید ایجاد شده باشد.
                        </AlertDescription>
                    </Alert>
                </CardFooter>
              )}
            </Card>
            
            {/* Account Settings Card */}
            <Card className="shadow-lg">
              <CardHeader className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">تنظیمات حساب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                {!showChangePasswordForm ? (
                  <Button variant="outline" className="w-full justify-start text-base py-3 h-auto" onClick={() => setShowChangePasswordForm(true)}>
                    <Lock className="ml-3 h-5 w-5 rtl:mr-3 rtl:ml-0" /> تغییر رمز عبور
                  </Button>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4 border p-4 rounded-md bg-muted/20">
                    <h3 className="text-lg font-semibold mb-2 text-foreground">تغییر رمز عبور</h3>
                    {passwordError && (
                      <Alert variant="destructive" className="mb-3">
                        <Lock className="h-4 w-4" />
                        <AlertTitle>خطا</AlertTitle>
                        <AlertDescription>{passwordError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2 relative">
                      <Label htmlFor="currentPassword">رمز عبور فعلی</Label>
                      <Input id="currentPassword" type={showCurrentPass ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} dir="ltr" className="pr-10" required />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground" onClick={() => setShowCurrentPass(!showCurrentPass)} aria-label="نمایش/مخفی کردن رمز عبور فعلی">
                        {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="space-y-2 relative">
                      <Label htmlFor="newPassword">رمز عبور جدید</Label>
                      <Input id="newPassword" type={showNewPass ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} dir="ltr" className="pr-10" required />
                       <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground" onClick={() => setShowNewPass(!showNewPass)} aria-label="نمایش/مخفی کردن رمز عبور جدید">
                        {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="space-y-2 relative">
                      <Label htmlFor="confirmNewPassword">تکرار رمز عبور جدید</Label>
                      <Input id="confirmNewPassword" type={showConfirmPass ? "text" : "password"} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} dir="ltr" className="pr-10" required />
                       <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground" onClick={() => setShowConfirmPass(!showConfirmPass)} aria-label="نمایش/مخفی کردن تکرار رمز عبور جدید">
                        {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" disabled={isChangingPassword}>
                        {isChangingPassword ? (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin rtl:mr-2 rtl:ml-0" /> در حال ذخیره...
                          </>
                        ) : (
                          <>
                            <Save className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> ذخیره تغییرات رمز
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => { setShowChangePasswordForm(false); setPasswordError(null); setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword(''); }}>
                        لغو
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
            
            {/* Privacy Settings Card */}
            <Card className="shadow-lg">
                <CardHeader className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">تنظیمات حریم خصوصی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 pt-3">
                    <Alert variant="default" className="mb-5 bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300">
                        <Info className="h-4 w-4 !text-blue-700 dark:!text-blue-300" />
                        <AlertTitle>توجه</AlertTitle>
                        <AlertDescription>
                        تغییرات این بخش در پایگاه داده Firestore برای پروفایل شما ذخیره می‌شود.
                        </AlertDescription>
                    </Alert>
                    
                    <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse p-3 rounded-md hover:bg-muted/20">
                        <div className="flex-1">
                            <Label htmlFor="showPublicProfile" className="font-medium text-base">نمایش پروفایل من به صورت عمومی</Label>
                            <p className="text-xs text-muted-foreground mt-1">در صورت فعال بودن، دیگران می‌توانند بخش‌هایی از پروفایل شما را (در آینده) مشاهده کنند.</p>
                        </div>
                        <Switch
                            id="showPublicProfile"
                            checked={privacySettings?.showPublicProfile || false}
                            onCheckedChange={(checked) => handlePrivacySettingChange('showPublicProfile', checked)}
                            aria-label="نمایش پروفایل عمومی"
                            disabled={isSavingPrivacy}
                            className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-muted/60"
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse p-3 rounded-md hover:bg-muted/20">
                         <div className="flex-1">
                            <Label htmlFor="receiveNewsletter" className="font-medium text-base">دریافت خبرنامه و پیشنهادات ویژه</Label>
                            <p className="text-xs text-muted-foreground mt-1">از طریق ایمیل از آخرین تخفیف‌ها و اخبار ما مطلع شوید.</p>
                        </div>
                        <Switch
                            id="receiveNewsletter"
                            checked={privacySettings?.receiveNewsletter === undefined ? true : privacySettings.receiveNewsletter} // Default to true if undefined
                            onCheckedChange={(checked) => handlePrivacySettingChange('receiveNewsletter', checked)}
                            aria-label="دریافت خبرنامه"
                            disabled={isSavingPrivacy}
                            className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-muted/60"
                        />
                    </div>
                     <Separator />
                    <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse p-3 rounded-md hover:bg-muted/20">
                        <div className="flex-1">
                            <Label htmlFor="shareActivity" className="font-medium text-base">اشتراک‌گذاری فعالیت خرید با شرکای تجاری (نمایشی)</Label>
                            <p className="text-xs text-muted-foreground mt-1">برای دریافت پیشنهادات شخصی‌سازی شده‌تر (این گزینه در حال حاضر عملکرد واقعی ندارد).</p>
                        </div>
                        <Switch
                            id="shareActivity"
                            checked={privacySettings?.shareActivity || false}
                            onCheckedChange={(checked) => handlePrivacySettingChange('shareActivity', checked)}
                            aria-label="اشتراک گذاری فعالیت"
                            disabled={isSavingPrivacy}
                            className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-muted/60"
                        />
                    </div>
                </CardContent>
                 <CardFooter className="pt-4">
                    <p className="text-xs text-muted-foreground">
                       تنظیمات حریم خصوصی شما در پروفایل کاربری‌تان در پایگاه داده ذخیره می‌شود.
                    </p>
                </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[80svh] flex flex-col">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">جزئیات سفارش: {selectedOrder.paymentDetails?.orderId || selectedOrder.id}</DialogTitle>
                <div className="text-sm text-muted-foreground pt-1 flex items-center gap-1 rtl:gap-2">
                    <span>تاریخ ثبت: {(selectedOrder.createdAt as Timestamp)?.toDate().toLocaleDateString('fa-IR') || 'نامشخص'} - وضعیت:</span>
                    <Badge variant={getOrderStatusBadgeVariant(selectedOrder.status)}
                      className={
                        selectedOrder.status === 'تحویل داده شده' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' :
                        selectedOrder.status === 'ارسال شده' ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' :
                        selectedOrder.status === 'در حال پردازش' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200' :
                        selectedOrder.status === 'لغو شده' ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' : ''
                      }
                    >
                      {selectedOrder.status}
                    </Badge>
                </div>
              </DialogHeader>
              <div className="py-4 overflow-y-auto flex-grow pr-2 space-y-3">
                <h4 className="font-semibold mb-2">آیتم‌های سفارش:</h4>
                {selectedOrder.items.map((item: OrderItem, index: number) => (
                  <div key={item.productId + '-' + index} className="flex items-center gap-3 border-b pb-2">
                    {(item.imageUrl && item.imageUrl.trim() !== "" && item.imageUrl !== DEFAULT_ORDER_ITEM_IMAGE_PROFILE) ? (
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image src={item.imageUrl} alt={item.name} layout="fill" objectFit="cover" data-ai-hint={"product"} />
                      </div>
                    ) : (
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center"><ShoppingBag className={ICON_PLACEHOLDER_PROFILE}/></div>
                    )}
                    <div className="flex-grow">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">تعداد: {item.quantity}</p>
                      <p className="text-xs text-muted-foreground">قیمت واحد: {formatOrderPrice(item.price)}</p>
                    </div>
                    <p className="text-sm font-semibold">{ formatOrderPrice(item.price * item.quantity) }</p>
                  </div>
                ))}
                {selectedOrder.shippingAddress && (
                    <div className="pt-3">
                        <h4 className="font-semibold mb-1">آدرس ارسال:</h4>
                        <p className="text-sm text-muted-foreground">{`${selectedOrder.shippingAddress.recipientName}, ${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.city}, کدپستی: ${selectedOrder.shippingAddress.postalCode}`}</p>
                    </div>
                )}
                 {selectedOrder.customerInfo && (
                    <div className="pt-3">
                        <h4 className="font-semibold mb-1">اطلاعات خریدار:</h4>
                        <p className="text-sm text-muted-foreground">نام: {selectedOrder.customerInfo.fullName}</p>
                        <p className="text-sm text-muted-foreground dir-ltr">ایمیل: {selectedOrder.customerInfo.email}</p>
                        <p className="text-sm text-muted-foreground dir-ltr">تلفن: {selectedOrder.customerInfo.phoneNumber}</p>
                    </div>
                )}
                <Separator className="my-3" />
                <div className="flex justify-between items-center font-bold text-md">
                  <span>مبلغ کل سفارش:</span>
                  <span>{formatOrderPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>
              <DialogFooter className="mt-auto pt-4 border-t">
                <DialogClose asChild>
                  <Button type="button" variant="outline">بستن</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Address Dialog */}
       <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}</DialogTitle>
            <div className="text-sm text-muted-foreground pt-1">
              {editingAddress ? 'اطلاعات آدرس خود را ویرایش کنید.' : 'یک آدرس جدید برای ارسال سفارش‌ها وارد کنید.'}
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipientNameDialog" className="text-right col-span-1 rtl:text-left">نام گیرنده</Label>
              <Input id="recipientNameDialog" name="recipientName" value={currentAddressForm.recipientName} onChange={handleAddressFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="streetDialog" className="text-right col-span-1 rtl:text-left">آدرس پستی</Label>
              <Textarea id="streetDialog" name="street" value={currentAddressForm.street} onChange={handleAddressFormChange} className="col-span-3" placeholder="خیابان، کوچه، پلاک، واحد" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cityDialog" className="text-right col-span-1 rtl:text-left">شهر</Label>
              <Input id="cityDialog" name="city" value={currentAddressForm.city} onChange={handleAddressFormChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="postalCodeDialog" className="text-right col-span-1 rtl:text-left">کد پستی</Label>
              <Input id="postalCodeDialog" name="postalCode" value={currentAddressForm.postalCode} onChange={handleAddressFormChange} className="col-span-3" dir="ltr" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="addressPhoneNumberDialog" className="text-right col-span-1 rtl:text-left">شماره تماس</Label>
              <Input id="addressPhoneNumberDialog" name="phoneNumber" value={currentAddressForm.phoneNumber} onChange={handleAddressFormChange} className="col-span-3" dir="ltr" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddressDialogOpen(false)}>لغو</Button>
            <Button type="button" onClick={handleSaveAddress}>ذخیره آدرس</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}

