export type Category = 'Gold' | 'Diamond' | 'Silver' | 'Coins' | 'Solitaires';
export type Purity = '24K' | '22K' | '18K' | '14K' | '925 Silver' | '999 Silver';
export type Gender = 'Women' | 'Men' | 'Unisex' | 'Kids';
export type Collection = 'Bridal Royal' | 'Daily Wear' | 'Solitaire Elegance' | 'Heritage Antique' | 'Festive Auspicious';

export interface UserProfile {
  email: string;
  name: string;
  avatar?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  isLoggedIn: boolean;
}

export interface GoldRates {
  gold24k: number; // rate per gram in INR
  gold22k: number;
  gold18k: number;
  silver: number;
  lastUpdated: string;
  trend24k: number; // e.g. +0.45 or -0.2
  trendSilver: number;
}

export interface Product {
  id: string;
  title: string;
  category: Category;
  purity: Purity;
  weightGrams: number;
  makingChargePercent: number; // e.g. 12%
  baseMakingCharge: number; // minimum fixed making charge
  image: string;
  gallery: string[];
  description: string;
  gender: Gender;
  collection: Collection;
  isNewArrival: boolean;
  isFeatured: boolean;
  inStock: boolean;
  hallmarkCertified: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  discountBadge: string;
  discountTag?: string;
  image: string;
  imageUrl?: string;
  categoryLink?: Category;
  ctaText: string;
}

export interface BottomBanner {
  id?: string;
  title: string;
  subtitle: string;
  discountBadge: string;
  image: string;
  categoryLink?: Category;
  ctaText: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  image?: string;
  order?: number;
}

export interface SchemeInstallment {
  month: number;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
  transactionId?: string;
}

export interface GoldScheme {
  id: string;
  email: string;
  schemeName: string;
  monthlyInstallment: number;
  totalMonths: number;
  monthsPaid: number;
  totalPaid: number;
  bonusDiscount: number;
  nextDueDate: string;
  history: SchemeInstallment[];
}

export interface AppVersionInfo {
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  updateMessage: string;
  releaseNotes: string[];
}

export interface TrustBadge {
  title: string;
  subtitle: string;
  icon?: string;
}

export interface FooterConfig {
  trustBadges: TrustBadge[];
  brandTitle: string;
  brandDescription: string;
  officialStoreLabel: string;
  collectionsTitle: string;
  collectionsList: string[];
  customerCareTitle: string;
  tollFreeText: string;
  careEmail: string;
  storeAddress: string;
  schemeTitle: string;
  schemeDescription: string;
  schemeHighlightBox: string;
  copyrightText: string;
}

export interface DrawerConfig {
  headerTitle: string;
  welcomeSubtitle: string;
  aboutBtnText: string;
  schemeBtnTitle: string;
  schemeBtnSubtitle?: string;
  whatsappBtnTitle: string;
  whatsappBtnSubtitle?: string;
  categorySectionTitle: string;
  shopForSectionTitle: string;
  footerTagline: string;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  establishedYear: string;
  bisHallmarkReg: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  storeHours: string;
  aboutText: string;
}

export interface UserSyncedData {
  email: string;
  profile: UserProfile;
  cart: CartItem[];
  wishlistIds: string[];
  lastUpdated: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPurity: Purity;
  calculatedPrice: number;
}
