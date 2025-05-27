
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Send } from 'lucide-react'; // Using Send for Telegram as placeholder
import Logo from '@/components/common/logo';
import { Separator } from '@/components/ui/separator'; // اطمینان از وارد کردن Separator

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: 'خانه', href: '/' },
    { label: 'محصولات', href: '/products' },
    { label: 'درباره ما', href: '/about' },
    { label: 'تماس با ما', href: '/contact' },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'اینستاگرام زومجی' },
    { icon: Send, href: '#', label: 'تلگرام زومجی' }, // Using Send for Telegram
    { icon: Twitter, href: '#', label: 'توییتر زومجی' },
    { icon: Facebook, href: '#', label: 'فیسبوک زومجی' },
  ];

  return (
    <footer className="py-10 md:py-16 border-t border-border/40 bg-muted/30 text-muted-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8 text-center md:text-right">
          {/* About Section */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex justify-center md:justify-start mb-4">
                <Logo />
            </div>
            <p className="text-sm leading-relaxed">
              زومجی، مقصد شما برای جدیدترین و با کیفیت‌ترین پوشاک و اکسسوری. ما به ارائه تجربه‌ای لذت‌بخش از خرید آنلاین متعهد هستیم.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground mb-3">لینک‌های مفید</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground mb-3">تماس با ما</h3>
            <address className="not-italic space-y-2 text-sm">
              <p>تهران، خیابان اصلی، کوچه فرعی، پلاک ۱۰ (نمایشی)</p>
              <p>ایمیل: <a href="mailto:info@zoomg.com" className="hover:text-primary transition-colors">info@zoomg.com</a> (نمایشی)</p>
              <p>تلفن: <a href="tel:02112345678" className="hover:text-primary transition-colors">۰۲۱-۱۲۳۴۵۶۷۸</a> (نمایشی)</p>
            </address>
          </div>

          {/* Social Media Section */}
          <div className="space-y-3 md:col-span-3 lg:col-span-1">
            <h3 className="text-lg font-semibold text-foreground mb-3">ما را دنبال کنید</h3>
            <div className="flex justify-center md:justify-start space-x-3 space-x-reverse">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
            {/* Newsletter Subscription (Optional - Placeholder) */}
            {/* <div className="mt-6">
              <h4 className="text-md font-semibold text-foreground mb-2">خبرنامه</h4>
              <form className="flex flex-col sm:flex-row gap-2">
                <Input type="email" placeholder="ایمیل خود را وارد کنید" className="flex-grow bg-background text-sm h-10" dir="ltr" />
                <Button type="submit" variant="outline" className="text-sm h-10">عضویت</Button>
              </form>
            </div> */}
          </div>
        </div>

        <Separator className="my-8 bg-border/60" />

        <div className="text-center">
          <p className="text-sm">
            &copy; {currentYear} زومجی. تمامی حقوق محفوظ است.
          </p>
          <p className="text-xs mt-1">
            طراحی و توسعه با ❤️ (این یک نمونه اولیه است)
          </p>
        </div>
      </div>
    </footer>
  );
}
