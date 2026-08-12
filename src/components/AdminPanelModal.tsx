import React, { useState } from 'react';
import { GoldRates, Product, Banner, AppVersionInfo, CompanyInfo } from '../types';
import { X, Settings, TrendingUp, Plus, Trash2, Edit, Radio, Sparkles, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

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
  onBroadcastVersionUpdate: (version: string, msg: string) => void;
  darkMode: boolean;
  customCategories: string[];
  onAddCategory: (catName: string) => void;
  onDeleteCategory: (catName: string) => void;
  companyInfo: CompanyInfo;
  onUpdateCompanyInfo: (info: Partial<CompanyInfo>) => void;
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
  onBroadcastVersionUpdate,
  darkMode,
  customCategories,
  onAddCategory,
  onDeleteCategory,
  companyInfo,
  onUpdateCompanyInfo,
}) => {
  const [activeTab, setActiveTab] = useState<'rates' | 'products' | 'banners' | 'categories' | 'about' | 'version'>('rates');

  // Rates Form
  const [gold24k, setGold24k] = useState(rates.gold24k.toString());
  const [gold22k, setGold22k] = useState(rates.gold22k.toString());
  const [gold18k, setGold18k] = useState(rates.gold18k.toString());
  const [silver, setSilver] = useState(rates.silver.toString());
  const [rateMsg, setRateMsg] = useState('');

  // Category Partition Form
  const [newCatName, setNewCatName] = useState('');
  const [catMsg, setCatMsg] = useState('');

  // Product Form
  const [pTitle, setPTitle] = useState('');
  const [pCategory, setPCategory] = useState<string>('Gold');
  const [pPurity, setPPurity] = useState<'24K' | '22K' | '18K' | '925 Silver' | '999 Silver'>('22K');
  const [pWeight, setPWeight] = useState('12.5');
  const [pMaking, setPMaking] = useState('12');
  const [pImage, setPImage] = useState('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80');
  const [pGallery, setPGallery] = useState('');
  const [pGender, setPGender] = useState<'Women' | 'Men' | 'Unisex' | 'Kids'>('Women');
  const [pDesc, setPDesc] = useState('Certified BIS Hallmarked handcrafted luxury gold ornament.');
  const [pSuccessMsg, setPSuccessMsg] = useState('');

  // Banner Form
  const [bTitle, setBTitle] = useState('');
  const [bSubtitle, setBSubtitle] = useState('');
  const [bImage, setBImage] = useState('');
  const [bTag, setBTag] = useState('');
  const [bCta, setBCta] = useState('');
  const [bSuccessMsg, setBSuccessMsg] = useState('');

  // Company Info Form State
  const [cAddress, setCAddress] = useState(companyInfo.address);
  const [cPhone, setCPhone] = useState(companyInfo.phone);
  const [cWhatsapp, setCWhatsapp] = useState(companyInfo.whatsappNumber);
  const [cHours, setCHours] = useState(companyInfo.storeHours);
  const [cHallmark, setCHallmark] = useState(companyInfo.bisHallmarkReg);
  const [cAboutText, setCAboutText] = useState(companyInfo.aboutText);
  const [infoMsg, setInfoMsg] = useState('');

  // Version Broadcast Form
  const [versionNum, setVersionNum] = useState('2.1.0');
  const [versionMsg, setVersionMsg] = useState('A new version of Shubham Jewellers is available with live rate alerts and zero data loss account sync!');
  const [versionSuccess, setVersionSuccess] = useState('');

  if (!isOpen) return null;

  const handleSaveCompanyInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompanyInfo({
      address: cAddress,
      phone: cPhone,
      whatsappNumber: cWhatsapp,
      storeHours: cHours,
      bisHallmarkReg: cHallmark,
      aboutText: cAboutText,
    });
    setInfoMsg('Company details & About Us section updated live!');
    setTimeout(() => setInfoMsg(''), 4000);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim());
    setCatMsg(`Category "${newCatName.trim()}" added successfully!`);
    setNewCatName('');
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

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const galleryUrls = pGallery
      ? pGallery.split(',').map((url) => url.trim()).filter(Boolean)
      : [pImage];

    onAddProduct({
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
      inStock: true,
      hallmarkCertified: true,
    });
    setPSuccessMsg('New product added with gallery pictures to catalog!');
    setPTitle('');
    setPGallery('');
    setTimeout(() => setPSuccessMsg(''), 4000);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle || !bImage) return;

    onAddBanner({
      id: `b-${Date.now()}`,
      title: bTitle,
      subtitle: bSubtitle || 'Exclusive Festival Offer',
      imageUrl: bImage,
      discountTag: bTag || 'SPECIAL OFFER',
      ctaText: bCta || 'Explore Collection',
      category: 'All',
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

        {/* Tab Switcher */}
        <div className="flex border-b border-amber-200 dark:border-zinc-800 bg-amber-50/50 dark:bg-zinc-800/50 p-2 text-xs font-bold gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors whitespace-nowrap ${
              activeTab === 'rates'
                ? 'bg-[#4A0E17] text-[#D4AF37]'
                : 'text-amber-900 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Live Rates</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#4A0E17] text-[#D4AF37]'
                : 'text-amber-900 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Product Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors whitespace-nowrap ${
              activeTab === 'banners'
                ? 'bg-[#4A0E17] text-[#D4AF37]'
                : 'text-amber-900 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ad Banners</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-[#4A0E17] text-[#D4AF37]'
                : 'text-amber-900 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Category Partitions</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors whitespace-nowrap ${
              activeTab === 'about'
                ? 'bg-[#4A0E17] text-[#D4AF37]'
                : 'text-amber-900 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Store & About Details</span>
          </button>

          <button
            onClick={() => setActiveTab('version')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors whitespace-nowrap ${
              activeTab === 'version'
                ? 'bg-[#4A0E17] text-[#D4AF37]'
                : 'text-amber-900 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-zinc-700'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>App Version Broadcast</span>
          </button>
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
                      {customCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
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

                  <div>
                    <label className="block font-bold mb-1">Primary Image URL</label>
                    <input
                      type="url"
                      value={pImage}
                      onChange={(e) => setPImage(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-bold mb-1">Additional Gallery Picture URLs (Comma-Separated)</label>
                    <input
                      type="text"
                      placeholder="https://image1.jpg, https://image2.jpg, https://image3.jpg"
                      value={pGallery}
                      onChange={(e) => setPGallery(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800"
                    />
                    <p className="text-[10px] text-zinc-500 mt-0.5">Admin can add multiple pictures for 1 product so customers can swipe through them.</p>
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
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#6B1423]"
                >
                  Save Product with Multiple Pictures to Catalog
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

                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Advertisement Banners (Admin Only) */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveBanner} className="space-y-3 p-4 rounded-xl border bg-amber-50/50 dark:bg-zinc-800/40">
                <h4 className="text-xs font-bold text-[#4A0E17] dark:text-[#D4AF37] flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Add & Publish Advertisement Banner
                </h4>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  Ad banners are editable exclusively by the Admin and appear at the top of the main shop page.
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
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800"
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
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Banner Background Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={bImage}
                      onChange={(e) => setBImage(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Discount Badge Text</label>
                    <input
                      type="text"
                      placeholder="e.g. FESTIVAL SPECIAL"
                      value={bTag}
                      onChange={(e) => setBTag(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-bold mb-1">Button CTA Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Explore Gold Kundan"
                      value={bCta}
                      onChange={(e) => setBCta(e.target.value)}
                      className="w-full p-2 rounded border bg-white dark:bg-zinc-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded-xl hover:bg-[#6B1423]"
                >
                  Publish Advertisement Banner Live
                </button>
              </form>

              {/* Active Banners List */}
              <div>
                <h4 className="text-xs font-bold mb-2">Active Ad Banners ({banners.length})</h4>
                <div className="space-y-2">
                  {banners.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl border flex items-center justify-between text-xs bg-white dark:bg-zinc-800 border-amber-200 dark:border-zinc-700"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={b.imageUrl} alt={b.title} className="w-14 h-10 object-cover rounded-lg shrink-0" />
                        <div>
                          <strong className="block text-zinc-900 dark:text-zinc-100">{b.title}</strong>
                          <span className="text-[10px] text-amber-800 dark:text-amber-300 font-medium">
                            {b.discountTag || 'FESTIVAL'} • {b.subtitle}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Category Partitions (Admin Managed) */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveCategory} className="space-y-3 p-4 rounded-xl border bg-amber-50/50 dark:bg-zinc-800/40">
                <h4 className="text-xs font-bold text-[#4A0E17] dark:text-[#D4AF37] flex items-center gap-1">
                  <Sparkles className="w-4 h-4" /> Create Custom Category Partition
                </h4>
                <p className="text-[11px] text-amber-900/80 dark:text-zinc-400">
                  Organize your shop catalog into custom categories (e.g. Kundan, Bridal, Mangalsutra, Solitaires).
                </p>

                {catMsg && (
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{catMsg}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Kundan, Antique, Mangalsutra, Solitaires"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 p-2 text-xs rounded border bg-white dark:bg-zinc-800 font-medium"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4A0E17] text-[#D4AF37] font-bold text-xs rounded hover:bg-[#6B1423] shrink-0"
                  >
                    Add Category
                  </button>
                </div>
              </form>

              {/* Active Category Partitions List */}
              <div>
                <h4 className="text-xs font-bold mb-2 text-amber-900 dark:text-amber-300">
                  Active Category Partitions ({customCategories.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {customCategories.map((cat) => (
                    <div
                      key={cat}
                      className="p-3 rounded-xl border flex items-center justify-between text-xs bg-white dark:bg-zinc-800 font-bold border-amber-200 dark:border-zinc-700 shadow-sm"
                    >
                      <span className="truncate">{cat}</span>
                      {/* Don't delete core defaults if only 1 left */}
                      {customCategories.length > 1 && (
                        <button
                          onClick={() => onDeleteCategory(cat)}
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg shrink-0 ml-1"
                          title="Delete Category Partition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Store & Company Details (Editable About Us) */}
          {activeTab === 'about' && (
            <form onSubmit={handleSaveCompanyInfo} className="space-y-4">
              <div className="p-3 bg-amber-100/60 dark:bg-zinc-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#4A0E17] dark:text-[#D4AF37] shrink-0" />
                <span>
                  Update company information, store address, phone numbers, and WhatsApp contact displayed in the "About Us" section.
                </span>
              </div>

              {infoMsg && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{infoMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">WhatsApp Number (10 Digits)</label>
                  <input
                    type="text"
                    value={cWhatsapp}
                    onChange={(e) => setCWhatsapp(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-zinc-800"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Showroom Business Hours</label>
                  <input
                    type="text"
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
