import { Product } from '../types';

export const products: Product[] = [
  // 1. 2-PC GIRLS COMBO TOPS
  {
    id: 'tinkle-comfy-girls-2pc-combo',
    sku: 'VK-TOP-001',
    name: 'Tinkle Comfy Girls Graphic Tops (2 PC Combo - Pink & Sky Blue with Side Drawstrings)',
    brand: 'Cozy Cuddle by Vikas Kumar',
    category: 'clothes',
    department: 'Girls Tops & Combos',
    price: 799,
    originalPrice: 1499,
    discountPercent: 47,
    rating: 4.8,
    reviewsCount: 1840,
    ratingBreakdown: { 5: 86, 4: 10, 3: 3, 2: 1, 1: 0 },
    isBestSeller: true,
    isAmazonChoice: true,
    isDealOfDay: true,
    inStock: true,
    stockCount: 24,
    deliveryDays: 1,
    estimatedDelivery: 'FREE delivery Tomorrow by 10 PM across India',
    tagline: 'Best Seller 2-Pack Value Combo: Breathable Fabric & Adjustable Ruched Hem',
    description: 'Set of 2 adorable short-sleeve girls tops crafted with premium soft breathable cotton blend. Features stylish floral girl graphics and adjustable side drawstrings with ruched side ties for a comfortable custom fit.',
    features: [
      '2 PC Value Pack: Includes 1 Pastel Pink + 1 Sky Blue Top',
      'Adjustable side drawstrings with functional ruched bow ties',
      'Cute floral art print with durable non-cracking HD ink',
      'Ultra-soft 95% combed cotton, 5% spandex for 4-way stretch',
      'Pre-shrunk, skin-friendly, and color-fast after repeated machine washes'
    ],
    specifications: {
      'Combo Pack': '2 Pieces (Pink & Sky Blue)',
      'Fabric Composition': '95% Combed Cotton, 5% Elastane Stretch',
      'Sleeve Length': 'Short Sleeves',
      'Neckline': 'Ribbed Round Neck',
      'Fit Style': 'Regular Fit with Ruched Side Drawstrings',
      'Origin': 'Artisan Handcrafted at Vikas Kumar Atelier',
      'Care': 'Machine wash cold inside out, tumble dry gentle'
    },
    material: 'Premium 95% Combed Cotton + 5% Spandex (220 GSM)',
    softnessScore: 9.8,
    colors: [
      { name: 'Pink & Sky Blue Combo', hex: '#FFB6C1' },
      { name: 'Black & Blue Combo', hex: '#333333' }
    ],
    sizes: ['3-4 Years', '5-6 Years', '7-8 Years', '9-10 Years', '11-12 Years', '13-14 Years'],
    images: [
      '/images/products/tinkle-girls-combo-top.png',
      '/images/products/tinkle-trendy-girls-top.png'
    ],
    modelType: 'romper',
    customizable: true,
    frequentlyBoughtWith: ['princess-stylish-girls-sweater', 'boston-91-retro-tshirt']
  },

  // 2. PRINCESS STYLISH GIRLS BLACK TURTLENECK SWEATER
  {
    id: 'princess-stylish-girls-sweater',
    sku: 'VK-SWT-002',
    name: 'Princess Stylish Girls High Neck Full Sleeve Turtleneck Sweater (Midnight Black)',
    brand: 'Cozy Cuddle by Vikas Kumar',
    category: 'clothes',
    department: 'Kids Turtlenecks & Sweaters',
    price: 699,
    originalPrice: 1299,
    discountPercent: 46,
    rating: 4.9,
    reviewsCount: 2150,
    ratingBreakdown: { 5: 89, 4: 8, 3: 2, 2: 1, 1: 0 },
    isBestSeller: true,
    isAmazonChoice: true,
    inStock: true,
    stockCount: 30,
    deliveryDays: 1,
    estimatedDelivery: 'FREE delivery Tomorrow by 10 PM across India',
    tagline: 'Timeless High-Neck Winter Layering Essential for Girls & Teens',
    description: 'A classic wardrobe staple hand-finished at Vikas Kumar Atelier. Crafted from non-itch thermal ribbed acrylic-cotton knit that retains gentle body warmth while providing a sleek, sophisticated silhouette for school, casual outings, or formal parties.',
    features: [
      'Cozy double-layer foldover turtleneck collar keeps neck comfortably warm',
      'Ribbed cuffs and hem provide a snug fit that stays in place',
      '100% itch-free ultra-fine yarn gentle on delicate skin',
      'Versatile aesthetic pairs effortlessly with jeans, skirts, or overalls',
      'Wrinkle-resistant and retains its rich jet-black color wash after wash'
    ],
    specifications: {
      'Style': 'High Neck Folded Turtleneck',
      'Sleeve': 'Full Length Sleeve with Elasticated Rib Cuffs',
      'Yarn Type': 'Soft-Touch Cotton-Acrylic Thermal Blend',
      'Pattern': 'Fine Ribbed Solid Knit',
      'Weight': '240 Grams',
      'Manufacture': 'Vikas Kumar Knitting Studios'
    },
    material: 'Thermal Ribbed Cotton-Acrylic Soft Blend',
    softnessScore: 9.7,
    colors: [
      { name: 'Midnight Black', hex: '#111111' },
      { name: 'Snow White', hex: '#FFFFFF' },
      { name: 'Warm Cream', hex: '#F5EBE0' }
    ],
    sizes: ['4-5 Years', '6-7 Years', '8-9 Years', '10-11 Years', '12-13 Years', '14-16 Years (Teens)'],
    images: [
      '/images/products/princess-girls-turtleneck.png',
      '/images/products/cutiepie-classy-hanger.png'
    ],
    modelType: 'romper',
    customizable: true,
    frequentlyBoughtWith: ['tinkle-comfy-girls-2pc-combo', 'cutiepie-fancy-girls-sweater']
  },

  // 3. WOMEN STYLISH SPORTS & ACTIVE GYM T-SHIRT (CHARCOAL GREY)
  {
    id: 'women-sports-active-tshirt',
    sku: 'VK-GYM-003',
    name: 'Stylish Women Sports & Active Gym T-Shirt (Moisture-Wicking Quick-Dry Charcoal Grey)',
    brand: 'Cozy Cuddle by Vikas Kumar',
    category: 'clothes',
    department: 'Women Gym & Activewear',
    price: 849,
    originalPrice: 1599,
    discountPercent: 47,
    rating: 4.85,
    reviewsCount: 1620,
    ratingBreakdown: { 5: 84, 4: 11, 3: 3, 2: 1, 1: 1 },
    isBestSeller: true,
    inStock: true,
    stockCount: 18,
    deliveryDays: 1,
    estimatedDelivery: 'FREE delivery Tomorrow by 10 PM',
    tagline: 'Engineered for High-Intensity Training, Running & Gym Workouts',
    description: 'Precision-tailored athletic performance tee engineered with ultra-lightweight Dri-Fit micro-mesh technology. Offers maximum breathability, 4-way ergonomic stretch, and anti-odor antimicrobial finish for peak fitness performance.',
    features: [
      'Advanced Dri-Fit breathable micro-weave draws sweat instantly away from skin',
      'Ergonomic contrast side contour panels accentuate an athletic silhouette',
      'Chafe-free flatlock seams prevent skin friction during high-movement workouts',
      'Reflective minimalist logo for safe low-light evening runs',
      'Featherweight 160 GSM performance fabric with natural 4-way flexibility'
    ],
    specifications: {
      'Fabric Technology': 'Hydrophobic Micro-Poly + Spandex Dri-Fit',
      'Activity': 'Gym, Crossfit, Running, Pilates, Yoga, Athleisure',
      'Seam Style': 'Flatlock Anti-Chafing Stitching',
      'Weight': '160 Grams (Ultralight)'
    },
    material: '88% Poly-DriFit Micro-Mesh, 12% Spandex (160 GSM)',
    softnessScore: 9.5,
    colors: [
      { name: 'Heather Charcoal Grey', hex: '#5A626A' },
      { name: 'Stealth Jet Black', hex: '#1C1C1E' },
      { name: 'Cobalt Blue', hex: '#1E3A8A' }
    ],
    sizes: ['XS (32)', 'S (34)', 'M (36)', 'L (38)', 'XL (40)', 'XXL (42)'],
    images: [
      '/images/products/women-sports-active-grey.png',
      '/images/products/women-gym-black-top.png'
    ],
    modelType: 'romper',
    customizable: false,
    frequentlyBoughtWith: ['stylus-women-sports-duo-combo', 'boston-91-retro-tshirt']
  },

  // 4. BOSTON 91 RETRO GRAPHIC OVERSIZED T-SHIRT (COBALT BLUE)
  {
    id: 'boston-91-retro-tshirt',
    sku: 'VK-STR-004',
    name: 'Boston 91 Retro Star Graphic Oversized Boyfriend T-Shirt (Cobalt Royal Blue)',
    brand: 'Cozy Cuddle by Vikas Kumar',
    category: 'clothes',
    department: 'Boston 91 Graphic Streetwear',
    price: 899,
    originalPrice: 1699,
    discountPercent: 47,
    rating: 4.95,
    reviewsCount: 2890,
    ratingBreakdown: { 5: 92, 4: 6, 3: 2, 2: 0, 1: 0 },
    isBestSeller: true,
    isAmazonChoice: true,
    isDealOfDay: true,
    inStock: true,
    stockCount: 22,
    deliveryDays: 1,
    estimatedDelivery: 'FREE delivery Tomorrow by 10 PM',
    tagline: '#1 Trending Streetwear Drop: Premium 240 GSM Heavyweight French Terry Cotton',
    description: 'The viral streetwear sensation! Designed with a relaxed drop-shoulder oversized boxy silhouette, featuring vintage distressed "BOSTON 91" college typography with star accents on the sleeves. Perfect for effortless casual street style.',
    features: [
      '240 GSM Luxury Heavyweight Combed Cotton with velvety soft hand-feel',
      'Oversized drop-shoulder aesthetic for relaxed streetwear layering',
      'High-definition distressed vintage screen-print that never fades or peels',
      'Sturdy 1.25-inch thick ribbed collar that never sags over time',
      'Pairs with cycling shorts, denim, cargo joggers, or layered under jackets'
    ],
    specifications: {
      'Fabric': '100% Super-Combed French Terry Cotton (240 GSM)',
      'Fit': 'Oversized Boxy Boyfriend Fit with Drop Shoulders',
      'Graphics': 'Vintage Boston 91 Distressed Typography + Sleeve Stars',
      'Collar': 'Reinforced Thick Lycra-Ribbed Crewneck'
    },
    material: '100% Luxury French Terry Heavyweight Cotton (240 GSM)',
    softnessScore: 9.9,
    colors: [
      { name: 'Cobalt Royal Blue', hex: '#1D4ED8' },
      { name: 'Midnight Charcoal Black', hex: '#18181B' },
      { name: 'Chalk White', hex: '#F8FAFC' }
    ],
    sizes: ['S (Bust 38)', 'M (Bust 40)', 'L (Bust 42)', 'XL (Bust 44)', 'XXL (Bust 46)'],
    images: [
      '/images/products/boston-91-blue-streetwear.png',
      '/images/products/boston-91-blue-cafe.png'
    ],
    modelType: 'romper',
    customizable: true,
    frequentlyBoughtWith: ['boston-91-duo-streetwear-combo', 'tinkle-comfy-girls-2pc-combo']
  },

  // 5. STYLUS WOMEN PERFORMANCE DUO SPORTS COMBO (2-PACK: BLACK & GREY)
  {
    id: 'stylus-women-sports-duo-combo',
    sku: 'VK-GYM-005',
    name: 'Stylus Women Gym Activewear Duo Combo Set (2-Piece Pack: Jet Black + Heather Grey)',
    brand: 'Cozy Cuddle by Vikas Kumar',
    category: 'clothes',
    department: 'Value Combos (2-Pack)',
    price: 1399,
    originalPrice: 2699,
    discountPercent: 48,
    rating: 4.92,
    reviewsCount: 1430,
    ratingBreakdown: { 5: 88, 4: 9, 3: 2, 2: 1, 1: 0 },
    isBestSeller: true,
    isDealOfDay: true,
    inStock: true,
    stockCount: 15,
    deliveryDays: 1,
    estimatedDelivery: 'FREE delivery Tomorrow by 10 PM',
    tagline: 'Best Value Workout Pack: 2 High-Performance Quick-Dry Athletic Tees',
    description: 'Super value 2-pack including one Jet Black and one Heather Grey workout t-shirt. Engineered with body-mapped ventilation zones and flexible 4-way stretch to keep you dry and confident throughout demanding fitness sessions.',
    features: [
      'Includes 2 Performance T-Shirts (1 Jet Black + 1 Heather Grey)',
      'Moisture-transport system speeds evaporation to keep you cool',
      'Anti-static, anti-odor antibacterial finish stays fresh all day',
      'Non-restrictive ergonomic raglan cut for 360-degree shoulder mobility'
    ],
    specifications: {
      'Pack Contents': '2 Gym Athletic Tees (Black + Grey)',
      'Fabric': '90% Performance Micro-Polyester, 10% Lycra',
      'Fit': 'Athletic Slim Fit with Contoured Side Panels'
    },
    material: 'Quick-Dry Breathable Micro-Poly Performance Fabric',
    softnessScore: 9.6,
    colors: [
      { name: 'Black & Grey Duo Pack', hex: '#2B2D42' }
    ],
    sizes: ['S (34)', 'M (36)', 'L (38)', 'XL (40)', 'XXL (42)'],
    images: [
      '/images/products/women-sports-duo-combo.png',
      '/images/products/women-sports-active-grey.png'
    ],
    modelType: 'romper',
    customizable: false,
    frequentlyBoughtWith: ['women-sports-active-tshirt', 'princess-stylish-girls-sweater']
  },

  // 6. CUTIEPIE FANCY GIRLS BLACK TURTLENECK SWEATER (IN-HOUSE MODEL)
  {
    id: 'cutiepie-fancy-girls-sweater',
    sku: 'VK-SWT-006',
    name: 'Cutiepie Fancy Girls Soft Knitted High-Neck Turtleneck Winter Top (Jet Black)',
    brand: 'Cozy Cuddle by Vikas Kumar',
    category: 'clothes',
    department: 'Kids Turtlenecks & Sweaters',
    price: 749,
    originalPrice: 1399,
    discountPercent: 46,
    rating: 4.88,
    reviewsCount: 940,
    ratingBreakdown: { 5: 85, 4: 11, 3: 3, 2: 1, 1: 0 },
    inStock: true,
    stockCount: 20,
    deliveryDays: 1,
    estimatedDelivery: 'FREE delivery Tomorrow by 10 PM',
    tagline: 'Warm, Stretchy & Elegant Winter Styling Top for Young Girls',
    description: 'Designed for effortless winter layering. Made with ultra-soft combed cotton-poly knit with high elasticity so it pulls easily over the head without pulling on delicate hair.',
    features: [
      'Extra-stretch flexible neck opening for easy on/off dressing',
      'Breathable thermal knit insulates against chilly winds',
      'Smooth non-pilling exterior finish maintains a brand-new look'
    ],
    specifications: {
      'Style': 'Fitted High-Neck Ribbed Top',
      'Fabric': 'Soft Combed Cotton-Acrylic Rib (220 GSM)',
      'Origin': 'Vikas Kumar Atelier'
    },
    material: 'Ultra-Soft Elasticated Ribbed Knit',
    softnessScore: 9.8,
    colors: [
      { name: 'Midnight Black', hex: '#111111' },
      { name: 'Blush Pink', hex: '#FAD2CF' }
    ],
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y'],
    images: [
      '/images/products/cutiepie-girls-turtleneck.png',
      '/images/products/cutiepie-plaid-turtleneck.png'
    ],
    modelType: 'romper',
    customizable: true,
    frequentlyBoughtWith: ['princess-stylish-girls-sweater', 'tinkle-comfy-girls-2pc-combo']
  },

  // 7. BOSTON 91 DUO STREETWEAR 2-PACK COMBO (BLUE & BLACK)
  {
    id: 'boston-91-duo-streetwear-combo',
    sku: 'VK-STR-007',
    name: 'Classic Partywear Boston 91 Graphic Oversized T-Shirt 2-Pack Combo (Blue + Black)',
    brand: 'Cozy Cuddle by Vikas Kumar',
    category: 'clothes',
    department: 'Value Combos (2-Pack)',
    price: 1599,
    originalPrice: 2999,
    discountPercent: 47,
    rating: 4.96,
    reviewsCount: 3120,
    ratingBreakdown: { 5: 93, 4: 5, 3: 2, 2: 0, 1: 0 },
    isBestSeller: true,
    isAmazonChoice: true,
    inStock: true,
    stockCount: 16,
    deliveryDays: 1,
    estimatedDelivery: 'FREE delivery Tomorrow by 10 PM',
    tagline: 'Best Selling Twin Pack: 1 Royal Blue + 1 Charcoal Black Boston 91 Drop',
    description: 'Double your street style! Includes two heavyweight 240 GSM Boston 91 oversized tees. Pair with your best friend, siblings, or rotate across your weekly casual wardrobe.',
    features: [
      'Includes 2 Oversized Heavyweight Tees (1 Cobalt Blue + 1 Charcoal Black)',
      '100% Premium 240 GSM Combed French Terry Cotton',
      'Relaxed drop-shoulder silhouette with distressed vintage collegiate stars'
    ],
    specifications: {
      'Pack Details': '2 Pieces Combo (Blue + Black)',
      'Material': '100% French Terry Heavyweight Cotton (240 GSM)',
      'Fit': 'Oversized Boxy Fit'
    },
    material: '240 GSM 100% French Terry Cotton',
    softnessScore: 10.0,
    colors: [
      { name: 'Blue & Black Twin Pack', hex: '#1D4ED8' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      '/images/products/boston-91-combo-pack.png',
      '/images/products/boston-91-blue-streetwear.png'
    ],
    modelType: 'romper',
    customizable: true,
    frequentlyBoughtWith: ['boston-91-retro-tshirt', 'women-sports-active-tshirt']
  },

  // 8. TRENDY GLAMOROUS BOSTON 91 CHARCOAL WITH PINK ACCENTS
  {
    id: 'boston-91-charcoal-pink',
    sku: 'VK-STR-008',
    name: 'Trendy Glamorous Women Boston 91 Oversized T-Shirt (Midnight Charcoal with Rose Pink Print)',
    brand: 'Cozy Cuddle by Vikas Kumar',
    category: 'clothes',
    department: 'Boston 91 Graphic Streetwear',
    price: 899,
    originalPrice: 1699,
    discountPercent: 47,
    rating: 4.9,
    reviewsCount: 1780,
    ratingBreakdown: { 5: 87, 4: 9, 3: 3, 2: 1, 1: 0 },
    inStock: true,
    stockCount: 19,
    deliveryDays: 1,
    estimatedDelivery: 'FREE delivery Tomorrow by 10 PM',
    tagline: 'Contrast Rose Pink Screen Print on Vintage Washed Charcoal Jersey',
    description: 'A striking contrast edition of our Boston 91 drop. Features bright candy rose pink screen printing on deep washed charcoal cotton jersey for an edgy, stylish statement.',
    features: [
      'Candy pink distressed vintage collegiate print',
      'Pre-washed garment enzyme finish for authentic retro softness',
      'Unisex relaxed boxy fit with wide rib neck'
    ],
    specifications: {
      'Fabric': '100% Combed Cotton Single Jersey (230 GSM)',
      'Fit': 'Oversized Boyfriend Style',
      'Origin': 'Handmade at Vikas Kumar Atelier'
    },
    material: '100% Combed Cotton Heavyweight Jersey',
    softnessScore: 9.8,
    colors: [
      { name: 'Charcoal with Rose Pink', hex: '#262626' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      '/images/products/boston-91-charcoal-pink.png',
      '/images/products/boston-91-blue-streetwear.png'
    ],
    modelType: 'romper',
    customizable: true,
    frequentlyBoughtWith: ['boston-91-retro-tshirt', 'tinkle-comfy-girls-2pc-combo']
  }
];
