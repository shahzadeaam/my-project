import { Metadata } from 'next';
import AINewsPage from '@/components/ai-news/ai-news-page';

export const metadata: Metadata = {
  title: 'اخبار هوش مصنوعی | زومجی',
  description: 'آخرین اخبار و مقالات مربوط به هوش مصنوعی، یادگیری ماشین و فناوری‌های نوین',
  keywords: 'هوش مصنوعی, AI, اخبار تکنولوژی, یادگیری ماشین, فناوری',
};

export default function NewsPage() {
  return <AINewsPage />;
} 