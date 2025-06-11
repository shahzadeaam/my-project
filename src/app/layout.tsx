import type {Metadata} from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
import { vazirmatn } from '@/lib/fonts'; // Import Vazirmatn font
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/context/cart-context';
import { AuthProvider } from '@/context/auth-context'; // Import AuthProvider
import { ThemeProvider } from '@/components/common/theme-provider'; // Import ThemeProvider

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'زومجی',
  description: 'فروشگاه اینترنتی مدرن و حرفه‌ای زومجی.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} font-sans antialiased`}> {/* Use Vazirmatn font */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider> {/* Wrap CartProvider and children with AuthProvider */}
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
