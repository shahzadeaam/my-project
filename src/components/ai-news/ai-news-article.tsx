'use client';

import { Calendar, Clock, Eye, Share2, Bookmark, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  readTime: string;
  views: number;
  date: string;
  tags: string[];
  author: string;
  authorImage: string;
}

interface Props {
  article: Article;
}

export default function AINewsArticle({ article }: Props) {
  return (
    <div className="min-h-screen bg-background">
      {/* Article Header */}
      <section className="relative py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">خانه</Link></li>
              <li><span>/</span></li>
              <li><Link href="/ai-news" className="hover:text-primary transition-colors">اخبار</Link></li>
              <li><span>/</span></li>
              <li className="text-foreground">{article.title}</li>
            </ol>
          </nav>

          {/* Article Meta */}
          <div className="flex items-center gap-4 mb-6">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              {article.category}
            </Badge>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {article.views.toLocaleString()} بازدید
              </span>
            </div>
          </div>

          {/* Article Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Article Excerpt */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-8 p-6 bg-card rounded-2xl">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={article.authorImage}
                alt={article.author}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{article.author}</h3>
              <p className="text-sm text-muted-foreground">نویسنده تخصصی هوش مصنوعی</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              اشتراک‌گذاری
            </Button>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              ذخیره
            </Button>
          </div>
        </div>
      </section>

      {/* Article Image */}
      <section className="px-4 md:px-8 lg:px-16 mb-12">
        <div className="max-w-4xl mx-auto">
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="px-4 md:px-8 lg:px-16 mb-16">
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </section>

      {/* Tags */}
      <section className="px-4 md:px-8 lg:px-16 mb-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-4">برچسب‌ها:</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm px-4 py-2">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="px-4 md:px-8 lg:px-16 py-16 bg-gradient-to-t from-background to-background/95">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-foreground">مقالات مرتبط</h2>
            <Link href="/ai-news" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              مشاهده همه مقالات
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "هوش مصنوعی و آینده کار",
                excerpt: "تأثیر AI بر مشاغل آینده و مهارت‌های مورد نیاز",
                image: "/images/ai-news/ai-future-work.jpg",
                readTime: "۴ دقیقه",
                date: "۱ هفته پیش"
              },
              {
                title: "خلاقیت و هوش مصنوعی",
                excerpt: "چگونه AI در حال تغییر صنایع خلاقانه است",
                image: "/images/ai-news/ai-creativity.jpg",
                readTime: "۶ دقیقه",
                date: "۱ هفته پیش"
              },
              {
                title: "هوش مصنوعی در خودروهای خودران",
                excerpt: "پیشرفت‌ها و چالش‌های تکنولوژی خودروهای خودران",
                image: "/images/ai-news/ai-news-main.jpg",
                readTime: "۷ دقیقه",
                date: "۲ هفته پیش"
              }
            ].map((relatedArticle, index) => (
              <article key={index} className="group cursor-pointer">
                <Link href="/ai-news/1">
                  <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{relatedArticle.date}</span>
                        <span>{relatedArticle.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 