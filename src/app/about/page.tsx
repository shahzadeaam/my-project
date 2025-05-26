
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'درباره ما - نیلوفر بوتیک',
  description: 'با داستان، اهداف و تیم نیلوفر بوتیک بیشتر آشنا شوید.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              درباره نیلوفر بوتیک
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-10 pt-6 pb-10 px-4 md:px-8">
            <section className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-4">داستان ما</h2>
                <p className="text-muted-foreground leading-relaxed text-justify">
                  نیلوفر بوتیک در سال ۱۴۰۲ با یک ایده ساده اما پرشور آغاز به کار کرد: ارائه جدیدترین و باکیفیت‌ترین پوشاک زنانه با قیمت‌های مناسب و تجربه‌ای خرید آنلاین لذت‌بخش. ما باور داریم که هر زنی شایسته بهترین‌هاست و مد نباید محدود به قشر خاصی باشد. از روز اول، تمرکز ما بر انتخاب دقیق محصولات، کیفیت دوخت، و ارائه خدمات مشتریان بی‌نظیر بوده است.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4 text-justify">
                  تیم ما متشکل از افراد علاقه‌مند به مد و فناوری است که با اشتیاق فراوان تلاش می‌کنند تا بهترین‌ها را برای شما به ارمغان بیاورند. ما به طور مداوم در حال بررسی ترندهای روز دنیا و انتخاب محصولاتی هستیم که نه تنها زیبا و به‌روز باشند، بلکه از کیفیت بالایی نیز برخوردار باشند.
                </p>
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg mx-auto max-w-md w-full md:max-w-full">
                <Image
                  src="https://placehold.co/600x450.png"
                  alt="تیم نیلوفر بوتیک مشغول کار"
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="fashion team"
                  className="rounded-lg"
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-6 text-center">ماموریت و ارزش‌های ما</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-muted/40 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-medium text-foreground mb-2">کیفیت برتر</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    تعهد ما به ارائه محصولاتی با بالاترین استاندارد کیفیت در پارچه، دوخت و طراحی است.
                  </p>
                </div>
                <div className="p-6 bg-muted/40 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-medium text-foreground mb-2">رضایت مشتری</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    اولویت اول و آخر ما، رضایت شماست؛ از لحظه ورود به سایت تا دریافت و استفاده از سفارش.
                  </p>
                </div>
                <div className="p-6 bg-muted/40 rounded-xl shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                  <h3 className="text-xl font-medium text-foreground mb-2">مد برای همه</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    باور داریم که زیبایی و مد باید برای همه افراد با هر سلیقه و بودجه‌ای در دسترس باشد.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="grid md:grid-cols-2 gap-8 items-center pt-6">
                 <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg mx-auto max-w-md w-full md:max-w-full order-last md:order-first">
                    <Image
                    src="https://placehold.co/600x450.png"
                    alt="فضای داخلی فروشگاه نیلوفر بوتیک"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="boutique interior"
                    className="rounded-lg"
                    />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-4">چشم‌انداز ما</h2>
                <p className="text-muted-foreground leading-relaxed text-justify">
                  ما در نیلوفر بوتیک به دنبال آن هستیم که به یکی از برترین و معتبرترین فروشگاه‌های آنلاین پوشاک زنانه در ایران تبدیل شویم. چشم‌انداز ما ایجاد فضایی است که در آن هر بانوی ایرانی بتواند با اطمینان خاطر، جدیدترین و باکیفیت‌ترین محصولات مد روز را تهیه کند و از تجربه‌ای خرید آسان، سریع و مطمئن لذت ببرد. ما می‌خواهیم نه تنها فروشنده پوشاک، بلکه همراه و مشاور شما در دنیای مد باشیم.
                </p>
              </div>
            </section>

             <section className="text-center mt-8">
                <h2 className="text-2xl font-semibold text-primary mb-3">همراه ما باشید</h2>
                <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                ما در نیلوفر بوتیک مشتاقانه منتظر همراهی شما در این سفر مد و زیبایی هستیم. از اینکه ما را انتخاب کرده‌اید سپاسگزاریم و امیدواریم تجربه خریدی خوشایند و به یاد ماندنی برایتان رقم بزنیم. نظرات و پیشنهادات شما همواره برای ما ارزشمند خواهد بود.
                </p>
             </section>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
