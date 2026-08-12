import { GoldRates, Banner, BottomBanner, CategoryItem, Product, AppVersionInfo, CompanyInfo, DrawerConfig, FooterConfig } from '../types.js';

export const initialFooterConfig: FooterConfig = {
  trustBadges: [
    { title: '100% BIS Hallmarked', subtitle: 'Certified 22K & 18K Pure Gold', icon: 'Award' },
    { title: 'Lifetime Buyback', subtitle: 'Guaranteed Valuation at Market Rate', icon: 'ShieldCheck' },
    { title: '15-Day Easy Exchange', subtitle: 'Hassle-free return & exchange', icon: 'RotateCcw' },
    { title: 'Insured Free Shipping', subtitle: 'Safe door delivery across India', icon: 'Truck' },
  ],
  brandTitle: 'SHUBHAM JEWELLERS',
  brandDescription: "Inspired by royal Indian heritage and Tanishq's fine craftsmanship. Bringing you authentic certified gold, diamond solitaires, and silver ornaments since 1984.",
  officialStoreLabel: 'Official Authorised Store',
  collectionsTitle: 'Collections & Categories',
  collectionsList: [
    'Royal Kundan Bridal Necklaces',
    'Solitaire Diamond Rings',
    '24K Pure Gold Coins (Lakshmi Ganesh)',
    'Temple Antique Bangle Kadas',
    '925 Sterling Silver Payal',
  ],
  customerCareTitle: 'Customer Care & Store',
  tollFreeText: 'Toll Free: 1800-888-GOLD (4653)',
  careEmail: 'care@shubhamjewellers.com',
  storeAddress: 'Royal Flagship Store: MG Road, Heritage District, Mumbai - 400001',
  schemeTitle: 'Shubham Swarna Scheme',
  schemeDescription: 'Join our 11-month gold savings scheme and get 1 FREE month bonus installment on maturity.',
  schemeHighlightBox: 'Pay 10 Installments • Get 11th Free',
  copyrightText: '© 2026 Shubham Jewellers. All Rights Reserved. Inspired by Tanishq fine jewellery.',
};

export const initialDrawerConfig: DrawerConfig = {
  headerTitle: 'SHUBHAM JEWELLERS',
  welcomeSubtitle: 'Heritage & BIS Hallmarked Fine Gold',
  aboutBtnText: 'About Us & Showroom Info',
  schemeBtnTitle: 'Jewellery Savings Plan',
  schemeBtnSubtitle: 'Pay 10 Installments & Get 1 Month Bonus',
  whatsappBtnTitle: 'Direct WhatsApp Support',
  whatsappBtnSubtitle: 'Chat live with our gold consultants',
  categorySectionTitle: 'Shop By Category',
  shopForSectionTitle: 'Shop For',
  footerTagline: 'Shubham Jewellers v2.1.0 • Verified BIS Hallmarked',
};

export const initialGoldRates: GoldRates = {
  gold24k: 7350,
  gold22k: 6735,
  gold18k: 5515,
  silver: 88.5,
  lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  trend24k: 0.42,
  trendSilver: -0.15,
};

export const initialCompanyInfo: CompanyInfo = {
  name: 'Royal Heritage Jewellers',
  tagline: 'Crafting Timeless Elegance Since 1988',
  establishedYear: '1988',
  bisHallmarkReg: 'BIS-HM-MH-400192',
  phone: '+91 98200 12345',
  whatsappNumber: '919820012345',
  email: 'contact@royalheritagejewellers.com',
  address: 'Main Market Road, Near Town Hall, Zaveri Bazar, Mumbai, Maharashtra 400002',
  storeHours: 'Mon - Sat: 10:30 AM - 8:30 PM',
  aboutText: 'Royal Heritage Jewellers is a premier destination for certified 22K and 18K gold jewellery, VVS certified solitaire diamond craft, and traditional antique artisan collections.',
};

export const initialBottomBanner: BottomBanner = {
  id: 'bb1',
  title: 'Shubham Swarna Varsha Scheme',
  subtitle: 'Pay 10 Monthly Installments & Get 1 Month FREE Bonus on Pure Gold Jewellery',
  discountBadge: 'Exclusive Savings Scheme',
  image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=1200',
  ctaText: 'Join Swarna Scheme Now',
};

export const initialCategoryItems: CategoryItem[] = [
  { id: 'cat-1', name: 'Gold', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300', order: 1 },
  { id: 'cat-2', name: 'Diamond', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=300', order: 2 },
  { id: 'cat-3', name: 'Silver', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=300', order: 3 },
  { id: 'cat-4', name: 'Coins', image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=300', order: 4 },
  { id: 'cat-5', name: 'Solitaires', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=300', order: 5 },
  { id: 'cat-6', name: 'Kundan & Antique', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=300', order: 6 },
  { id: 'cat-7', name: 'Mangalsutra', image: 'https://images.unsplash.com/photo-1611591475161-267f5e8f4cb7?auto=format&fit=crop&q=80&w=300', order: 7 },
];

export const initialVersionInfo: AppVersionInfo = {
  currentVersion: '1.0.0',
  latestVersion: '1.0.0',
  updateAvailable: false,
  updateMessage: 'You are using the latest version of Royal Heritage App.',
  releaseNotes: ['Enhanced live gold rate tracking', 'Secure OTP login verification', 'Mobile WebView API compatibility'],
};

export const initialBanners: Banner[] = [
  {
    id: 'b1',
    title: 'Royal Bridal Solitaire Collection',
    subtitle: 'Handcrafted Heritage Designs with BIS 916 Hallmark Purity',
    discountBadge: 'Flat 25% Off Making Charges',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
    categoryLink: 'Gold',
    ctaText: 'Explore Royal Jewels',
  },
];

export const initialProducts: Product[] = [
  {
    id: 'p1',
    title: 'Royal Kundan Heritage Necklace',
    category: 'Gold',
    purity: '22K',
    weightGrams: 34.5,
    makingChargePercent: 12,
    baseMakingCharge: 3500,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
    ],
    description: 'An exquisite 22K hallmarked royal Kundan gold necklace adorned with genuine gemstones and traditional meenakari detailing.',
    gender: 'Women',
    collection: 'Bridal Royal',
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
    hallmarkCertified: true,
  },
  {
    id: 'p2',
    title: 'VVS Solitaire Diamond Ring',
    category: 'Diamond',
    purity: '18K',
    weightGrams: 4.2,
    makingChargePercent: 15,
    baseMakingCharge: 2000,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    ],
    description: 'Certified 1.0 Ct VVS-EF solitaire diamond mounted on a sleek 18K rose gold hallmark band.',
    gender: 'Women',
    collection: 'Solitaire Elegance',
    isNewArrival: true,
    isFeatured: true,
    inStock: true,
    hallmarkCertified: true,
  },
  {
    id: 'p3',
    title: 'Traditional Temple Gold Bangles (Set of 2)',
    category: 'Gold',
    purity: '22K',
    weightGrams: 48.0,
    makingChargePercent: 10,
    baseMakingCharge: 4000,
    image: 'https://images.unsplash.com/photo-1611591475168-306915f0eb12?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1611591475168-306915f0eb12?auto=format&fit=crop&q=80&w=600',
    ],
    description: 'Heavy antique temple design 22K gold bangles with intricate Laxmi and floral carvings.',
    gender: 'Women',
    collection: 'Heritage Antique',
    isNewArrival: false,
    isFeatured: true,
    inStock: true,
    hallmarkCertified: true,
  },
  {
    id: 'p4',
    title: '925 Sterling Silver Royal Bracelet',
    category: 'Silver',
    purity: '925 Silver',
    weightGrams: 22.4,
    makingChargePercent: 8,
    baseMakingCharge: 500,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
    ],
    description: 'Solid 925 sterling silver chain bracelet with anti-tarnish rhodium plating.',
    gender: 'Unisex',
    collection: 'Daily Wear',
    isNewArrival: true,
    isFeatured: false,
    inStock: true,
    hallmarkCertified: true,
  },
  {
    id: 'p5',
    title: '24K 10 Gram Gold Coin (BIS Hallmark)',
    category: 'Coins',
    purity: '24K',
    weightGrams: 10.0,
    makingChargePercent: 2,
    baseMakingCharge: 300,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=600',
    ],
    description: '999.9 pure 24K gold coin in tamper-evident Swiss assay packaging with Laxmi-Ganesha embossed motif.',
    gender: 'Unisex',
    collection: 'Festive Auspicious',
    isNewArrival: false,
    isFeatured: true,
    inStock: true,
    hallmarkCertified: true,
  },
];
