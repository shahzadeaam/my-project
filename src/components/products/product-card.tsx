
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package } from 'lucide-react'; // Import Package icon

interface ProductCardProps {
  id: string;
  name: string;
  price: string; // Price is already formatted as string for display
  imageUrl?: string; 
  imageHint?: string;
}

const DEFAULT_PLACEHOLDER_IMAGE = "https://placehold.co/400x500.png"; // Default for when imageUrl is empty but we still want a placeholder
const ICON_PLACEHOLDER_SIZE = "w-16 h-16 text-muted-foreground"; // Size for Package icon

export default function ProductCard({ id, name, price, imageUrl, imageHint = "fashion item" }: ProductCardProps) {
  const displayImageUrl = imageUrl && imageUrl.trim() !== "" ? imageUrl : ""; // Use empty string if no valid imageUrl
  // data-ai-hint will use provided imageHint or a default. If imageUrl is empty, specific hint for placeholder can be set.
  const displayImageHint = displayImageUrl ? (imageHint || "product image") : "no image placeholder";

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full rounded-lg">
      <CardHeader className="p-0">
        <Link href={`/products/${id}`} aria-label={`View details for ${name}`}>
          <div className="aspect-[4/5] relative w-full overflow-hidden bg-muted flex items-center justify-center"> {/* Changed aspect ratio and added centering for icon */}
            {displayImageUrl ? (
              <Image
                src={displayImageUrl}
                alt={name}
                layout="fill"
                objectFit="cover"
                className="hover:scale-105 transition-transform duration-300"
                data-ai-hint={displayImageHint}
                onError={(e) => { e.currentTarget.src = DEFAULT_PLACEHOLDER_IMAGE; e.currentTarget.setAttribute('data-ai-hint', 'image error placeholder'); }}
              />
            ) : (
              <Package className={ICON_PLACEHOLDER_SIZE} data-ai-hint="product icon placeholder" />
            )}
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
