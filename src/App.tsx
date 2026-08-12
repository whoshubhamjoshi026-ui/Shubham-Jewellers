// Trigger deployment push
import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  GoldRates,
  Product,
  Banner,
  AppVersionInfo,
  CartItem,
  Category,
  Gender,
  Purity,
  CompanyInfo,
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
import { initialGoldRates, initialBanners, initialProducts, initialVersionInfo, initialCompanyInfo } from './data/initialData';
import { calculateProductPrice } from './utils/priceCalculator';
import { safeFetchJson } from './utils/safeFetch';
import { Heart, Sparkles, SlidersHorizontal, ArrowUpRight } from 'lucide-react';

export default function App() {
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

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(!user.isLoggedIn);

  // Role Control (Invisible Admin Access)
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Dynamic Custom Category Partitions (Admin Managed)
  const [customCategories, setCustomCategories] = useState<string[]>([
    'Gold',
    'Diamond',
    'Silver',
    'Coins',
    'Solitaires',
    'Kundan & Antique',
    'Mangalsutra',
  ]);

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
  const [bottomTab, setBottomTab] = useState<'home' | 'jew_plans' | 'digi_gold' | 'gifting'>('home');
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [wishlistOpen, setWishlistOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'catalog' | 'scheme'>('catalog');

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Zero Data Loss Account Sync: Restore remote user data on login or load
  useEffect(() => {
    if (user.isLoggedIn && user.email) {
      safeFetchJson(`/api/user-data/${encodeURIComponent(user.email)}`)
        .then((data) => {
          if (data?.success && data.userData) {
            const ud = data.userData;
            if (ud.profile) setUser((prev) => ({ ...prev, ...ud.profile }));
            if (ud.cart && ud.cart.length > 0) setCart(ud.cart);
            if (ud.wishlistIds && ud.wishlistIds.length > 0) {
              const restoredWish = initialProducts.filter((p) => ud.wishlistIds.includes(p.id));
              if (restoredWish.length > 0) setWishlist(restoredWish);
            }
          }
        })
        .catch(() => {});
    }
  }, [user.email, user.isLoggedIn]);

  // Sync user state to remote backend and local storage
  useEffect(() => {
    localStorage.setItem('sj_user', JSON.stringify(user));
    if (user.isLoggedIn && user.email) {
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
  }, [user, cart, wishlist]);

  // Real-Time Sync Polling from Express Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratesRes, productsRes, bannersRes, versionRes, companyRes] = await Promise.all([
          safeFetchJson('/api/rates'),
          safeFetchJson('/api/products'),
          safeFetchJson('/api/banners'),
          safeFetchJson('/api/version'),
          safeFetchJson('/api/company-info'),
        ]);

        if (ratesRes?.success && ratesRes.rates) setRates(ratesRes.rates);
        if (productsRes?.success && productsRes.products) setProducts(productsRes.products);
        if (bannersRes?.success && bannersRes.banners) setBanners(bannersRes.banners);
        if (versionRes?.success && versionRes.versionInfo) setVersionInfo(versionRes.versionInfo);
        if (companyRes?.success && companyRes.companyInfo) setCompanyInfo(companyRes.companyInfo);
      } catch (err) {
        console.warn('Backend offline, using local state');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 4000); // 4-second live rate & catalog polling
    return () => clearInterval(interval);
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const price = calculateProductPrice(p, rates).totalPrice;

    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedGender !== 'All' && p.gender !== selectedGender) return false;
    if (selectedPurity !== 'All' && p.purity !== selectedPurity) return false;
    if (price > priceRange) return false;

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.purity.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    return true;
  });

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
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
      else setRates((prev) => ({ ...prev, ...newRates, lastUpdated: new Date().toLocaleTimeString() }));
    } catch (e) {
      setRates((prev) => ({ ...prev, ...newRates, lastUpdated: new Date().toLocaleTimeString() }));
    }
  };

  const handleAddProduct = async (productData: Partial<Product>) => {
    try {
      const data = await safeFetchJson<{ products?: Product[] }>('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (data?.products) {
        setProducts(data.products);
        return;
      }
    } catch (e) {}

    const newP: Product = {
      id: `sj-${Date.now()}`,
      title: productData.title || 'New Gold Jewellery',
      category: productData.category || 'Gold',
      purity: productData.purity || '22K',
      weightGrams: productData.weightGrams || 10,
      makingChargePercent: productData.makingChargePercent || 12,
      baseMakingCharge: 250,
      image: productData.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      gallery: [productData.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
      description: productData.description || 'Authentic BIS Hallmarked Gold piece.',
      gender: productData.gender || 'Women',
      collection: 'Daily Wear',
      isNewArrival: true,
      isFeatured: true,
      inStock: true,
      hallmarkCertified: true,
    };
    setProducts((prev) => [newP, ...prev]);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await safeFetchJson(`/api/admin/products/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setProducts((prev) => prev.filter((p) => p.id !== id));
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
    } catch (e) {
      setCompanyInfo((prev) => ({ ...prev, ...infoUpdate }));
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
    } catch (e) {
      setVersionInfo({
        currentVersion: '1.0.0',
        latestVersion: vNum,
        updateAvailable: true,
        updateMessage: vMsg,
        releaseNotes: ['Real-time rates', 'New Diwali collection'],
      });
    }
  };

  const handleAddCategory = (catName: string) => {
    if (!customCategories.includes(catName)) {
      setCustomCategories((prev) => [...prev, catName]);
    }
  };

  const handleDeleteCategory = (catName: string) => {
    setCustomCategories((prev) => prev.filter((c) => c !== catName));
  };

  const handleUpdateProductDescription = (id: string, newDesc: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, description: newDesc } : p))
    );
    if (selectedProductDetail && selectedProductDetail.id === id) {
      setSelectedProductDetail((prev) => (prev ? { ...prev, description: newDesc } : null));
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        darkMode ? 'bg-black text-amber-50' : 'bg-white text-amber-950'
      }`}
    >
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
        onOpenScheme={() => setActiveSection('scheme')}
        onOpenWhatsApp={() => {
          setWhatsAppProduct(products[0] || null);
          setWhatsAppModalOpen(true);
        }}
        onOpenLiveRates={() => setLiveRatesModalOpen(true)}
        onOpenSideDrawer={() => setSideDrawerOpen(true)}
        onOpenVisualSearch={() => setVisualSearchOpen(true)}
        onOpenAbout={() => setAboutModalOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      {/* Main View Area */}
      {activeSection === 'scheme' ? (
        <GoldSavingsScheme
          user={user}
          onOpenAuth={() => setAuthModalOpen(true)}
          darkMode={darkMode}
        />
      ) : (
        <main className="animate-fade-in">
          {/* Hero Carousel */}
          <HeroCarousel
            banners={banners}
            rates={rates}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onOpenScheme={() => setActiveSection('scheme')}
            onOpenLiveRates={() => setLiveRatesModalOpen(true)}
          />

          {/* Category Navigation & Filters */}
          <CategoryNav
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
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
                  setSelectedCategory('All');
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

          {/* Product Grid */}
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-amber-50/50 dark:bg-zinc-900 rounded-2xl border border-dashed border-amber-300 dark:border-zinc-800">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                  No jewellery items matched your filters or search term.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedGender('All');
                    setSelectedPurity('All');
                    setPriceRange(500000);
                    setSearchTerm('');
                  }}
                  className="mt-3 px-4 py-2 bg-[#4A0E17] text-[#D4AF37] text-xs font-bold rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
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
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Footer */}
      <Footer darkMode={darkMode} />

      {/* MODALS */}
      {/* 1. Auth OTP Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={user}
        setUser={setUser}
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
      />

      {/* 3.1 Camera Visual Search Modal */}
      <VisualSearchModal
        isOpen={visualSearchOpen}
        onClose={() => setVisualSearchOpen(false)}
        onApplySearch={(term) => setSearchTerm(term)}
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
        onAddBanner={(b) => setBanners((prev) => [...prev, b])}
        onBroadcastVersionUpdate={handleBroadcastVersion}
        darkMode={darkMode}
        customCategories={customCategories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        companyInfo={companyInfo}
        onUpdateCompanyInfo={handleUpdateCompanyInfo}
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
            className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl ${
              darkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-[#FAF7F2] border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="text-base font-bold font-serif flex items-center gap-1.5 text-[#4A0E17] dark:text-[#D4AF37]">
                <Heart className="w-5 h-5 text-rose-600 fill-current" />
                <span>Your Saved Wishlist ({wishlist.length})</span>
              </h3>
              <button onClick={() => setWishlistOpen(false)} className="font-bold text-xs">
                ✕
              </button>
            </div>

            {wishlist.length === 0 ? (
              <p className="text-xs text-amber-900/80 dark:text-zinc-400 py-8 text-center">
                No saved jewellery items yet. Click the heart icon on any product card!
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {wishlist.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl border bg-white dark:bg-zinc-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                      <div>
                        <strong className={`block font-serif font-bold line-clamp-1 ${darkMode ? 'text-white' : 'text-black'}`}>{item.title}</strong>
                        <span className={`text-[10px] ${darkMode ? 'text-zinc-400' : 'text-zinc-800'}`}>{item.purity} • {item.weightGrams}g</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleAddToCart(item);
                        setWishlistOpen(false);
                      }}
                      className="px-3 py-1.5 bg-[#4A0E17] text-[#D4AF37] font-bold text-[11px] rounded-lg"
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
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
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
          }
        }}
        onOpenSchemeModal={() => setActiveSection('scheme')}
        onOpenDigiGoldModal={() => setLiveRatesModalOpen(true)}
        onOpenGiftingModal={() => setGiftingModalOpen(true)}
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
      <div className="h-16" /> {/* Bottom nav spacing buffer */}
    </div>
  );
}
