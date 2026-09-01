// Trigger deployment push
import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { SplashScreen } from './components/SplashScreen';
import {
  UserProfile,
  GoldRates,
  Product,
  Banner,
  BottomBanner,
  CategoryItem,
  AppVersionInfo,
  CartItem,
  Category,
  Gender,
  Purity,
  CompanyInfo,
  DrawerConfig,
  FooterConfig,
} from './types';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { VisualSearchModal } from './components/VisualSearchModal';
import { GoldSavingsScheme } from './components/GoldSavingsScheme';
import { AdminPanelModal } from './components/AdminPanelModal';
import { LiveRatesModal } from './components/LiveRatesModal';
import { CategoryModal } from './components/CategoryModal';
import { GiftingModal } from './components/GiftingModal';
import { SideDrawer } from './components/SideDrawer';
import { BottomNav } from './components/BottomNav';
import { AppUpdateModal } from './components/AppUpdateModal';
import { AboutCompanyModal } from './components/AboutCompanyModal';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppInquiryModal } from './components/WhatsAppInquiry';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { JewelleryLoader } from './components/JewelleryLoader';

import {
  initialGoldRates,
  initialBanners,
  initialBottomBanner,
  initialCategoryItems,
  initialProducts,
  initialVersionInfo,
  initialCompanyInfo,
  initialDrawerConfig,
  initialFooterConfig
} from './data/initialData';
import { calculateProductPrice } from './utils/priceCalculator';
import { safeFetchJson } from './utils/safeFetch';

import { Heart, Sparkles, SlidersHorizontal, ArrowUpRight, X } from 'lucide-react';

export default function App() {
  // Toast Notification State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (title: string, description?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
  };

  // Animated Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Dynamic System Theme Listener (Default to Light Mode)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sj_dark_mode');
    if (saved !== null) return saved === 'true';
    return false;
  });

  useEffect(() => {
    localStorage.setItem('sj_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // User Auth State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sj_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      email: '',
      name: '',
      address: { street: '', city: '', state: '', pincode: '' },
      isLoggedIn: false,
    };
  });
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Role Control (Invisible Admin Access)
  const [isAdmin, setIsAdminState] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('sj_is_admin') === 'true';
    } catch (e) {
      return false;
    }
  });
  const setIsAdmin = (val: boolean) => {
    setIsAdminState(val);
    try {
      if (val) {
        sessionStorage.setItem('sj_is_admin', 'true');
      } else {
        sessionStorage.removeItem('sj_is_admin');
      }
    } catch (e) {}
  };

  // Dynamic Custom Category Partitions (Admin Managed)
  const [customCategories, setCustomCategories] = useState<(CategoryItem | string)[]>(initialCategoryItems);
  const [bottomBanner, setBottomBanner] = useState<BottomBanner>(initialBottomBanner);
  const [drawerConfig, setDrawerConfig] = useState<DrawerConfig>(initialDrawerConfig);
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(initialFooterConfig);

  // Real-time Data
  const [rates, setRates] = useState<GoldRates>(initialGoldRates);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [versionInfo, setVersionInfo] = useState<AppVersionInfo>(initialVersionInfo);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(initialCompanyInfo);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<Gender | 'All'>('All');
  const [selectedPurity, setSelectedPurity] = useState<Purity | 'All'>('All');
  const [priceRange, setPriceRange] = useState<number>(500000);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [exactMatchProductId, setExactMatchProductId] = useState<string | null>(null);

  // Interactive Modals
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [visualSearchOpen, setVisualSearchOpen] = useState<boolean>(false);
  const [whatsAppProduct, setWhatsAppProduct] = useState<Product | null>(null);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState<boolean>(false);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [liveRatesModalOpen, setLiveRatesModalOpen] = useState<boolean>(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState<boolean>(false);
  const [giftingModalOpen, setGiftingModalOpen] = useState<boolean>(false);
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);
  const [sideDrawerOpen, setSideDrawerOpen] = useState<boolean>(false);
  const [bottomTab, setBottomTab] = useState<'home' | 'jew_plans' | 'digi_gold' | 'gifting' | 'admin'>('home');
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [wishlistOpen, setWishlistOpen] = useState<boolean>(false);

  const [activeSection, setActiveSection] = useState<'catalog' | 'scheme'>('catalog');

  const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);
  const [isSectionLoading, setIsSectionLoading] = useState<boolean>(false);

  const handleSelectCategory = (cat: string) => {
    if (cat === selectedCategory) return;
    setIsCategoryLoading(true);
    setSelectedCategory(cat);
    setTimeout(() => {
      setIsCategoryLoading(false);
    }, 380);
  };

  const handleSelectSection = (section: 'catalog' | 'scheme') => {
    if (section === activeSection) return;
    setIsSectionLoading(true);
    setActiveSection(section);
    setTimeout(() => {
      setIsSectionLoading(false);
    }, 420);
  };

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Zero Data Loss Account Sync: Restore remote user data on login or load
  const [dataRestored, setDataRestored] = useState<boolean>(false);
  
  useEffect(() => {
    if (user.isLoggedIn && user.email) {
      setDataRestored(false);
      (async () => {
        try {
          const [userDataRes, productsRes] = await Promise.all([
            safeFetchJson<{ success?: boolean; userData?: any }>(`/api/user-data/${encodeURIComponent(user.email)}`),
            safeFetchJson<{ success?: boolean; products?: Product[] }>('/api/products'),
          ]);
          
          const freshProducts = (productsRes?.success && productsRes.products) ? productsRes.products : products;

          if (userDataRes?.success && userDataRes.userData) {
            const ud = userDataRes.userData;
            if (ud.profile) setUser((prev) => ({ ...prev, ...ud.profile }));
            setCart(ud.cart && ud.cart.length > 0 ? ud.cart : []);
            
            const restoredWish = ud.wishlistIds && ud.wishlistIds.length > 0
              ? freshProducts.filter((p: Product) => ud.wishlistIds.includes(p.id))
              : [];
            setWishlist(restoredWish);
          } else {
            setCart([]);
            setWishlist([]);
          }
        } catch (e) {
          // ignore
        } finally {
          setDataRestored(true);
        }
      })();
    } else {
      setDataRestored(true);
    }
  }, [user.email, user.isLoggedIn]);

  // Sync user state to remote backend and local storage
  useEffect(() => {
    localStorage.setItem('sj_user', JSON.stringify(user));
    
    if (user.isLoggedIn && user.email && dataRestored) {
      safeFetchJson('/api/user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          profile: user,
          cart,
          wishlistIds: wishlist.map((w) => w.id),
        }),
      }).catch(() => {});
    }
  }, [user, cart, wishlist, dataRestored]);

  // Real-Time Sync Polling from Express Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratesRes, productsRes, bannersRes, versionRes, companyRes, catRes, bbRes, drawerRes, footerRes] = await Promise.all([
          safeFetchJson('/api/rates'),
          safeFetchJson('/api/products'),
          safeFetchJson('/api/banners'),
          safeFetchJson('/api/version'),
          safeFetchJson('/api/company-info'),
          safeFetchJson('/api/categories'),
          safeFetchJson('/api/bottom-banner'),
          safeFetchJson('/api/drawer-config'),
          safeFetchJson('/api/footer-config'),
        ]);

        // ==========================================
        // FIX: Deep Compare objects to prevent layout 
        // shifts and continuous DOM remounts
        // ==========================================
        
        if (ratesRes?.success && ratesRes.rates) {
          setRates(prev => JSON.stringify(prev) === JSON.stringify(ratesRes.rates) ? prev : ratesRes.rates);
        }
        
        if (productsRes?.success && productsRes.products) {
          setProducts(prev => JSON.stringify(prev) === JSON.stringify(productsRes.products) ? prev : productsRes.products);
        }
        
        if (bannersRes?.success && bannersRes.banners) {
          setBanners(prev => JSON.stringify(prev) === JSON.stringify(bannersRes.banners) ? prev : bannersRes.banners);
        }
        
        if (versionRes?.success && versionRes.versionInfo) {
          setVersionInfo(prev => JSON.stringify(prev) === JSON.stringify(versionRes.versionInfo) ? prev : versionRes.versionInfo);
        }
        
        if (companyRes?.success && companyRes.companyInfo) {
          setCompanyInfo(prev => JSON.stringify(prev) === JSON.stringify(companyRes.companyInfo) ? prev : companyRes.companyInfo);
        }
        
        if (catRes?.success && Array.isArray(catRes.categories) && catRes.categories.length > 0) {
          setCustomCategories(prev => JSON.stringify(prev) === JSON.stringify(catRes.categories) ? prev : catRes.categories);
        }
        
        if (bbRes?.success && bbRes.bottomBanner) {
          setBottomBanner(prev => JSON.stringify(prev) === JSON.stringify(bbRes.bottomBanner) ? prev : bbRes.bottomBanner);
        }
        
        if (drawerRes?.success && drawerRes.drawerConfig) {
          setDrawerConfig(prev => JSON.stringify(prev) === JSON.stringify(drawerRes.drawerConfig) ? prev : drawerRes.drawerConfig);
        }
        
        if (footerRes?.success && footerRes.footerConfig) {
          setFooterConfig(prev => JSON.stringify(prev) === JSON.stringify(footerRes.footerConfig) ? prev : footerRes.footerConfig);
        }

      } catch (err) {
        console.warn('Backend offline, using local state');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 4000); // 4-second live rate & catalog polling
    return () => clearInterval(interval);
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const price = calculateProductPrice(p, rates).totalPrice;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedGender !== 'All' && p.gender !== selectedGender) return false;
      if (selectedPurity !== 'All' && p.purity !== selectedPurity) return false;
      if (price > priceRange) return false;

      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase().trim();
        
        if (q === 'necklace' || q === 'necklaces') {
          return (
            p.title.toLowerCase().includes('necklace') ||
            p.title.toLowerCase().includes('pendant') ||
            p.title.toLowerCase().includes('choker') ||
            p.title.toLowerCase().includes('kundan') ||
            p.description.toLowerCase().includes('necklace')
          );
        }
        if (q === 'ring' || q === 'rings' || q === 'solitaire ring') {
          return p.title.toLowerCase().includes('ring') || p.description.toLowerCase().includes('ring');
        }
        if (q === 'bangle' || q === 'bangles' || q === 'kadas') {
          return p.title.toLowerCase().includes('bangle') || p.description.toLowerCase().includes('bangle');
        }
        if (q === 'bracelet' || q === 'bracelets') {
          return p.title.toLowerCase().includes('bracelet') || p.description.toLowerCase().includes('bracelet');
        }
        if (q === 'coin' || q === 'coins' || q === 'gold coin') {
          return p.category.toLowerCase().includes('coins') || p.title.toLowerCase().includes('coin');
        }
        if (q === 'earring' || q === 'earrings' || q === 'jhumka') {
          return p.title.toLowerCase().includes('earring') || p.description.toLowerCase().includes('earring');
        }

        return (
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.purity.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (exactMatchProductId) {
      result = [...result].sort((a, b) => {
        if (a.id === exactMatchProductId) return -1;
        if (b.id === exactMatchProductId) return 1;
        return 0;
      });
    }

    return result;
  }, [products, rates, selectedCategory, selectedGender, selectedPurity, priceRange, searchTerm, exactMatchProductId]);

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    if (!user.isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    const priceInfo = calculateProductPrice(product, rates);
    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        { product, quantity: 1, selectedPurity: product.purity, calculatedPrice: priceInfo.totalPrice },
      ];
    });
    setCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === id ? { ...item, quantity: qty } : item))
    );
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    if (!user.isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Admin Handlers
  const handleUpdateRates = async (newRates: Partial<GoldRates>) => {
    try {
      const data = await safeFetchJson<{ rates?: GoldRates }>('/api/admin/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRates),
      });
      if (data?.rates) setRates(data.rates);
      else setRates((prev) => ({ ...prev, ...newRates, lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }));
      addToast('Live Rates Updated', 'Gold & Silver rates updated and saved to database.');
    } catch (e) {
      setRates((prev) => ({ ...prev, ...newRates, lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }));
      addToast('Rates Updated', 'Updated rates in active session.', 'info');
    }
  };

  const handleAddProduct = async (productData: Partial<Product>) => {
    try {
      const data = await safeFetchJson<{ success?: boolean; products?: Product[] }>('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (data?.products) {
        setProducts(data.products);
        if (selectedProductDetail && productData.id === selectedProductDetail.id) {
          const updated = data.products.find((p) => p.id === productData.id);
          if (updated) setSelectedProductDetail(updated);
        }
        addToast(
          productData.id ? 'Product Updated' : 'Product Added',
          productData.id ? 'Product details updated in database.' : 'New product saved to database catalog.'
        );
        return;
      }
    } catch (e) {}
    
    const newP: Product = {
      id: productData.id || `sj-${Date.now()}`,
      title: productData.title || 'New Gold Jewellery',
      category: productData.category || 'Gold',
      purity: productData.purity || '22K',
      weightGrams: productData.weightGrams || 10,
      makingChargePercent: productData.makingChargePercent || 12,
      baseMakingCharge: 250,
      image: productData.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      gallery: productData.gallery || [productData.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
      description: productData.description || 'Authentic BIS Hallmarked Gold piece.',
      gender: productData.gender || 'Women',
      collection: 'Daily Wear',
      isNewArrival: true,
      isFeatured: true,
      inStock: productData.inStock ?? true,
      hallmarkCertified: true,
    };
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === newP.id);
      if (exists) return prev.map((p) => (p.id === newP.id ? { ...p, ...newP } : p));
      return [newP, ...prev];
    });
    if (selectedProductDetail && productData.id === selectedProductDetail.id) {
      setSelectedProductDetail(newP);
    }
    addToast('Product Saved', 'Saved product changes to active catalog.');
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const data = await safeFetchJson<{ success?: boolean; products?: Product[] }>(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (data?.products) {
        setProducts(data.products);
        if (selectedProductDetail && selectedProductDetail.id === id) {
          setSelectedProductDetail(null);
        }
        addToast('Product Deleted', 'Item removed permanently from database catalog.');
        return;
      }
    } catch (e) {}
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProductDetail && selectedProductDetail.id === id) {
      setSelectedProductDetail(null);
    }
    addToast('Product Deleted', 'Item removed from active catalog.', 'info');
  };

  const handleAddBanner = async (banner: Banner) => {
    try {
      const data = await safeFetchJson<{ success?: boolean; banners?: Banner[]; message?: string }>('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner),
      });
      if (data?.success && Array.isArray(data.banners)) {
        setBanners(data.banners);
        addToast('Banner Published', 'Advertisement banner saved to database and published live.');
        return;
      } else if (Array.isArray(data?.banners)) {
        setBanners(data.banners);
        addToast('Banner Published', 'Advertisement banner saved to database.');
        return;
      }
      throw new Error(data?.message || 'Backend rejected banner save request');
    } catch (e: any) {
      console.error('[Add Banner Error]', e);
      setBanners((prev) => [...prev, banner]);
      addToast('Banner Save Warning', 'Could not sync banner to server database. Kept in active session only.', 'error');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      const data = await safeFetchJson<{ success?: boolean; banners?: Banner[]; message?: string }>(`/api/admin/banners/${id}`, {
        method: 'DELETE',
      });
      if (data?.success && Array.isArray(data.banners)) {
        setBanners(data.banners);
        addToast('Banner Removed', 'Advertisement banner deleted from database.');
        return;
      } else if (Array.isArray(data?.banners)) {
        setBanners(data.banners);
        addToast('Banner Removed', 'Advertisement banner deleted.');
        return;
      }
      throw new Error(data?.message || 'Backend rejected banner delete request');
    } catch (e: any) {
      console.error('[Delete Banner Error]', e);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      addToast('Banner Delete Warning', 'Could not delete banner from server database. Removed from active session only.', 'error');
    }
  };

  const handleUpdateCategories = async (categories: CategoryItem[]) => {
    setCustomCategories(categories);
    try {
      await safeFetchJson('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories }),
      });
      addToast('Categories Updated', 'Category list saved to database.');
    } catch (e) {
      addToast('Categories Updated', 'Category list saved locally.', 'info');
    }
  };

  const handleUpdateBottomBanner = async (banner: BottomBanner) => {
    setBottomBanner(banner);
    try {
      const data = await safeFetchJson<{ bottomBanner?: BottomBanner }>('/api/admin/bottom-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner),
      });
      if (data?.bottomBanner) setBottomBanner(data.bottomBanner);
      addToast('Bottom Banner Updated', 'Bottom banner changes published live.');
    } catch (e) {
      addToast('Bottom Banner Updated', 'Bottom banner updated locally.', 'info');
    }
  };

  const handleUpdateDrawerConfig = async (cfg: DrawerConfig) => {
    setDrawerConfig(cfg);
    try {
      const data = await safeFetchJson<{ drawerConfig?: DrawerConfig }>('/api/admin/drawer-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });
      if (data?.drawerConfig) setDrawerConfig(data.drawerConfig);
      addToast('Hamburger Menu Updated', 'Hamburger drawer menu saved live.');
    } catch (e) {
      addToast('Hamburger Menu Updated', 'Drawer menu updated locally.', 'info');
    }
  };

  const handleUpdateFooterConfig = async (cfg: FooterConfig) => {
    setFooterConfig(cfg);
    try {
      const data = await safeFetchJson<{ footerConfig?: FooterConfig }>('/api/admin/footer-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });
      if (data?.footerConfig) setFooterConfig(data.footerConfig);
      addToast('Footer Settings Updated', 'Footer configuration saved live.');
    } catch (e) {
      addToast('Footer Settings Updated', 'Footer configuration updated locally.', 'info');
    }
  };

  const handleUpdateCompanyInfo = async (infoUpdate: Partial<CompanyInfo>) => {
    try {
      const data = await safeFetchJson<{ companyInfo?: CompanyInfo }>('/api/admin/company-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(infoUpdate),
      });
      if (data?.companyInfo) {
        setCompanyInfo(data.companyInfo);
      } else {
        setCompanyInfo((prev) => ({ ...prev, ...infoUpdate }));
      }
      addToast('Company Details Saved', 'Information updated and saved to database.');
    } catch (e) {
      setCompanyInfo((prev) => ({ ...prev, ...infoUpdate }));
      addToast('Company Details Saved', 'Updated company details in active session.', 'info');
    }
  };

  const handleBroadcastVersion = async (vNum: string, vMsg: string) => {
    try {
      const data = await safeFetchJson<{ versionInfo?: AppVersionInfo }>('/api/admin/version', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latestVersion: vNum, updateMessage: vMsg }),
      });
      if (data?.versionInfo) {
        setVersionInfo(data.versionInfo);
      } else {
        setVersionInfo({
          currentVersion: '1.0.0',
          latestVersion: vNum,
          updateAvailable: true,
          updateMessage: vMsg,
          releaseNotes: ['Real-time rates', 'New Diwali collection'],
        });
      }
      addToast('Version Broadcasted', `Version ${vNum} broadcasted live to all users.`);
    } catch (e) {
      addToast('Version Broadcasted', `Broadcasted version ${vNum}.`, 'info');
    }
  };

  const handleUpdateProductDescription = async (id: string, newDesc: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, description: newDesc } : p))
    );
    if (selectedProductDetail && selectedProductDetail.id === id) {
      setSelectedProductDetail((prev) => (prev ? { ...prev, description: newDesc } : null));
    }
    try {
      const data = await safeFetchJson<{ products?: Product[] }>('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, description: newDesc }),
      });
      if (data?.products) setProducts(data.products);
      addToast('Description Saved', 'Product description saved permanently to database.');
    } catch (e) {
      addToast('Description Saved', 'Updated description in active session.', 'info');
    }
  };

  const handleUpdateProductImage = async (id: string, newPrimaryImg: string, newGallery: string[]) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, image: newPrimaryImg || p.image, gallery: newGallery } : p))
    );
    if (selectedProductDetail && selectedProductDetail.id === id) {
      setSelectedProductDetail((prev) =>
        prev ? { ...prev, image: newPrimaryImg || prev.image, gallery: newGallery } : null
      );
    }
    try {
      const data = await safeFetchJson<{ products?: Product[] }>('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, image: newPrimaryImg, gallery: newGallery }),
      });
      if (data?.products) setProducts(data.products);
      addToast('Photos Saved', 'Product images saved permanently to database.');
    } catch (e) {
      addToast('Photos Saved', 'Updated product photos in active session.', 'info');
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        darkMode ? 'bg-black text-amber-50' : 'bg-white text-amber-950'
      }`}
    >
      {/* Animated App Launch Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <Header
        rates={rates}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenScheme={() => handleSelectSection('scheme')}
        onOpenWhatsApp={() => {
          setWhatsAppProduct(products[0] || null);
          setWhatsAppModalOpen(true);
        }}
        onOpenLiveRates={() => setLiveRatesModalOpen(true)}
        onOpenSideDrawer={() => setSideDrawerOpen(true)}
        onOpenVisualSearch={() => setVisualSearchOpen(true)}
        onOpenAbout={() => setAboutModalOpen(true)}
        activeSection={activeSection}
        setActiveSection={handleSelectSection}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      {/* Dynamic Section Loader */}
      {isSectionLoading && (
        <div className="py-20 flex items-center justify-center min-h-[50vh]">
          <JewelleryLoader
            message={activeSection === 'scheme' ? 'Opening Shubham Gold Savings Scheme...' : 'Loading Showroom Collection...'}
            size="lg"
          />
        </div>
      )}

      {/* Main View Area */}
      {!isSectionLoading && activeSection === 'scheme' ? (
        <GoldSavingsScheme
          user={user}
          onOpenAuth={() => setAuthModalOpen(true)}
          darkMode={darkMode}
        />
      ) : !isSectionLoading && (
        <main className="animate-fade-in">
          {/* Hero Carousel */}
          <HeroCarousel
            banners={banners}
            rates={rates}
            onSelectCategory={(cat) => handleSelectCategory(cat)}
            onOpenScheme={() => handleSelectSection('scheme')}
            onOpenLiveRates={() => setLiveRatesModalOpen(true)}
          />

          {/* Category Navigation & Filters */}
          <CategoryNav
            selectedCategory={selectedCategory}
            setSelectedCategory={handleSelectCategory}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            selectedPurity={selectedPurity}
            setSelectedPurity={setSelectedPurity}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            darkMode={darkMode}
            customCategories={customCategories}
          />

          {/* Catalog Section Header */}
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-2 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#4A0E17] dark:text-[#D4AF37] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                {selectedCategory === 'All' ? 'Royal Jewellery Collection' : `${selectedCategory} Collection`}
              </h2>
              <p className="text-xs text-zinc-800 dark:text-zinc-400 font-medium">
                Showing {filteredProducts.length} BIS 916 Hallmarked Certified items
              </p>
            </div>

            {selectedCategory !== 'All' && (
              <button
                onClick={() => {
                  handleSelectCategory('All');
                  setSelectedGender('All');
                  setSelectedPurity('All');
                  setSearchTerm('');
                }}
                className="text-xs text-amber-700 dark:text-amber-400 font-bold underline hover:text-amber-900"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Product Grid / Dynamic Jewellery Category Loader */}
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
            {isCategoryLoading ? (
              <div className="py-20 flex items-center justify-center min-h-[300px]">
                <JewelleryLoader
                  message={`Curating ${selectedCategory === 'All' ? 'Royal Jewellery' : selectedCategory} Collection...`}
                  size="md"
                />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-amber-50/50 dark:bg-zinc-900 rounded-2xl border border-dashed border-amber-300 dark:border-zinc-800">
                <p className="text-base font-bold text-amber-950 dark:text-amber-300 mb-1">
                  Not Found   This item is currently not in stock.
                </p>
                <p className="text-xs text-amber-800/80 dark:text-zinc-400">
                  We could not find any matching or similar items in our live inventory.
                </p>
                <button
                  onClick={() => {
                    handleSelectCategory('All');
                    setSelectedGender('All');
                    setSelectedPurity('All');
                    setPriceRange(500000);
                    setSearchTerm('');
                  }}
                  className="mt-4 px-4 py-2 bg-[#4A0E17] text-[#D4AF37] text-xs font-bold rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    rates={rates}
                    isWishlisted={wishlist.some((p) => p.id === product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={handleAddToCart}
                    onSelectProduct={(p) => setSelectedProductDetail(p)}
                    onWhatsAppInquiry={(p) => {
                      setWhatsAppProduct(p);
                      setWhatsAppModalOpen(true);
                    }}
                    darkMode={darkMode}
                    index={idx}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Footer */}
      <Footer darkMode={darkMode} bottomBanner={bottomBanner} footerConfig={footerConfig} onOpenScheme={() => setActiveSection('scheme')} />

      {/* MODALS */}
      {/* 1. Auth OTP Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={user}
        setUser={setUser}
        onLogout={() => {
          //   FIXED: Clear cart & wishlist on logout so nothing lingers on
          // this device for the next login (own or someone else's).
          setCart([]);
          setWishlist([]);
        }}
        mandatory={false}
      />

      {/* 2. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        rates={rates}
        onClose={() => setSelectedProductDetail(null)}
        isWishlisted={selectedProductDetail ? wishlist.some((p) => p.id === selectedProductDetail.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onWhatsAppInquiry={(p) => {
          setWhatsAppProduct(p);
          setWhatsAppModalOpen(true);
        }}
        darkMode={darkMode}
        isAdmin={isAdmin}
        onUpdateProductDescription={handleUpdateProductDescription}
        onUpdateProductImage={handleUpdateProductImage}
        whatsappNumber={companyInfo.whatsappNumber}
      />

      {/* 3.1 Camera Visual Search Modal */}
      <VisualSearchModal
        isOpen={visualSearchOpen}
        onClose={() => setVisualSearchOpen(false)}
        onApplySearch={(term, exactProductId) => {
          setActiveSection('catalog');
          setSelectedCategory('All');
          setSelectedGender('All');
          setSelectedPurity('All');
          setExactMatchProductId(exactProductId || null);
          setSearchTerm(term);
          window.scrollTo({ top: 350, behavior: 'smooth' });
        }}
        products={products}
        darkMode={darkMode}
      />

      {/* 4. WhatsApp Inquiry Modal */}
      <WhatsAppInquiryModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        product={whatsAppProduct}
        rates={rates}
        darkMode={darkMode}
        whatsappNumber={companyInfo.whatsappNumber}
      />

      {/* 5. Shop Admin Panel Modal */}
      <AdminPanelModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        rates={rates}
        onUpdateRates={handleUpdateRates}
        products={products}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        banners={banners}
        onAddBanner={handleAddBanner}
        onDeleteBanner={handleDeleteBanner}
        bottomBanner={bottomBanner}
        onUpdateBottomBanner={handleUpdateBottomBanner}
        onBroadcastVersionUpdate={handleBroadcastVersion}
        darkMode={darkMode}
        customCategories={customCategories}
        onUpdateCategories={handleUpdateCategories}
        companyInfo={companyInfo}
        onUpdateCompanyInfo={handleUpdateCompanyInfo}
        drawerConfig={drawerConfig}
        onUpdateDrawerConfig={handleUpdateDrawerConfig}
        footerConfig={footerConfig}
        onUpdateFooterConfig={handleUpdateFooterConfig}
      />

      {/* 5.1 Dedicated Today's Live Metal Rates Screen Modal */}
      <LiveRatesModal
        isOpen={liveRatesModalOpen}
        onClose={() => setLiveRatesModalOpen(false)}
        rates={rates}
        isAdmin={isAdmin}
        onOpenAdmin={() => {
          setLiveRatesModalOpen(false);
          setAdminModalOpen(true);
        }}
        darkMode={darkMode}
      />

      {/* 6. Shopping Bag Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={() => setCart([])}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        darkMode={darkMode}
      />

      {/* 7. Wishlist Modal */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl ${
              darkMode ? 'bg-[#151012] border-zinc-800 text-zinc-100' : 'bg-[#FAF8F5] border-[#D4AF37]/50 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-between mb-4 border-b border-[#D4AF37]/30 pb-3">
              <h3 className="text-base sm:text-lg font-bold font-cinzel flex items-center gap-2 text-[#4A0E17] dark:text-[#F3E5AB]">
                <Heart className="w-5 h-5 text-rose-600 fill-current" />
                <span>Your Saved Wishlist ({wishlist.length})</span>
              </h3>
              <button onClick={() => setWishlistOpen(false)} className="font-bold text-xs p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {wishlist.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <Heart className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  No saved jewellery items yet. Click the heart icon on any product card!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {wishlist.map((item) => (
                  <div key={item.id} className={`p-3 rounded-2xl border flex items-center justify-between text-xs shadow-xs ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-amber-200/80'}`}>
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl border border-amber-200/60 dark:border-zinc-700" />
                      <div>
                        <strong className={`block font-playfair font-bold text-sm line-clamp-1 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{item.title}</strong>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">{item.purity}   {item.weightGrams}g</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleAddToCart(item);
                        setWishlistOpen(false);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-[#4A0E17] via-[#5A101C] to-[#3B0813] text-[#F3E5AB] font-bold text-xs rounded-xl shadow-luxury hover:brightness-110 active:scale-95 border border-[#D4AF37]/40 font-cinzel tracking-wider"
                    >
                      Bag
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. Category Partitions Modal */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categories={customCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setActiveSection('catalog');
          setSelectedCategory(cat);
        }}
        darkMode={darkMode}
      />

      {/* 8.1 Festive Gifting & Coins Collection Modal */}
      <GiftingModal
        isOpen={giftingModalOpen}
        onClose={() => setGiftingModalOpen(false)}
        onSelectCoinsCategory={() => {
          setActiveSection('catalog');
          setSelectedCategory('Coins');
        }}
        onOpenWhatsApp={() => {
          setWhatsAppProduct(products[0] || null);
          setWhatsAppModalOpen(true);
        }}
        darkMode={darkMode}
        products={products}
        rates={rates}
      />

      {/* 8.2 Side Drawer (3-Line Customer Dashboard) */}
      <SideDrawer
        isOpen={sideDrawerOpen}
        onClose={() => setSideDrawerOpen(false)}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={() => {
          setUser({
            email: '',
            name: '',
            address: { street: '', city: '', state: '', pincode: '' },
            isLoggedIn: false,
          });
          //   FIXED: Clear cart & wishlist here too   this is the second
          // logout entry point (hamburger side drawer), which had the same
          // stale-data bug as the AuthModal logout button.
          setCart([]);
          setWishlist([]);
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        customCategories={customCategories}
        drawerConfig={drawerConfig}
        onSelectCategoryFilter={(cat) => {
          setActiveSection('catalog');
          setSelectedCategory(cat);
        }}
        onSelectGenderFilter={(g) => {
          setActiveSection('catalog');
          setSelectedGender(g);
        }}
        onOpenScheme={() => setActiveSection('scheme')}
        onOpenAbout={() => setAboutModalOpen(true)}
        onOpenWhatsApp={() => {
          setWhatsAppProduct(products[0] || null);
          setWhatsAppModalOpen(true);
        }}
        onOpenOrders={() => setCartOpen(true)}
        isAdmin={isAdmin}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* 8.3 About Company & Heritage Modal */}
      <AboutCompanyModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        info={companyInfo}
        darkMode={darkMode}
      />

      {/* 9. Fixed Bottom Action Navigation Bar (Matches Requirement 4) */}
      <BottomNav
        activeTab={bottomTab}
        onSelectTab={(tab) => {
          setBottomTab(tab);
          if (tab === 'home') {
            setActiveSection('catalog');
            setSelectedCategory('All');
            setSelectedGender('All');
          } else if (tab === 'admin') {
            setAdminModalOpen(true);
          }
        }}
        onOpenSchemeModal={() => setActiveSection('scheme')}
        onOpenDigiGoldModal={() => setLiveRatesModalOpen(true)}
        onOpenGiftingModal={() => setGiftingModalOpen(true)}
        isAdmin={isAdmin}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* 10. In-App Version Update Pop-Up Notifier */}
      <AppUpdateModal
        isOpen={versionInfo.updateAvailable}
        onClose={() => setVersionInfo((prev) => ({ ...prev, updateAvailable: false }))}
        versionInfo={versionInfo}
        darkMode={darkMode}
        onConfirmUpdate={() => {
          setVersionInfo((prev) => ({ ...prev, updateAvailable: false }));
          window.location.reload();
        }}
      />

      {/* Toast Feedback Container */}
      <ToastContainer
        toasts={toasts}
        onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />

      <div className="h-16" /> {/* Bottom nav spacing buffer */}
    </div>
  );
}