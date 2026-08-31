export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: 'clothes' | 'sleepwear' | 'nursery' | 'essentials' | 'gift-sets';
  department: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  isNew?: boolean;
  isBestSeller?: boolean;
  isAmazonChoice?: boolean;
  isDealOfDay?: boolean;
  inStock: boolean;
  stockCount: number;
  deliveryDays: number;
  estimatedDelivery: string;
  tagline: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  material: string;
  softnessScore: number;
  colors: {
    name: string;
    hex: string;
    image?: string;
  }[];
  sizes: string[];
  images: string[];
  modelType: 'romper' | 'teddy' | 'swaddle' | 'booties' | 'quilt' | 'teether';
  customizable?: boolean;
  frequentlyBoughtWith?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'clothes' | 'nursery' | 'milestones' | 'atelier';
  image: string;
  caption: string;
  photographer: string;
  location?: string;
  tags: string[];
  likes: number;
  verifiedPurchase?: boolean;
  featuredStory?: string;
}

export interface Review {
  id: string;
  author: string;
  verified: boolean;
  title?: string;
  rating: number;
  date: string;
  babyName?: string;
  babyAge?: string;
  variantPurchased?: string;
  comment: string;
  helpfulCount?: number;
  hearts?: number;
  avatar: string;
  productName?: string;
  photos?: string[];
}

export interface CustomEmbroidery {
  babyName: string;
  fontStyle: 'cursive' | 'modern' | 'whimsical' | 'classic' | 'monogram';
  threadColor: string;
  threadColorName: string;
  icon: 'teddy' | 'star' | 'cloud' | 'heart' | 'crown' | 'none';
  position: 'chest-left' | 'center' | 'cuff' | 'pocket';
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: {
    name: string;
    hex: string;
  };
  selectedSize: string;
  quantity: number;
  customEmbroidery?: CustomEmbroidery;
  giftWrap?: boolean;
}
