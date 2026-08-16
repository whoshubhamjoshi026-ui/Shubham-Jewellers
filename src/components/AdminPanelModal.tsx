import React, { useState, useEffect } from 'react';
import { GoldRates, Product, Banner, BottomBanner, CategoryItem, AppVersionInfo, CompanyInfo, DrawerConfig, FooterConfig, TrustBadge } from '../types';
import { X, Settings, TrendingUp, Plus, Trash2, Edit, Radio, Sparkles, CheckCircle2, AlertCircle, Building2, ArrowUp, ArrowDown, Layers, Menu, Footprints, Layout } from 'lucide-react';
import { ImageInputSelector } from './ImageInputSelector';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: GoldRates;
  onUpdateRates: (newRates: Partial<GoldRates>) => void;
  products: Product[];
  onAddProduct: (prod: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  banners: Banner[];
  onAddBanner: (banner: Banner) => void;
  onDeleteBanner?: (id: string) => void;
  bottomBanner: BottomBanner;
  onUpdateBottomBanner: (banner: BottomBanner) => void;
  onBroadcastVersionUpdate: (version: string, msg: string) => void;
  darkMode: boolean;
  customCategories: (CategoryItem | string)[];
  onUpdateCategories: (categories: CategoryItem[]) => void;
  companyInfo: CompanyInfo;
  onUpdateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  drawerConfig?: DrawerConfig;
  onUpdateDrawerConfig?: (cfg: DrawerConfig) => void;
  footerConfig?: FooterConfig;
  onUpdateFooterConfig?: (cfg: FooterConfig) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  rates,
  onUpdateRates,
  products,
  onAddProduct,
  onDeleteProduct,
  banners,
  onAddBanner,
  onDeleteBanner,
  bottomBanner,
  onUpdateBottomBanner,
  onBroadcastVersionUpdate,
  darkMode,
  customCategories,
  onUpdateCategories,
  companyInfo,
  onUpdateCompanyInfo,
  drawerConfig,
  onUpdateDrawerConfig,
  footerConfig,
  onUpdateFooterConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'rates' | 'products' | 'banners' | 'categories' | 'about' | 'drawer' | 'footer' | 'version'>('rates');

  // Rates Form
  const [gold24k, setGold24k] = useState(rates.gold24k.toString());
  const [gold22k, setGold22k] = useState(rates.gold22k.toString());
  const [gold18k, setGold18k] = useState(rates.gold18k.toString());
  const [silver, setSilver] = useState(rates.silver.toString());
  const [rateMsg, setRateMsg] = useState('');

  // Category Partition Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatImage, setEditCatImage] = useState('');
  const [catMsg, setCatMsg] = useState('');

  // Product Form
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [pTitle, setPTitle] = useState('');
  const [pCategory, setPCategory] = useState<string>('Gold');
  const [pPurity, setPPurity] = useState<'24K' | '22K' | '18K' | '925 Silver' | '999 Silver'>('22K');
  const [pWeight, setPWeight] = useState('12.5');
  const [pMaking, setPMaking] = useState('12');
  const [pImage, setPImage] = useState('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80');
  const [pGallery, setPGallery] = useState('');
  const [pGender, setPGender] = useState<'Women' | 'Men' | 'Unisex' | 'Kids'>('Women');
  const [pDesc, setPDesc] = useState('Certified BIS Hallmarked handcrafted luxury gold ornament.');
  const [pInStock, setPInStock] = useState<boolean>(true);
  const [pSuccessMsg, setPSuccessMsg] = useState('');

  // Banner Form (Top Banners)
  const [bTitle, setBTitle] = useState('');
  const [bSubtitle, setBSubtitle] = useState('');
  const [bImage, setBImage] = useState('');
  const [bTag, setBTag] = useState('');
  const [bCta, setBCta] = useState('');
  const [bSuccessMsg, setBSuccessMsg] = useState('');

  // Bottom Banner Form State
  const [bbTitle, setBbTitle] = useState(bottomBanner?.title || '');
  const [bbSubtitle, setBbSubtitle] = useState(bottomBanner?.subtitle || '');
  const [bbBadge, setBbBadge] = useState(bottomBanner?.discountBadge || '');
  const [bbImage, setBbImage] = useState(bottomBanner?.image || '');
  const [bbCta, setBbCta] = useState(bottomBanner?.ctaText || '');
  const [bbMsg, setBbMsg] = useState('');

  // Company Info Form State
  const [cAddress, setCAddress] = useState(companyInfo.address);
  const [cPhone, setCPhone] = useState(companyInfo.phone);
  const [cWhatsapp, setCWhatsapp] = useState(companyInfo.whatsappNumber);
  const [cHours, setCHours] = useState(companyInfo.storeHours);
  const [cHallmark, setCHallmark] = useState(companyInfo.bisHallmarkReg);
  const [cAboutText, setCAboutText] = useState(companyInfo.aboutText);
  const [infoMsg, setInfoMsg] = useState('');

  // Hamburger Drawer Config Form State
  const [dhHeaderTitle, setDhHeaderTitle] = useState(drawerConfig?.headerTitle || 'SHUBHAM JEWELLERS');
  const [dhWelcomeSubtitle, setDhWelcomeSubtitle] = useState(drawerConfig?.welcomeSubtitle || 'Welcome to Shubham Jewellers');
  const [dhAboutBtnText, setDhAboutBtnText] = useState(drawerConfig?.aboutBtnText || 'About Us & Showroom Info');
  const [dhSchemeBtnTitle, setDhSchemeBtnTitle] = useState(drawerConfig?.schemeBtnTitle || 'Jewellery Savings Plan');
  const [dhWhatsappBtnTitle, setDhWhatsappBtnTitle] = useState(drawerConfig?.whatsappBtnTitle || 'Direct WhatsApp Support');
  const [dhCategorySectionTitle, setDhCategorySectionTitle] = useState(drawerConfig?.categorySectionTitle || 'Shop By Category');
  const [dhShopForSectionTitle, setDhShopForSectionTitle] = useState(drawerConfig?.shopForSectionTitle || 'Shop For');
  const [dhFooterTagline, setDhFooterTagline] = useState(drawerConfig?.footerTagline || 'Shubham Jewellers v2.1.0 • Verified BIS Hallmarked');
  const [dhMsg, setDhMsg] = useState('');

  // Footer Config Form State
  const [ftTrustBadges, setFtTrustBadges] = useState<TrustBadge[]>(footerConfig?.trustBadges || [
    { title: '100% BIS Hallmarked', subtitle: 'Certified 22K & 18K Pure Gold', icon: 'Award' },
    { title: 'Lifetime Buyback', subtitle: 'Guaranteed Valuation at Market Rate', icon: 'ShieldCheck' },
    { title: '15-Day Easy Exchange', subtitle: 'Hassle-free return & exchange', icon: 'RotateCcw' },
    { title: 'Insured Free Shipping', subtitle: 'Safe door delivery across India', icon: 'Truck' },
  ]);
  const [ftBrandTitle, setFtBrandTitle] = useState(footerConfig?.brandTitle || 'SHUBHAM JEWELLERS');
  const [ftBrandDescription, setFtBrandDescription] = useState(footerConfig?.brandDescription || '');
  const [ftOfficialStoreLabel, setFtOfficialStoreLabel] = useState(footerConfig?.officialStoreLabel || 'Official Authorised Store');
  const [ftCollectionsTitle, setFtCollectionsTitle] = useState(footerConfig?.collectionsTitle || 'Collections & Categories');
  const [ftCollectionsList, setFtCollectionsList] = useState<string[]>(footerConfig?.collectionsList || []);
  const [ftNewCollectionItem, setFtNewCollectionItem] = useState('');
  const [ftCustomerCareTitle, setFtCustomerCareTitle] = useState(footerConfig?.customerCareTitle || 'Customer Care & Store');
  const [ftTollFreeText, setFtTollFreeText] = useState(footerConfig?.tollFreeText || '');
  const [ftCareEmail, setFtCareEmail] = useState(footerConfig?.careEmail || '');
  const [ftStoreAddress, setFtStoreAddress] = useState(footerConfig?.storeAddress || '');
  const [ftSchemeTitle, setFtSchemeTitle] = useState(footerConfig?.schemeTitle || 'Shubham Swarna Scheme');
  const [ftSchemeDescription, setFtSchemeDescription] = useState(footerConfig?.schemeDescription || '');
  const [ftSchemeHighlightBox, setFtSchemeHighlightBox] = useState(footerConfig?.schemeHighlightBox || '');
  const [ftCopyrightText, setFtCopyrightText] = useState(footerConfig?.copyrightText || '');
  const [ftMsg, setFtMsg] = useState('');

  // Populate local form states ONCE when modal is opened, avoiding 4s polling state overwrites
  useEffect(() => {
    if (isOpen) {
      if (bottomBanner) {
        setBbTitle(bottomBanner.title || '');
        setBbSubtitle(bottomBanner.subtitle || '');
        setBbBadge(bottomBanner.discountBadge || '');
        setBbImage(bottomBanner.image || '');
        setBbCta(bottomBanner.ctaText || '');
      }
      if (companyInfo) {
        setCAddress(companyInfo.address || '');
        setCPhone(companyInfo.phone || '');
        setCWhatsapp(companyInfo.whatsappNumber || '');
        setCHours(companyInfo.storeHours || '');
        setCHallmark(companyInfo.bisHallmarkReg || '');
        setCAboutText(companyInfo.aboutText || '');
      }
      if (drawerConfig) {
        setDhHeaderTitle(drawerConfig.headerTitle || 'SHUBHAM JEWELLERS');
        setDhWelcomeSubtitle(drawerConfig.welcomeSubtitle || 'Welcome to Shubham Jewellers');
        setDhAboutBtnText(drawerConfig.aboutBtnText || 'About Us & Showroom Info');
        setDhSchemeBtnTitle(drawerConfig.schemeBtnTitle || 'Jewellery Savings Plan');
        setDhWhatsappBtnTitle(drawerConfig.whatsappBtnTitle || 'Direct WhatsApp Support');
        setDhCategorySectionTitle(drawerConfig.categorySectionTitle || 'Shop By Category');
        setDhShopForSectionTitle(drawerConfig.shopForSectionTitle || 'Shop For');
        setDhFooterTagline(drawerConfig.footerTagline || 'Shubham Jewellers v2.1.0 • Verified BIS Hallmarked');
      }
      if (footerConfig) {
        setFtTrustBadges(footerConfig.trustBadges || []);
        setFtBrandTitle(footerConfig.brandTitle || 'SHUBHAM JEWELLERS');
        setFtBrandDescription(footerConfig.brandDescription || '');
        setFtOfficialStoreLabel(footerConfig.officialStoreLabel || 'Official Authorised Store');
        setFtCollectionsTitle(footerConfig.collectionsTitle || 'Collections & Categories');
        setFtCollectionsList(footerConfig.collectionsList || []);
        setFtCustomerCareTitle(footerConfig.customerCareTitle || 'Customer Care & Store');
        setFtTollFreeText(footerConfig.tollFreeText || '');
        setFtCareEmail(footerConfig.careEmail || '');
        setFtStoreAddress(footerConfig.storeAddress || '');
        setFtSchemeTitle(footerConfig.schemeTitle || 'Shubham Swarna Scheme');
        setFtSchemeDescription(footerConfig.schemeDescription || '');
        setFtSchemeHighlightBox(footerConfig.schemeHighlightBox || '');
        setFtCopyrightText(footerConfig.copyrightText || '');
      }
    }
  }, [isOpen]);

  // Version Broadcast Form
  const [versionNum, setVersionNum] = useState('2.1.0');
  const [versionMsg, setVersionMsg] = useState('A new version of Shubham Jewellers is available with live rate alerts and zero data loss account sync!');
  const [versionSuccess, setVersionSuccess] = useState('');

  if (!isOpen) return null;

  const handleSaveCompanyInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cWhatsapp || !cWhatsapp.trim()) {
      setInfoMsg('Error: WhatsApp contact number cannot be empty.');
      return;
    }

    // Validate phone number format (must contain 10-15 digits, optional + or country code)
    const digitsOnly = cWhatsapp.replace(/[^0-9]/g, '');
    if (/[a-zA-Z]/.test(cWhatsapp) || digitsOnly.length < 10 || digitsOnly.length > 15) {
      setInfoMsg('Error: Please enter a valid WhatsApp number with country code (e.g. +91XXXXXXXXXX or 9820012345).');
      return;
    }

    onUpdateCompanyInfo({
      address: cAddress,
      phone: cPhone,
      whatsappNumber: cWhatsapp,
      storeHours: cHours,
      bisHallmarkReg: cHallmark,
      aboutText: cAboutText,
    });
    setInfoMsg('Company details & WhatsApp contact updated live across the app!');
    setTimeout(() => setInfoMsg(''), 4000);
  };

  const handleSaveBottomBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bbTitle || !bbImage) return;

    onUpdateBottomBanner({
      id: bottomBanner?.id || 'bb-main',
      title: bbTitle,
      subtitle: bbSubtitle,
      discountBadge: bbBadge || 'Special Offer',
      image: bbImage,
      ctaText: bbCta || 'Explore Collection',
    });

    setBbMsg('Bottom main banner updated and published live!');
    setTimeout(() => setBbMsg(''), 4000);
  };

  const handleSaveDrawerConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateDrawerConfig) {
      onUpdateDrawerConfig({
        headerTitle: dhHeaderTitle,
        welcomeSubtitle: dhWelcomeSubtitle,
        aboutBtnText: dhAboutBtnText,
        schemeBtnTitle: dhSchemeBtnTitle,
        whatsappBtnTitle: dhWhatsappBtnTitle,
        categorySectionTitle: dhCategorySectionTitle,
        shopForSectionTitle: dhShopForSectionTitle,
        footerTagline: dhFooterTagline,
      });
      setDhMsg('Hamburger menu dashboard settings updated and published live!');
      setTimeout(() => setDhMsg(''), 4000);
    }
  };

  const handleSaveFooterConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateFooterConfig) {
      onUpdateFooterConfig({
        trustBadges: ftTrustBadges,
        brandTitle: ftBrandTitle,
        brandDescription: ftBrandDescription,
        officialStoreLabel: ftOfficialStoreLabel,
        collectionsTitle: ftCollectionsTitle,
        collectionsList: ftCollectionsList,
        customerCareTitle: ftCustomerCareTitle,
        tollFreeText: ftTollFreeText,
        careEmail: ftCareEmail,
        storeAddress: ftStoreAddress,
        schemeTitle: ftSchemeTitle,
        schemeDescription: ftSchemeDescription,
        schemeHighlightBox: ftSchemeHighlightBox,
        copyrightText: ftCopyrightText,
      });
      setFtMsg('Footer configuration settings updated and published live!');
      setTimeout(() => setFtMsg(''), 4000);
    }
  };

  const handleAddCollectionItem = () => {
    if (ftNewCollectionItem && ftNewCollectionItem.trim()) {
      setFtCollectionsList([...ftCollectionsList, ftNewCollectionItem.trim()]);
      setFtNewCollectionItem('');
    }
  };

  const handleRemoveCollectionItem = (index: number) => {
    setFtCollectionsList(ftCollectionsList.filter((_, idx) => idx !== index));
  };

  const handleUpdateTrustBadge = (index: number, field: keyof TrustBadge, value: string) => {
    const updated = [...ftTrustBadges];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: value };
      setFtTrustBadges(updated);
    }
  };

  const getNormalizedCategories = (): CategoryItem[] => {
    return customCategories.map((item, index) => {
      if (typeof item === 'string') {
        return {
          id: `cat-${index}-${item.toLowerCase().replace(/\s+/g, '-')}`,
          name: item,
          image: '',
          order: index + 1,
        };
      }
      return {
        ...item,
        order: item.order ?? index + 1,
      };
    });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const currentList = getNormalizedCategories();
    const newItem: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      image: newCatImage.trim(),
      order: currentList.length + 1,
    };

    onUpdateCategories([...currentList, newItem]);
    setCatMsg(`Category "${newCatName.trim()}" added successfully!`);
    setNewCatName('');
    setNewCatImage('');
    setTimeout(() => setCatMsg(''), 3000);
  };

  const handleStartEditCategory = (item: CategoryItem) => {
    setEditingCatId(item.id);
    setEditCatName(item.name);
    setEditCatImage(item.image || '');
  };

  const handleSaveEditCategory = (id: string) => {
    if (!editCatName.trim()) return;
    const currentList = getNormalizedCategories();
    const updatedList = currentList.map((item) =>
      item.id === id ? { ...item, name: editCatName.trim(), image: editCatImage.trim() } : item
    );
    onUpdateCategories(updatedList);
    setEditingCatId(null);
    setCatMsg('Category updated successfully!');
    setTimeout(() => setCatMsg(''), 3000);
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const list = getNormalizedCategories();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // re-assign order
    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    onUpdateCategories(reordered);
  };

  const handleDeleteCategoryItem = (id: string) => {
    const list = getNormalizedCategories();
    if (list.length <= 1) {
      setCatMsg('Error: At least one category must remain.');
      setTimeout(() => setCatMsg(''), 3000);
      return;
    }
    const updatedList = list.filter((item) => item.id !== id);
    onUpdateCategories(updatedList);
    setCatMsg('Category deleted successfully!');
    setTimeout(() => setCatMsg(''), 3000);
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRates({
      gold24k: Number(gold24k),
      gold22k: Number(gold22k),
      gold18k: Number(gold18k),
      silver: Number(silver),
    });
    setRateMsg('Live gold & silver rates updated & synced across active devices!');
    setTimeout(() => setRateMsg(''), 4000);
  };

  const startEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setPTitle(prod.title);
    setPCategory(prod.category);
    setPPurity(prod.purity);
    setPWeight(prod.weightGrams.toString());
    setPMaking(prod.makingChargePercent.toString());
    setPImage(prod.image);
    setPGallery(prod.gallery ? prod.gallery.join(', ') : prod.image);
    setPGender(prod.gender || 'Women');
    setPDesc(prod.description);
    setPInStock(prod.inStock ?? true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const galleryUrls = pGallery
      ? pGallery.split(',').map((url) => url.trim()).filter(Boolean)
      : [pImage];

    const productPayload: Partial<Product> = {
      title: pTitle || 'Royal Kundan Gold Jewellery',
      category: pCategory,
      purity: pPurity,
      weightGrams: Number(pWeight) || 10,
      makingChargePercent: Number(pMaking) || 12,
      baseMakingCharge: 250,
      image: pImage,
      gallery: galleryUrls.length > 0 ? galleryUrls : [pImage],
      description: pDesc || 'Crafted with fine 22K BIS Hallmarked gold.',
      gender: pGender,
      collection: 'Bridal Royal',
      isNewArrival: true,
      isFeatured: true,
      inStock: pInStock,
      hallmarkCertified: true,
    };

    if (editingProductId) {
      productPayload.id = editingProductId;
    }

    onAddProduct(productPayload);
    setPSuccessMsg(editingProductId ? 'Product details updated successfully!' : 'New product added with gallery pictures to catalog!');
    setEditingProductId(null);
    setPTitle('');
    setPWeight('12.5');
    setPMaking('12');
    setPGallery('');
    setPDesc('Certified BIS Hallmarked handcrafted luxury gold ornament.');
    setPInStock(true);
    setTimeout(() => setPSuccessMsg(''), 4000);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle || !bImage) return;

    onAddBanner({
      id: `b-${Date.now()}`,
      title: bTitle,
      subtitle: bSubtitle || 'Exclusive Festival Offer',
      image: bImage,
      imageUrl: bImage,
      discountBadge: bTag || 'SPECIAL OFFER',
      discountTag: bTag || 'SPECIAL OFFER',
      ctaText: bCta || 'Explore Collection',
      categoryLink: 'Gold',
    });

    setBSuccessMsg('New advertisement banner published!');
    setBTitle('');
    setBSubtitle('');
    setBImage('');
    setBTag('');
    setBCta('');
    setTimeout(() => setBSuccessMsg(''), 4000);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    onBroadcastVersionUpdate(versionNum, versionMsg);
    setVersionSuccess(`Version ${versionNum} update broadcasted to all live user devices!`);
    setTimeout(() => setVersionSuccess(''), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className={`relative max-w-3xl w-full rounded-2xl border overflow-hidden shadow-2xl ${
          darkMode
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-[#FAF7F2] border-amber-200 text-amber-950'
        }`}
      >
        {/* Top Title Bar */}
        <div className="bg-gradient-to-r from-[#4A0E17] via-[#6B1423] to-[#4A0E17] p-4 text-[#D4AF37] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <div>
              <h3 className="text-sm font-bold font-serif">Shubham Jewellers Admin Control Panel</h3>
              <p className="text-[10px] text-amber-200">Real-Time Firestore & Database Management</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-[#D4AF37] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher - Flex wrap on desktop, scrollable + dropdown fallback on mobile */}
        <div className="border-b border-amber-200 dark:border-zinc-800 bg-amber-50/50 dark:bg-zinc-800/50 p-2 text-xs font-bold">
          {/* Mobile Select Dropdown */}
          <div className="sm:hidden mb-2">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="w-full p-2 text-xs font-bold rounded-lg border bg-white dark:bg-zinc-800 text-amber-950 dark:text-zinc-100"
            >
              <option value="rates">📈 Live Rates</option>
              <option value="products">➕ Product Catalog</option>
              <option value="banners">✨ Ad Banners</option>
              <option value="categories">🏷️ Category Partitions</option>
              <option value="about">🏢 Store & About Details</option>
              <option value="drawer">☰ Hamburger Menu</option>
              <option value="footer">🦶 Footer Config</option>
              <option value="version">📻 App Version Broadcast</option>
            </select>
          </div>

          {/* Desktop & Tablet Flex-Wrap Pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab('rates')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                activeTab === 'rates'
                  ? 'bg-[#4A0E17] text-[#D4AF37] shadow-sm'
                  : 'text-amber-900 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Live Rates</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                activeTab === 'products'
                  ? 'bg-[#4A0E17] text-[#D4AF37] shadow-sm'
                  : 'text-amber-900 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Product Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                activeTab === 'banners'
                  ? 'bg-[#4A0E17] text-[#D4AF37] shadow-sm'
                  : 'text-amber-900 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ad Banners</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                activeTab === 'categories'
                  ? 'bg-[#4A0E17] text-[#D4AF37] shadow-sm'
                  : 'text-amber-900 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                activeTab === 'about'
                  ? 'bg-[#4A0E17] text-[#D4AF37] shadow-sm'
                  : 'text-amber-900 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Store & About</span>
            </button>

            <button
              onClick={() => setActiveTab('drawer')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                activeTab === 'drawer'
                  ? 'bg-[#4A0E17] text-[#D4AF37] shadow-sm'
                  : 'text-amber-900 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Menu className="w-3.5 h-3.5" />
              <span>Hamburger Menu</span>
            </button>

            <button
              onClick={() => setActiveTab('footer')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                activeTab === 'footer'
                  ? 'bg-[#4A0E17] text-[#D4AF37] shadow-sm'
                  : 'text-amber-900 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Footer Config</span>
            </button>

            <button
              onClick={() => setActiveTab('version')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                activeTab === 'version'
                  ? 'bg-[#4A0E17] text-[#D4AF37] shadow-sm'
                  : 'text-amber-900 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>App Version</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: Live Daily Rates */}
          {activeTab === 'rates' && (
            <form onSubmit={handleSaveRates} className="space-y-4">
              <div className="p-3 bg-amber-100/60 dark:bg-zinc-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center space-x-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
                <span>
                  Updating rates here will instantly update prices in real-time across all user screens!
                </span>
              </div>

              {rateMsg && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{rateMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">24K Gold Rate (₹ / Gram)</label>
                  <input
                    type="number"
                    value={gold24k}
                    onChange={(e) => setGold24k(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border font-mono font-bold bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">22K Gold Rate (₹ / Gram)</label>
                  <input
                    type="number"
                    value={gold22k}
                    onChange={(e) => setGold22k(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border font-mono font-bold bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">18K Gold Rate (₹ / Gram)</label>
                  <input
                    type="number"
                    value={gold18k}
                    onChange={(e) => setGold18k(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border font-mono font-bold bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">999 Silver Rate (₹ / Gram)</label>
                  <input
                    type="number"
                    value={silver}
                    onChange={(e) => setSilver(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border font-mono font-bold bg-white dark:bg-zinc-800"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#D4AF37] text-[#4A0E17] font-bold text-xs rounded-xl hover:bg-amber-400 shadow"
              >
                Broadcast & Update Live Rates Now
              </button>
            </form>
          )}

          {/* TAB 2: Product Catalog */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveProduct} className="space-y-3 p-4 rounded-xl border bg-amber-50/50 dark:bg-zinc-800/40">
                <h4 className="text-xs font-bold text-[#4A0E17] dark:text-[#D4AF37] flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add New Jewellery Item
                </h4>

                {pSuccessMsg && (
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded text-xs font-bold">
                    {pSuccessMsg}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Product Title</label>
                    <input
                      type="text"
                      placeholder="Royal Gold Choker"
                      value={pTitle}
                      onChange={(e) => setPTitle(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Category Partition</label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800 font-bold"
                    >
                      {getNormalizedCategories().map((cat) => (
                        <option key={cat.id || cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Purity</label>
                    <select
                      value={pPurity}
                      onChange={(e) => setPPurity(e.target.value as any)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800"
                    >
                      <option value="22K">22K</option>
                      <option value="18K">18K</option>
                      <option value="24K">24K</option>
                      <option value="925 Silver">925 Silver</option>
                      <option value="999 Silver">999 Silver</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Weight in Grams</label>
                    <input
                      type="number"
                      step="0.1"
                      value={pWeight}
                      onChange={(e) => setPWeight(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Making Charge (%)</label>
                    <input
                      type="number"
                      value={pMaking}
                      onChange={(e) => setPMaking(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <ImageInputSelector
                      label="Primary Product Photo"
                      value={pImage}
                      onChange={setPImage}
                      placeholder="https://images.unsplash.com/photo-..."
                      required
                      darkMode={darkMode}
                      helpText="Select an image URL or choose a photo directly from your device gallery."
                    />
                  </div>

                  <div className="col-span-2">
                    <ImageInputSelector
                      label="Additional Product Gallery Photos"
                      value=""
                      onChange={() => {}}
                      multiple
                      galleryValues={pGallery ? pGallery.split(',').map((url) => url.trim()).filter(Boolean) : []}
                      onGalleryChange={(urls) => setPGallery(urls.join(','))}
                      darkMode={darkMode}
                      helpText="Add multiple photos for this product via URL link or by selecting photos from your gallery."
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-bold mb-1">Product Description (Admin Editable)</label>
                    <textarea
                      rows={2}
                      value={pDesc}
                      onChange={(e) => setPDesc(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800"
                      required
                    />
                  </div>

                  <div className="col-span-2 flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="pInStockCheck"
                      checked={pInStock}
                      onChange={(e) => setPInStock(e.target.checked)}
                      className="w-4 h-4 text-[#4A0E17] rounded border-amber-300 focus:ring-[#D4AF37]"
                    />
                    <label htmlFor="pInStockCheck" className="text-xs font-bold cursor-pointer">
                      In Stock & Available for Order
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#6B1423] transition-colors shadow-md"
                >
                  {editingProductId ? 'Update Product Details' : 'Save Product with Multiple Pictures to Catalog'}
                </button>
              </form>

              {/* Product List */}
              <div>
                <h4 className="text-xs font-bold mb-2">Active Catalog ({products.length} Items)</h4>
                <div className="space-y-2">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl border flex items-center justify-between text-xs bg-white dark:bg-zinc-800"
                    >
                      <div className="flex items-center space-x-2">
                        <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded-lg" />
                        <div>
                          <strong className="block">{p.title}</strong>
                          <span className="text-[10px] text-amber-800 dark:text-zinc-400">
                            {p.purity} • {p.weightGrams}g • {p.gallery?.length || 1} Images
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => startEditProduct(p)}
                          className="p-1.5 text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-zinc-700 rounded-lg"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-lg"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Advertisement Banners (Admin Only) */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              {/* Top Banners Form */}
              <form onSubmit={handleSaveBanner} className="space-y-3 p-4 rounded-xl border bg-amber-50/50 dark:bg-zinc-800/40">
                <h4 className="text-xs font-bold text-[#4A0E17] dark:text-[#D4AF37] flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Add & Publish Top Header Banner
                </h4>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  Ad banners appear at the top carousel on the main home page.
                </p>

                {bSuccessMsg && (
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{bSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Banner Headline Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Wedding Collection"
                      value={bTitle}
                      onChange={(e) => setBTitle(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Subtitle / Offer Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 25% Off Making Charges"
                      value={bSubtitle}
                      onChange={(e) => setBSubtitle(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800 font-medium"
                    />
                  </div>

                  <div className="col-span-2">
                    <ImageInputSelector
                      label="Banner Background Photo"
                      value={bImage}
                      onChange={setBImage}
                      placeholder="https://images.unsplash.com/photo-..."
                      required
                      darkMode={darkMode}
                      helpText="Select a banner image URL or upload a custom banner photo from your device gallery."
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Discount Badge Text</label>
                    <input
                      type="text"
                      placeholder="e.g. FESTIVAL SPECIAL"
                      value={bTag}
                      onChange={(e) => setBTag(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800 font-medium"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-bold mb-1">Button CTA Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Explore Gold Kundan"
                      value={bCta}
                      onChange={(e) => setBCta(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#6B1423]"
                >
                  Publish Header Banner Live
                </button>
              </form>

              {/* Active Header Banners List */}
              <div>
                <h4 className="text-xs font-bold mb-2">Active Header Banners ({banners.length})</h4>
                <div className="space-y-2">
                  {banners.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl border flex items-center justify-between text-xs bg-white dark:bg-zinc-800 border-amber-200 dark:border-zinc-700"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={b.imageUrl || b.image} alt={b.title} className="w-14 h-10 object-cover rounded-lg shrink-0" />
                        <div>
                          <strong className="block text-zinc-900 dark:text-zinc-100">{b.title}</strong>
                          <span className="text-[10px] text-amber-800 dark:text-amber-300 font-medium">
                            {b.discountTag || b.discountBadge || 'FESTIVAL'} • {b.subtitle}
                          </span>
                        </div>
                      </div>

                      {onDeleteBanner && (
                        <button
                          onClick={() => onDeleteBanner(b.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-lg shrink-0"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Main Banner Edit Section */}
              <form onSubmit={handleSaveBottomBanner} className="space-y-3 p-4 rounded-xl border bg-amber-50/50 dark:bg-zinc-800/60 border-amber-300 dark:border-amber-500/30">
                <h4 className="text-xs font-bold text-[#4A0E17] dark:text-[#D4AF37] flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Edit Bottom-Most Main Banner
                </h4>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  This banner appears at the very end of the home page before the footer. Update its title, description, badge, button, and background image.
                </p>

                {bbMsg && (
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{bbMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Banner Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Shubham Swarna Varsha Scheme"
                      value={bbTitle}
                      onChange={(e) => setBbTitle(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Exclusive Savings Scheme"
                      value={bbBadge}
                      onChange={(e) => setBbBadge(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800 font-medium"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-bold mb-1">Subtitle / Description</label>
                    <textarea
                      rows={2}
                      placeholder="Pay 10 Monthly Installments & Get 1 Month FREE Bonus on Pure Gold Jewellery"
                      value={bbSubtitle}
                      onChange={(e) => setBbSubtitle(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800 font-medium"
                    />
                  </div>

                  <div className="col-span-2">
                    <ImageInputSelector
                      label="Bottom Banner Image"
                      value={bbImage}
                      onChange={setBbImage}
                      placeholder="https://images.unsplash.com/photo-..."
                      required
                      darkMode={darkMode}
                      helpText="Select or upload background banner photo."
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-bold mb-1">Button Label (CTA)</label>
                    <input
                      type="text"
                      placeholder="e.g. Join Swarna Scheme Now"
                      value={bbCta}
                      onChange={(e) => setBbCta(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#4A0E17] text-[#D4AF37] font-extrabold text-xs rounded-xl hover:bg-[#6B1423] shadow-md transition-all"
                >
                  Save Bottom Banner
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Category Partitions (Admin Managed) */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Add Category Form */}
              <form onSubmit={handleAddCategory} className="space-y-3 p-4 rounded-xl border bg-amber-50/50 dark:bg-zinc-800/40">
                <h4 className="text-xs font-bold text-[#4A0E17] dark:text-[#D4AF37] flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Add Custom Category
                </h4>
                <p className="text-[11px] text-amber-900/80 dark:text-zinc-400">
                  Manage categories shown across the shop catalog and hamburger menu dashboard.
                </p>

                {catMsg && (
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{catMsg}</span>
                  </div>
                )}

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kundan, Antique, Mangalsutra, Solitaires"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full p-2 text-xs rounded border bg-white dark:bg-zinc-800 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <ImageInputSelector
                      label="Category Icon / Photo (Optional)"
                      value={newCatImage}
                      onChange={setNewCatImage}
                      placeholder="https://images.unsplash.com/photo-..."
                      darkMode={darkMode}
                      helpText="Image displayed in the Hamburger Menu Dashboard and Category bar."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#6B1423] shrink-0 shadow-sm"
                  >
                    Add Category Partition
                  </button>
                </div>
              </form>

              {/* Active Categories List */}
              <div>
                <h4 className="text-xs font-bold mb-2 text-amber-900 dark:text-amber-300 flex items-center justify-between">
                  <span>Active Categories ({getNormalizedCategories().length})</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Reorder, Edit, or Delete</span>
                </h4>

                <div className="space-y-2">
                  {getNormalizedCategories().map((catItem, idx, array) => (
                    <div
                      key={catItem.id}
                      className="p-3 rounded-xl border flex items-center justify-between text-xs bg-white dark:bg-zinc-800 border-amber-200 dark:border-zinc-700 shadow-xs"
                    >
                      {editingCatId === catItem.id ? (
                        <div className="flex-1 flex flex-col gap-2 mr-2">
                          <input
                            type="text"
                            value={editCatName}
                            onChange={(e) => setEditCatName(e.target.value)}
                            className="p-1.5 text-xs rounded border bg-zinc-50 dark:bg-zinc-900 font-bold"
                            placeholder="Category Name"
                          />
                          <input
                            type="text"
                            value={editCatImage}
                            onChange={(e) => setEditCatImage(e.target.value)}
                            className="p-1.5 text-[11px] rounded border bg-zinc-50 dark:bg-zinc-900 font-mono"
                            placeholder="Image URL"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEditCategory(catItem.id)}
                              className="px-3 py-1 bg-emerald-600 text-white font-bold text-[11px] rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCatId(null)}
                              className="px-3 py-1 bg-zinc-300 dark:bg-zinc-700 font-bold text-[11px] rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3 truncate flex-1">
                          {catItem.image ? (
                            <img
                              src={catItem.image}
                              alt={catItem.name}
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full object-cover border border-amber-300 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-zinc-700 flex items-center justify-center text-amber-900 dark:text-amber-300 font-bold shrink-0">
                              {catItem.name.charAt(0)}
                            </div>
                          )}
                          <div className="truncate">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 block truncate">
                              {catItem.name}
                            </span>
                            <span className="text-[10px] text-zinc-500">Order #{catItem.order}</span>
                          </div>
                        </div>
                      )}

                      {editingCatId !== catItem.id && (
                        <div className="flex items-center space-x-1 shrink-0 ml-2">
                          <button
                            onClick={() => handleMoveCategory(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveCategory(idx, 'down')}
                            disabled={idx === array.length - 1}
                            className="p-1 text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleStartEditCategory(catItem)}
                            className="p-1 text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-zinc-700 rounded"
                            title="Edit Category"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategoryItem(catItem.id)}
                            className="p-1 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Store & Company Details (Editable About Us) */}
          {activeTab === 'about' && (
            <form onSubmit={handleSaveCompanyInfo} autoComplete="off" className="space-y-4">
              <div className="p-3 bg-amber-100/60 dark:bg-zinc-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#4A0E17] dark:text-[#D4AF37] shrink-0" />
                <span>
                  Update company information, store address, phone numbers, and WhatsApp contact displayed in the "About Us" section.
                </span>
              </div>

              {infoMsg && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-bold flex items-center space-x-2 ${
                    infoMsg.startsWith('Error:')
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{infoMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="sj_admin_store_phone_no_autofill"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">WhatsApp Number (e.g. +91XXXXXXXXXX)</label>
                  <input
                    type="text"
                    name="sj_admin_store_whatsapp_no_autofill"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={cWhatsapp}
                    onChange={(e) => setCWhatsapp(e.target.value)}
                    placeholder="+919987074158"
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Showroom Business Hours</label>
                  <input
                    type="text"
                    name="sj_admin_store_hours_no_autofill"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={cHours}
                    onChange={(e) => setCHours(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">BIS Hallmark Registration No.</label>
                  <input
                    type="text"
                    name="sj_admin_store_hallmark_no_autofill"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={cHallmark}
                    onChange={(e) => setCHallmark(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Showroom Address</label>
                <input
                  type="text"
                  name="sj_admin_store_address_no_autofill"
                  autoComplete="off"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  value={cAddress}
                  onChange={(e) => setCAddress(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">About Us Heritage Story</label>
                <textarea
                  rows={4}
                  name="sj_admin_store_about_no_autofill"
                  autoComplete="off"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  value={cAboutText}
                  onChange={(e) => setCAboutText(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#6B1423] shadow"
              >
                Save & Publish Company Details Live
              </button>
            </form>
          )}

          {/* TAB 5: Hamburger Drawer Dashboard Config */}
          {activeTab === 'drawer' && (
            <form onSubmit={handleSaveDrawerConfig} autoComplete="off" className="space-y-4">
              <div className="p-3 bg-amber-100/60 dark:bg-zinc-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center space-x-2">
                <Menu className="w-4 h-4 text-[#4A0E17] dark:text-[#D4AF37] shrink-0" />
                <span>
                  Customize all section headers, button titles, and taglines inside the Hamburger side drawer dashboard.
                </span>
              </div>

              {dhMsg && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-lg text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{dhMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Header Title</label>
                  <input
                    type="text"
                    name="sj_dh_headertitle"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={dhHeaderTitle}
                    onChange={(e) => setDhHeaderTitle(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Welcome Subtitle (Logged Out)</label>
                  <input
                    type="text"
                    name="sj_dh_welcomesubtitle"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={dhWelcomeSubtitle}
                    onChange={(e) => setDhWelcomeSubtitle(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">About Us Button Text</label>
                  <input
                    type="text"
                    name="sj_dh_aboutbtntext"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={dhAboutBtnText}
                    onChange={(e) => setDhAboutBtnText(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Jewellery Savings Plan Button Title</label>
                  <input
                    type="text"
                    name="sj_dh_schemebtntitle"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={dhSchemeBtnTitle}
                    onChange={(e) => setDhSchemeBtnTitle(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">WhatsApp Support Button Title</label>
                  <input
                    type="text"
                    name="sj_dh_whatsappbtntitle"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={dhWhatsappBtnTitle}
                    onChange={(e) => setDhWhatsappBtnTitle(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Category Section Title</label>
                  <input
                    type="text"
                    name="sj_dh_categorysectiontitle"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={dhCategorySectionTitle}
                    onChange={(e) => setDhCategorySectionTitle(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Shop For Section Title</label>
                  <input
                    type="text"
                    name="sj_dh_shopforsectiontitle"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={dhShopForSectionTitle}
                    onChange={(e) => setDhShopForSectionTitle(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Drawer Footer Tagline</label>
                  <input
                    type="text"
                    name="sj_dh_footertagline"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={dhFooterTagline}
                    onChange={(e) => setDhFooterTagline(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#6B1423] shadow"
              >
                Save & Publish Hamburger Menu Dashboard Settings Live
              </button>
            </form>
          )}

          {/* TAB 6: Footer Configuration */}
          {activeTab === 'footer' && (
            <form onSubmit={handleSaveFooterConfig} autoComplete="off" className="space-y-5 text-xs">
              <div className="p-3 bg-amber-100/60 dark:bg-zinc-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center space-x-2">
                <Layout className="w-4 h-4 text-[#4A0E17] dark:text-[#D4AF37] shrink-0" />
                <span>
                  Customize all guarantee badges, brand story, categories list, customer care details, scheme blurb, and copyright line displayed in the Footer.
                </span>
              </div>

              {ftMsg && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-lg text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{ftMsg}</span>
                </div>
              )}

              {/* 1. Trust / Guarantee Badges */}
              <div className="p-3 border border-amber-200 dark:border-zinc-800 rounded-xl bg-amber-50/40 dark:bg-zinc-800/40 space-y-3">
                <h4 className="font-bold text-[#4A0E17] dark:text-[#D4AF37] text-sm uppercase tracking-wider">
                  1. Guarantee / Trust Badges (4 Badges)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ftTrustBadges.map((badge, idx) => (
                    <div key={idx} className="p-2.5 border rounded-lg bg-white dark:bg-zinc-800 space-y-2">
                      <div className="font-bold text-amber-900 dark:text-amber-300 text-[11px]">
                        Badge #{idx + 1}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold mb-0.5">Title</label>
                        <input
                          type="text"
                          name={`sj_ft_badge_title_${idx}`}
                          autoComplete="off"
                          readOnly
                          onFocus={(e) => e.target.removeAttribute('readonly')}
                          value={badge.title}
                          onChange={(e) => handleUpdateTrustBadge(idx, 'title', e.target.value)}
                          className="w-full p-1.5 text-xs rounded border bg-amber-50/30 dark:bg-zinc-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold mb-0.5">Subtitle / Subtext</label>
                        <input
                          type="text"
                          name={`sj_ft_badge_subtitle_${idx}`}
                          autoComplete="off"
                          readOnly
                          onFocus={(e) => e.target.removeAttribute('readonly')}
                          value={badge.subtitle}
                          onChange={(e) => handleUpdateTrustBadge(idx, 'subtitle', e.target.value)}
                          className="w-full p-1.5 text-xs rounded border bg-amber-50/30 dark:bg-zinc-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold mb-0.5">Icon Style</label>
                        <select
                          value={badge.icon || 'Award'}
                          onChange={(e) => handleUpdateTrustBadge(idx, 'icon', e.target.value)}
                          className="w-full p-1.5 text-xs rounded border bg-amber-50/30 dark:bg-zinc-900"
                        >
                          <option value="Award">Award (Ribbon Medal)</option>
                          <option value="ShieldCheck">ShieldCheck (Security Badge)</option>
                          <option value="RotateCcw">RotateCcw (Exchange Arrow)</option>
                          <option value="Truck">Truck (Shipping Vehicle)</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Brand Section */}
              <div className="p-3 border border-amber-200 dark:border-zinc-800 rounded-xl bg-amber-50/40 dark:bg-zinc-800/40 space-y-3">
                <h4 className="font-bold text-[#4A0E17] dark:text-[#D4AF37] text-sm uppercase tracking-wider">
                  2. Brand Info & Story
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Brand Title</label>
                    <input
                      type="text"
                      name="sj_ft_brand_title"
                      autoComplete="off"
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readonly')}
                      value={ftBrandTitle}
                      onChange={(e) => setFtBrandTitle(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800 font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Official Store Badge Text</label>
                    <input
                      type="text"
                      name="sj_ft_official_label"
                      autoComplete="off"
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readonly')}
                      value={ftOfficialStoreLabel}
                      onChange={(e) => setFtOfficialStoreLabel(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-1">Brand Description Paragraph</label>
                  <textarea
                    rows={3}
                    name="sj_ft_brand_desc"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={ftBrandDescription}
                    onChange={(e) => setFtBrandDescription(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>
              </div>

              {/* 3. Collections & Categories List */}
              <div className="p-3 border border-amber-200 dark:border-zinc-800 rounded-xl bg-amber-50/40 dark:bg-zinc-800/40 space-y-3">
                <h4 className="font-bold text-[#4A0E17] dark:text-[#D4AF37] text-sm uppercase tracking-wider">
                  3. Collections & Categories List
                </h4>
                <div>
                  <label className="block font-bold mb-1">Section Header Title</label>
                  <input
                    type="text"
                    name="sj_ft_collections_title"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={ftCollectionsTitle}
                    onChange={(e) => setFtCollectionsTitle(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-bold">List Items ({ftCollectionsList.length})</label>
                  <div className="space-y-1.5">
                    {ftCollectionsList.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2 bg-white dark:bg-zinc-800 p-2 rounded-lg border">
                        <span className="text-amber-800 dark:text-amber-400 font-bold shrink-0">{idx + 1}.</span>
                        <input
                          type="text"
                          name={`sj_ft_coll_item_${idx}`}
                          autoComplete="off"
                          readOnly
                          onFocus={(e) => e.target.removeAttribute('readonly')}
                          value={item}
                          onChange={(e) => {
                            const updated = [...ftCollectionsList];
                            updated[idx] = e.target.value;
                            setFtCollectionsList(updated);
                          }}
                          className="w-full text-xs bg-transparent border-none focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCollectionItem(idx)}
                          className="text-red-500 hover:text-red-700 p-1 shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="text"
                      name="sj_ft_new_coll_item"
                      autoComplete="off"
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readonly')}
                      value={ftNewCollectionItem}
                      onChange={(e) => setFtNewCollectionItem(e.target.value)}
                      placeholder="Add new collection line (e.g. Kundan Choker Sets)"
                      className="flex-1 p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddCollectionItem}
                      className="px-3 py-2 bg-amber-800 text-amber-100 font-bold text-xs rounded-lg hover:bg-amber-900 flex items-center space-x-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Customer Care & Store Details */}
              <div className="p-3 border border-amber-200 dark:border-zinc-800 rounded-xl bg-amber-50/40 dark:bg-zinc-800/40 space-y-3">
                <h4 className="font-bold text-[#4A0E17] dark:text-[#D4AF37] text-sm uppercase tracking-wider">
                  4. Customer Care & Store Info
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Section Header Title</label>
                    <input
                      type="text"
                      name="sj_ft_care_title"
                      autoComplete="off"
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readonly')}
                      value={ftCustomerCareTitle}
                      onChange={(e) => setFtCustomerCareTitle(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Toll-Free Phone Line</label>
                    <input
                      type="text"
                      name="sj_ft_toll_free"
                      autoComplete="off"
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readonly')}
                      value={ftTollFreeText}
                      onChange={(e) => setFtTollFreeText(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Customer Care Email</label>
                    <input
                      type="text"
                      name="sj_ft_care_email"
                      autoComplete="off"
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readonly')}
                      value={ftCareEmail}
                      onChange={(e) => setFtCareEmail(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Store Address Line</label>
                    <input
                      type="text"
                      name="sj_ft_store_addr"
                      autoComplete="off"
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readonly')}
                      value={ftStoreAddress}
                      onChange={(e) => setFtStoreAddress(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 5. Swarna Scheme & Copyright */}
              <div className="p-3 border border-amber-200 dark:border-zinc-800 rounded-xl bg-amber-50/40 dark:bg-zinc-800/40 space-y-3">
                <h4 className="font-bold text-[#4A0E17] dark:text-[#D4AF37] text-sm uppercase tracking-wider">
                  5. Gold Scheme Blurb & Bottom Copyright Line
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Scheme Section Title</label>
                    <input
                      type="text"
                      name="sj_ft_scheme_title"
                      autoComplete="off"
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readonly')}
                      value={ftSchemeTitle}
                      onChange={(e) => setFtSchemeTitle(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Scheme Highlight Box Badge</label>
                    <input
                      type="text"
                      name="sj_ft_scheme_highlight"
                      autoComplete="off"
                      readOnly
                      onFocus={(e) => e.target.removeAttribute('readonly')}
                      value={ftSchemeHighlightBox}
                      onChange={(e) => setFtSchemeHighlightBox(e.target.value)}
                      className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold mb-1">Scheme Blurb Description</label>
                  <textarea
                    rows={2}
                    name="sj_ft_scheme_desc"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={ftSchemeDescription}
                    onChange={(e) => setFtSchemeDescription(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Copyright Line (Bottom-most bar)</label>
                  <input
                    type="text"
                    name="sj_ft_copyright"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    value={ftCopyrightText}
                    onChange={(e) => setFtCopyrightText(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#6B1423] shadow"
              >
                Save & Publish Footer Configuration Live
              </button>
            </form>
          )}

          {/* TAB 5: Version Broadcast (In-App Notifier trigger) */}
          {activeTab === 'version' && (
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 text-indigo-900 dark:text-indigo-200 rounded-xl text-xs">
                <strong>In-App App Update Broadcast:</strong> Triggers a pop-up on active user devices announcing a new app update.
              </div>

              {versionSuccess && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{versionSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold mb-1">New Version Number</label>
                <input
                  type="text"
                  value={versionNum}
                  onChange={(e) => setVersionNum(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border font-mono bg-white dark:bg-zinc-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Broadcast Update Message</label>
                <textarea
                  rows={3}
                  value={versionMsg}
                  onChange={(e) => setVersionMsg(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#6B1423] shadow"
              >
                Trigger In-App Update Pop-Up on All User Devices
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
