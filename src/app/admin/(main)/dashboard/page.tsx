
import StatsCard from '@/components/admin/dashboard/stats-card';
import PlaceholderChart from '@/components/admin/dashboard/placeholder-chart';
import { DollarSign, Users, CreditCard, Activity, ShoppingBag, BarChart3, LineChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const recentSalesData = [
  { id: '1', user: 'نیلوفر محمدی', email: 'niloo@example.com', amount: '۲۵۰,۰۰۰ تومان', date: '۲۰ خرداد ۱۴۰۳' },
  { id: '2', user: 'احمد رضایی', email: 'ahmad.r@example.com', amount: '۱۲۰,۰۰۰ تومان', date: '۱۹ خرداد ۱۴۰۳' },
  { id: '3', user: 'سارا کریمی', email: 'sara.k@example.com', amount: '۸۵۰,۰۰۰ تومان', date: '۱۹ خرداد ۱۴۰۳' },
  { id: '4', user: 'محمد اکبری', email: 'mohammad.a@example.com', amount: '۴۵,۰۰۰ تومان', date: '۱۸ خرداد ۱۴۰۳' },
  { id: '5', user: 'فاطمه حسینی', email: 'fateme.h@example.com', amount: '۳۲۰,۰۰۰ تومان', date: '۱۸ خرداد ۱۴۰۳' },
];

const topProductsData = [
  { id: 'prod-001', name: 'مانتو کتان بهاره', sales: 150, revenue: '۲۷,۷۵۰,۰۰۰ تومان' },
  { id: 'prod-002', name: 'شومیز حریر مجلسی', sales: 95, revenue: '۹,۰۲۵,۰۰۰ تومان' },
  { id: 'prod-004', name: 'کیف دوشی چرم', sales: 60, revenue: '۱۳,۸۰۰,۰۰۰ تومان' },
];


export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="مجموع درآمد"
          value="۱۲,۳۵۰,۰۰۰ تومان"
          icon={DollarSign}
          description="۲.۵٪ بیشتر از ماه گذشته"
          trend="up"
        />
        <StatsCard
          title="کاربران جدید"
          value="+۳۵۰"
          icon={Users}
          description="۱۰٪ بیشتر از ماه گذشته"
          trend="up"
        />
        <StatsCard
          title="فروش‌های امروز"
          value="۱۲۵"
          icon={CreditCard}
          description="۵٪ کمتر از دیروز"
          trend="down"
        />
        <StatsCard
          title="محصولات فعال"
          value="۷۸"
          icon={ShoppingBag}
          description="۲ محصول جدید اضافه شد"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              نمودار فروش ماهانه (نمایشی)
            </CardTitle>
            <CardDescription>نمایش روند فروش در ۳۰ روز گذشته.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <PlaceholderChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              فروش بر اساس دسته‌بندی (نمایشی)
            </CardTitle>
             <CardDescription>مقایسه فروش دسته‌بندی‌های مختلف.</CardDescription>
          </CardHeader>
          <CardContent>
            <PlaceholderChart type="bar" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>آخرین فروش‌ها</CardTitle>
             <CardDescription>۵ فروش آخر ثبت شده در سیستم.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>مشتری</TableHead>
                  <TableHead className="hidden sm:table-cell">ایمیل</TableHead>
                  <TableHead className="text-left">مبلغ</TableHead>
                  <TableHead className="hidden md:table-cell text-left">تاریخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSalesData.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                        <div className="font-medium">{sale.user}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{sale.email}</TableCell>
                    <TableCell className="text-left">{sale.amount}</TableCell>
                    <TableCell className="hidden md:table-cell text-left">{sale.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-center">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/orders">مشاهده همه سفارش‌ها</Link>
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>محصولات پرفروش</CardTitle>
            <CardDescription>۳ محصول پرفروش این ماه.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام محصول</TableHead>
                  <TableHead className="text-center">تعداد فروش</TableHead>
                  <TableHead className="text-left">درآمد</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProductsData.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                        <Link href={`/products/${product.id}`} className="font-medium hover:text-primary">{product.name}</Link>
                    </TableCell>
                    <TableCell className="text-center">
                        <Badge variant="secondary">{product.sales}</Badge>
                    </TableCell>
                    <TableCell className="text-left">{product.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             <div className="mt-4 text-center">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/products">مشاهده همه محصولات</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
