'use client';

import { useState } from 'react';
import { Search, Filter, Calendar, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for AI news articles
const aiNewsArticles = [
  {
    id: 1,
    title: "پیشرفت‌های جدید در هوش مصنوعی: GPT-5 و آینده یادگیری ماشین",
    excerpt: "در ماه‌های اخیر، پیشرفت‌های چشمگیری در زمینه هوش مصنوعی و یادگیری ماشین مشاهده شده است. از توسعه مدل‌های زبانی پیشرفته گرفته تا کاربردهای عملی در صنایع مختلف، هوش مصنوعی در حال تغییر نحوه زندگی و کار ماست.",
    content: "مقاله کامل درباره پیشرفت‌های جدید در هوش مصنوعی...",
    image: "/images/ai-news/ai-news-main.jpg",
    category: "یادگیری ماشین",
    readTime: "۵ دقیقه",
    views: 1247,
    date: "۲ روز پیش",
    tags: ["GPT-5", "یادگیری ماشین", "هوش مصنوعی"]
  },
  {
    id: 2,
    title: "کاربردهای هوش مصنوعی در پزشکی و تشخیص بیماری‌ها",
    excerpt: "هوش مصنوعی در حال انقلابی در صنعت پزشکی است. از تشخیص دقیق‌تر بیماری‌ها تا توسعه داروهای شخصی‌سازی شده، AI در حال تغییر نحوه درمان بیماران است.",
    content: "مقاله کامل درباره کاربردهای هوش مصنوعی در پزشکی...",
    image: "/images/ai-news/ai-medicine.jpg",
    category: "پزشکی",
    readTime: "۳ دقیقه",
    views: 892,
    date: "۳ روز پیش",
    tags: ["پزشکی", "تشخیص بیماری", "هوش مصنوعی"]
  },
  {
    id: 3,
    title: "هوش مصنوعی و آینده کار: مهارت‌های مورد نیاز در عصر AI",
    excerpt: "با پیشرفت هوش مصنوعی، مشاغل آینده نیاز به مهارت‌های جدیدی خواهند داشت. در این مقاله به بررسی تأثیر AI بر بازار کار می‌پردازیم.",
    content: "مقاله کامل درباره آینده کار و هوش مصنوعی...",
    image: "/images/ai-news/ai-future-work.jpg",
    category: "آینده کار",
    readTime: "۴ دقیقه",
    views: 1567,
    date: "۱ هفته پیش",
    tags: ["آینده کار", "مهارت‌ها", "هوش مصنوعی"]
  },
  {
    id: 4,
    title: "خلاقیت و هوش مصنوعی: چگونه AI در حال تغییر صنایع خلاقانه است",
    excerpt: "هوش مصنوعی در حال تغییر نحوه خلق آثار هنری، موسیقی و محتوا است. از تولید تصاویر تا نوشتن داستان، AI در حال بازتعریف خلاقیت است.",
    content: "مقاله کامل درباره خلاقیت و هوش مصنوعی...",
    image: "/images/ai-news/ai-creativity.jpg",
    category: "خلاقیت",
    readTime: "۶ دقیقه",
    views: 2034,
    date: "۱ هفته پیش",
    tags: ["خلاقیت", "هنر", "هوش مصنوعی"]
  },
  {
    id: 5,
    title: "هوش مصنوعی در خودروهای خودران: پیشرفت‌ها و چالش‌ها",
    excerpt: "تکنولوژی خودروهای خودران با کمک هوش مصنوعی در حال پیشرفت سریع است. در این مقاله به بررسی آخرین پیشرفت‌ها و چالش‌های پیش رو می‌پردازیم.",
    content: "مقاله کامل درباره خودروهای خودران و هوش مصنوعی...",
    image: "/images/ai-news/ai-car.jpg",
    category: "خودرو",
    readTime: "۷ دقیقه",
    views: 1789,
    date: "۲ هفته پیش",
    tags: ["خودروهای خودران", "هوش مصنوعی", "تکنولوژی"]
  },
  {
    id: 6,
    title: "هوش مصنوعی در آموزش: شخصی‌سازی یادگیری",
    excerpt: "AI در حال تغییر نحوه آموزش و یادگیری است. از برنامه‌های درسی شخصی‌سازی شده تا دستیارهای آموزشی هوشمند، آینده آموزش در دست هوش مصنوعی است.",
    content: "مقاله کامل درباره هوش مصنوعی در آموزش...",
    image: "/images/ai-news/ai-education.jpg",
    category: "آموزش",
    readTime: "۴ دقیقه",
    views: 1345,
    date: "۲ هفته پیش",
    tags: ["آموزش", "یادگیری", "هوش مصنوعی"]
  }
];

const categories = [
  "همه",
  "یادگیری ماشین",
  "پزشکی",
  "آینده کار",
  "خلاقیت",
  "خودرو",
  "آموزش"
];

export default function AINewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [sortBy, setSortBy] = useState('newest');

  // Filter articles based on search and category
  const filteredArticles = aiNewsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'همه' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'popular') {
      return b.views - a.views;
    } else if (sortBy === 'readTime') {
      return parseInt(a.readTime) - parseInt(b.readTime);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            اخبار هوش مصنوعی
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            از جدیدترین پیشرفت‌ها و نوآوری‌های دنیای هوش مصنوعی مطلع شوید
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="جستجو در اخبار هوش مصنوعی..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg bg-background/80 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/40"
            />
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4 ml-auto">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-border rounded-lg px-4 py-2 text-foreground"
              >
                <option value="newest">جدیدترین</option>
                <option value="popular">محبوب‌ترین</option>
                <option value="readTime">کوتاه‌ترین</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-muted-foreground">
              {sortedArticles.length} مقاله یافت شد
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedArticles.map((article) => (
              <article key={article.id} className="group cursor-pointer">
                <Link href={`/ai-news/${article.id}`}>
                  <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    {/* Article Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                          {article.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>

                      {/* Article Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {article.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views.toLocaleString()}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-4">
                        {article.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          {sortedArticles.length > 0 && (
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="px-8 py-3">
                بارگذاری مقالات بیشتر
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 