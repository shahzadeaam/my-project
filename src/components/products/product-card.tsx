
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// No direct Product import needed here if props are explicit

interface ProductCardProps {
  id: string;
  name: string;
  price: string; // Price is already formatted as string for display
  imageUrl: string;
  imageHint?: string;
}

export default function ProductCard({ id, name, price, imageUrl, imageHint = "fashion item" }: ProductCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full rounded-lg">
      <CardHeader className="p-0">
        <Link href={`/products/${id}`} aria-label={`View details for ${name}`}>
          <div className="aspect-square relative w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="hover:scale-105 transition-transform duration-300"
              data-ai-hint={imageHint}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1 truncate" title={name}>
          <Link href={`/products/${id}`} className="hover:text-primary transition-colors">
            {name}
          </Link>
        </CardTitle>
        <p className="text-base text-muted-foreground font-medium">{price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/products/${id}?action=buy`} passHref className="w-full">
          <Button variant="outline" className="w-full">
            مشاهده محصول
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
