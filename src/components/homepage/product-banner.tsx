import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProductBanner() {
  return (
    <section className="relative w-full h-[calc(100vh-10rem)] min-h-[300px] md:h-[500px] flex items-center justify-center overflow-hidden">
      <Image
        src="https://placehold.co/1600x600.png"
        alt="بنر تبلیغاتی نمایش محصولات زومجی"
        layout="fill"
        objectFit="cover"
        className="brightness-75"
        priority
        data-ai-hint="fashion store"
      />
      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-lg">
          جدیدترین مجموعه‌ها را کشف کنید
        </h1>
        <p className="mt-4 max-w-xl text-lg text-neutral-200 sm:text-xl drop-shadow-md">
          استایل خود را با جدیدترین ترندهای مد ارتقا دهید.
        </p>
        <Link href="/products" passHref legacyBehavior>
          <Button size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg px-10 py-6 text-lg">
            خرید کن
          </Button>
        </Link>
      </div>
    </section>
  );
}
