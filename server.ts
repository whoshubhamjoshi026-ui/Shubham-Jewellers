import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initialGoldRates, initialBanners, initialBottomBanner, initialCategoryItems, initialProducts, initialVersionInfo, initialCompanyInfo, initialDrawerConfig, initialFooterConfig } from './src/data/initialData.js';
import { GoldRates, Banner, BottomBanner, CategoryItem, Product, AppVersionInfo, GoldScheme, CompanyInfo, UserSyncedData, DrawerConfig, FooterConfig } from './src/types.js';

// Works in both ESM (local dev via tsx) and the CJS bundle esbuild produces for
// production (`--format=cjs`). In CJS, __dirname/__filename are already provided
// natively by the module wrapper, so import.meta.url is never evaluated there —
// which matters because import.meta.url is undefined once esbuild bundles to CJS.
declare const __dirname: string | undefined;
function resolveDirname(): string {
  if (typeof __dirname !== 'undefined') return __dirname;
  return path.dirname(fileURLToPath(import.meta.url));
}

const resolvedDirname = resolveDirname();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = process.env.HOST || '0.0.0.0';
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // Allow CORS from mobile apps (capacitor://, file://, localhost) and web clients
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Increase payload limit to 50mb to support base64 product photo uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Setup JSON Persistence Directory (writable location for production)
  // ✅ FIXED: DATA_DIR is now configurable via the DATA_DIR environment variable.
  // On Render's free tier the filesystem is EPHEMERAL — anything written to
  // process.cwd()/data is wiped on every restart/redeploy, which is why admin
  // edits (banners, About Us, products, etc.) were reverting to defaults.
  // To fix this permanently: attach a Render "Persistent Disk" to this service,
  // set its Mount Path (e.g. /var/data), and set an environment variable
  // DATA_DIR=/var/data in the Render dashboard. If DATA_DIR is not set, it
  // falls back to the old behavior (process.cwd()/data) so local dev still works.
  const DATA_DIR = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(process.cwd(), 'data');

  const usingPersistentDisk = !!process.env.DATA_DIR;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('[Persistence Error] Failed to create data directory:', err);
  }

  if (!usingPersistentDisk) {
    console.warn(
      '\n⚠️  WARNING: DATA_DIR environment variable is NOT set.\n' +
      '   Data is being saved to a local folder that may be WIPED on the next\n' +
      '   deploy/restart (this is normal on Render\'s free tier without a Disk).\n' +
      '   To make admin changes (banners, products, About Us, etc.) permanent:\n' +
      '   1. In Render Dashboard → your service → "Disks" → Add Disk\n' +
      '   2. Set a Mount Path, e.g. /var/data\n' +
      '   3. Add an environment variable: DATA_DIR=/var/data\n' +
      '   4. Redeploy.\n'
    );
  }

  // Safe file loader helper
  function loadData<T>(filename: string, defaultValue: T): T {
    const filePath = path.join(DATA_DIR, filename);
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent) as T;
      }
    } catch (err) {
      console.error(`[Persistence Error] Failed to read ${filename}, fallback to default:`, err);
    }
    // Write default value if missing or corrupted
    saveData(filename, defaultValue);
    return defaultValue;
  }

  // Safe file saver helper
  function saveData<T>(filename: string, data: T): void {
    const filePath = path.join(DATA_DIR, filename);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`[Persistence Error] Failed to save ${filename}:`, err);
    }
  }

  // Default initial scheme record
  const initialSchemes: Record<string, GoldScheme> = {
    'customer@gmail.com': {
      id: 'SCH-89123',
      email: 'customer@gmail.com',
      schemeName: 'Shubham Swarna Varsha Plan',
      monthlyInstallment: 5000,
      totalMonths: 11,
      monthsPaid: 4,
      totalPaid: 20000,
      bonusDiscount: 5000,
      nextDueDate: '15th Next Month',
      history: [
        { month: 1, amount: 5000, date: '2026-04-10', status: 'Paid', transactionId: 'TXN89123' },
        { month: 2, amount: 5000, date: '2026-05-12', status: 'Paid', transactionId: 'TXN89452' },
        { month: 3, amount: 5000, date: '2026-06-11', status: 'Paid', transactionId: 'TXN89981' },
        { month: 4, amount: 5000, date: '2026-07-15', status: 'Paid', transactionId: 'TXN90412' },
        { month: 5, amount: 5000, date: 'Pending', status: 'Pending' },
      ],
    },
  };

  // Default initial categories
  const initialCategories: string[] = [
    'Gold',
    'Diamond',
    'Silver',
    'Coins',
    'Solitaires',
    'Kundan & Antique',
    'Mangalsutra',
  ];

  // Load state from JSON files (or fallback & create defaults)
  let currentRates: GoldRates = loadData<GoldRates>('rates.json', { ...initialGoldRates });
  let currentBanners: Banner[] = loadData<Banner[]>('banners.json', [...initialBanners]);
  
  // Persistent product state handling
  const deletedProductIds: string[] = loadData<string[]>('deleted-products.json', []);
  let savedProducts: Product[] = loadData<Product[]>('products.json', []);

  if (savedProducts.length === 0) {
    savedProducts = [...initialProducts];
  } else {
    // Ensure any default product that has NOT been explicitly deleted and is missing from savedProducts is merged
    for (const initP of initialProducts) {
      if (!deletedProductIds.includes(initP.id) && !savedProducts.some((sp) => sp.id === initP.id)) {
        savedProducts.push(initP);
      }
    }
  }

  let currentProducts: Product[] = savedProducts.filter((p) => !deletedProductIds.includes(p.id));
  saveData('products.json', currentProducts);
  let currentCategories: any[] = loadData<any[]>('categories.json', [...initialCategoryItems]);
  let currentBottomBanner: BottomBanner = loadData<BottomBanner>('bottom-banner.json', { ...initialBottomBanner });
  let currentDrawerConfig: DrawerConfig = loadData<DrawerConfig>('drawer-config.json', { ...initialDrawerConfig });
  let currentFooterConfig: FooterConfig = loadData<FooterConfig>('footer-config.json', { ...initialFooterConfig });
  let currentVersion: AppVersionInfo = loadData<AppVersionInfo>('version.json', { ...initialVersionInfo });
  let currentCompanyInfo: CompanyInfo = loadData<CompanyInfo>('company-info.json', { ...initialCompanyInfo });
  const userDataStore: Record<string, UserSyncedData> = loadData<Record<string, UserSyncedData>>('user-data.json', {});
  const schemes: Record<string, GoldScheme> = loadData<Record<string, GoldScheme>>('schemes.json', initialSchemes);

  // Generated OTP cache
  const otpStore: Record<string, string> = {
    'customer@gmail.com': '7788',
  };

  // Connection-pooled Nodemailer Transporter (Singleton)
  let cachedTransporter: nodemailer.Transporter | null = null;

  function getEmailTransporter(user: string, pass: string): nodemailer.Transporter {
    if (!cachedTransporter) {
      cachedTransporter = nodemailer.createTransport({
        // ✅ FIXED: Use explicit host/port instead of the 'gmail' service shorthand,
        // and force IPv4 (`family: 4`). Render's outbound network could not route
        // Gmail's IPv6 SMTP address (2404:6800:...), causing every attempt to fail
        // with ENETUNREACH before timing out. Forcing IPv4 avoids that dead route.
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        family: 4,
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 1000,
        rateLimit: 5,
        auth: {
          user,
          pass,
        },
        connectionTimeout: 10000, // 10 second connection timeout for SMTP handshake
        socketTimeout: 10000,
      });
    }
    return cachedTransporter;
  }

  // Helper function to dispatch OTP via Email with connection pooling, direct API, and retries
  async function sendOtpViaEmail(email: string, otp: string, maxAttempts = 2): Promise<{ success: boolean; provider: string; error?: string; devOtp?: string }> {
    const gmailUser = process.env.GMAIL_USER?.trim();
    const gmailPass = process.env.GMAIL_APP_PASSWORD?.trim();
    const resendApiKey = process.env.RESEND_API_KEY?.trim();

    // Check if any email delivery credentials are configured
    if (!gmailUser && !gmailPass && !resendApiKey) {
      console.log(`[Email Service Notice] No SMTP credentials set. Verification OTP for ${email} is: ${otp}.`);
      return {
        success: true,
        provider: 'Instant On-Screen OTP (No SMTP credentials configured)',
        devOtp: otp,
      };
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #4A0E17; border-radius: 12px; background-color: #FAF6F0; text-align: center;">
        <h2 style="color: #4A0E17; font-family: 'Times New Roman', serif; margin-bottom: 4px;">SHUBHAM JEWELLERS</h2>
        <p style="color: #D4AF37; font-size: 13px; font-weight: bold; margin-top: 0; text-transform: uppercase; letter-spacing: 1px;">Royal Jewels & Fine Crafts</p>
        <hr style="border: none; border-top: 1px solid #D4AF37; margin: 20px 0;" />
        <p style="font-size: 14px; color: #333; margin-bottom: 24px;">Your 4-Digit One-Time Password (OTP) for account verification is:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4A0E17; background-color: #FFFFFF; border: 2px dashed #D4AF37; padding: 16px; border-radius: 8px; display: inline-block; margin-bottom: 24px;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #666; margin-bottom: 0;">This code is valid for 10 minutes. Please do not share this OTP with anyone.</p>
        <hr style="border: none; border-top: 1px dashed #CCC; margin: 20px 0;" />
        <p style="font-size: 10px; color: #999;">If you did not request this code, please ignore this email.</p>
      </div>
    `;

    let lastError = '';

    // 1. Try Resend Direct REST API if key is present
    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'Shubham Jewellers <onboarding@resend.dev>',
            to: [email],
            subject: 'Shubham Jewellers - Your Verification Code',
            html: htmlContent,
          }),
        });

        if (response.ok) {
          console.log(`[Resend API Success] Verification OTP sent to ${email}`);
          return { success: true, provider: 'Resend API' };
        } else {
          const errText = await response.text();
          lastError = `Resend error (${response.status}): ${errText}`;
        }
      } catch (resendErr: any) {
        lastError = `Resend dispatch failed: ${resendErr?.message}`;
      }
    }

    // 2. Try Pooled Gmail SMTP with auto-retry logic
    if (gmailUser && gmailPass) {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const transporter = getEmailTransporter(gmailUser, gmailPass);
          await transporter.sendMail({
            from: `"Shubham Jewellers" <${gmailUser}>`,
            to: email,
            subject: 'Shubham Jewellers - Your Verification Code',
            html: htmlContent,
          });

          console.log(`[Gmail SMTP Success] Verification OTP sent to ${email} (Attempt ${attempt})`);
          return { success: true, provider: 'Gmail SMTP' };
        } catch (err: any) {
          lastError = `Gmail SMTP error: ${err?.message || err}`;
          console.error(`[Gmail SMTP Error] Attempt ${attempt}/${maxAttempts} failed for ${email}:`, lastError);
          cachedTransporter = null;
          if (attempt < maxAttempts) {
            await new Promise((res) => setTimeout(res, 500));
          }
        }
      }
    }

    // Fallback: If live delivery failed due to missing/invalid SMTP credentials or network egress restrictions,
    // still return success with the devOtp so the user is never blocked!
    console.log(`[Email Fallback Notice] Verification OTP for ${email} is: ${otp}. Reason: ${lastError || 'No SMTP setup'}`);
    return {
      success: true,
      provider: 'Instant OTP Fallback',
      devOtp: otp,
      error: lastError,
    };
  }

  // ✅ HEALTH CHECK ENDPOINT (for Render monitoring)
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      uptime: process.uptime(),
      persistentDisk: usingPersistentDisk,
      dataDir: DATA_DIR,
    });
  });

  // API Routes
  // 1. Live Gold Rates
  app.get('/api/rates', (req, res) => {
    res.json({ success: true, rates: currentRates });
  });

  app.post('/api/admin/rates', (req, res) => {
    const { gold24k, gold22k, gold18k, silver } = req.body;
    if (gold24k) currentRates.gold24k = Number(gold24k);
    if (gold22k) currentRates.gold22k = Number(gold22k);
    if (gold18k) currentRates.gold18k = Number(gold18k);
    if (silver) currentRates.silver = Number(silver);
    currentRates.lastUpdated = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    saveData('rates.json', currentRates);
    res.json({ success: true, rates: currentRates, message: 'Live gold & silver rates updated successfully!' });
  });

  // 2. Products Catalog
  app.get('/api/products', (req, res) => {
    res.json({ success: true, products: currentProducts });
  });

  app.post('/api/admin/products', (req, res) => {
    const productData = req.body as Partial<Product>;
    if (productData.id) {
      // Update existing product
      const index = currentProducts.findIndex((p) => p.id === productData.id);
      if (index !== -1) {
        currentProducts[index] = { ...currentProducts[index], ...productData } as Product;
      } else {
        // If product ID didn't exist in currentProducts array, add as new product
        const newProduct: Product = {
          id: productData.id,
          title: productData.title || 'New Royal Gold Jewellery',
          category: productData.category || 'Gold',
          purity: productData.purity || '22K',
          weightGrams: Number(productData.weightGrams) || 10,
          makingChargePercent: Number(productData.makingChargePercent) || 12,
          baseMakingCharge: Number(productData.baseMakingCharge) || 250,
          image: productData.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
          gallery: productData.gallery && productData.gallery.length > 0 ? productData.gallery : [productData.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
          description: productData.description || 'Authentic BIS Hallmarked Gold piece.',
          gender: productData.gender || 'Women',
          collection: productData.collection || 'Daily Wear',
          isNewArrival: productData.isNewArrival ?? true,
          isFeatured: productData.isFeatured ?? true,
          inStock: productData.inStock ?? true,
          hallmarkCertified: true,
        };
        currentProducts.unshift(newProduct);
      }
    } else {
      // Create new product
      const newProduct: Product = {
        id: `sj-${Date.now()}`,
        title: productData.title || 'New Royal Gold Jewellery',
        category: productData.category || 'Gold',
        purity: productData.purity || '22K',
        weightGrams: Number(productData.weightGrams) || 10,
        makingChargePercent: Number(productData.makingChargePercent) || 12,
        baseMakingCharge: Number(productData.baseMakingCharge) || 250,
        image: productData.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        gallery: productData.gallery && productData.gallery.length > 0 ? productData.gallery : [productData.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
        description: productData.description || 'Authentic BIS Hallmarked Gold piece.',
        gender: productData.gender || 'Women',
        collection: productData.collection || 'Daily Wear',
        isNewArrival: productData.isNewArrival ?? true,
        isFeatured: productData.isFeatured ?? true,
        inStock: productData.inStock ?? true,
        hallmarkCertified: true,
      };
      currentProducts.unshift(newProduct);
    }
    saveData('products.json', currentProducts);
    res.json({ success: true, products: currentProducts, message: 'Product catalog updated!' });
  });

  app.delete('/api/admin/products/:id', (req, res) => {
    const { id } = req.params;
    currentProducts = currentProducts.filter((p) => p.id !== id);
    const deletedProductIds = loadData<string[]>('deleted-products.json', []);
    if (!deletedProductIds.includes(id)) {
      deletedProductIds.push(id);
      saveData('deleted-products.json', deletedProductIds);
    }
    saveData('products.json', currentProducts);
    res.json({ success: true, products: currentProducts });
  });

  // Helper to categorize a product strictly into a specific jewelry category
  function getProductSpecificCategory(p: Product): string {
    const title = (p.title || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    if (title.includes('necklace') || title.includes('kundan') || title.includes('pendant') || title.includes('choker') || title.includes('mangalsutra') || desc.includes('necklace')) {
      return 'Necklace';
    }
    if (title.includes('ring') || title.includes('solitaire') || cat.includes('solitaire') || desc.includes('ring')) {
      return 'Ring';
    }
    if (title.includes('bangle') || title.includes('kada') || desc.includes('bangle')) {
      return 'Bangles';
    }
    if (title.includes('bracelet') || desc.includes('bracelet')) {
      return 'Bracelet';
    }
    if (cat.includes('coins') || title.includes('coin') || title.includes('bar')) {
      return 'Coins';
    }
    if (title.includes('earring') || desc.includes('earring') || cat.includes('earring')) {
      return 'Earrings';
    }
    return 'Jewellery';
  }

  // Helper to check if a product belongs strictly to a target category
  function isProductInTargetCategory(p: Product, targetCategory: string): boolean {
    const pCat = getProductSpecificCategory(p);
    if (pCat === targetCategory) return true;

    const catLower = targetCategory.toLowerCase();
    const title = (p.title || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    if (catLower === 'necklace') {
      return title.includes('necklace') || title.includes('pendant') || title.includes('choker') || title.includes('kundan') || desc.includes('necklace');
    }
    if (catLower === 'ring') {
      return title.includes('ring') || desc.includes('ring') || cat.includes('solitaire');
    }
    if (catLower === 'bangles') {
      return title.includes('bangle') || desc.includes('bangle') || title.includes('kada');
    }
    if (catLower === 'bracelet') {
      return title.includes('bracelet') || desc.includes('bracelet');
    }
    if (catLower === 'coins') {
      return cat.includes('coins') || title.includes('coin');
    }
    if (catLower === 'earrings') {
      return title.includes('earring') || desc.includes('earring');
    }
    return false;
  }

  // 2.1 Visual Image Search API
  app.post('/api/visual-search', async (req, res) => {
    try {
      const { imageUrl } = req.body;
      if (!imageUrl || typeof imageUrl !== 'string') {
        res.json({
          success: true,
          exactMatch: false,
          exactProductId: null,
          category: null,
          searchTerm: 'No Stock Item',
          matchedProducts: [],
          notFound: true,
        });
        return;
      }

      const lowerUrl = imageUrl.toLowerCase();

      // 1. Check exact match against catalog product images
      const exactProduct = currentProducts.find(
        (p) => p.image === imageUrl || (p.gallery && p.gallery.includes(imageUrl))
      );

      let detectedCategory: string | null = null;

      if (exactProduct) {
        detectedCategory = getProductSpecificCategory(exactProduct);
      } else {
        // 2. Multimodal Gemini AI Visual Classifier if base64 data or URL + API key is present
        if (process.env.GEMINI_API_KEY) {
          try {
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            
            let contents: any = null;
            if (imageUrl.startsWith('data:image/')) {
              // Extract base64 mime type and data payload
              const matches = imageUrl.match(/^data:(image\/[^;]+);base64,(.+)$/s);
              if (matches && matches[1] && matches[2]) {
                contents = [
                  {
                    inlineData: {
                      mimeType: matches[1],
                      data: matches[2].replace(/\s/g, ''),
                    },
                  },
                  'Look at this jewelry photo. Which specific category does it depict? Reply ONLY with ONE word from: [Necklace, Ring, Bangles, Bracelet, Earrings, Coins]. Do NOT output any additional words or punctuation.',
                ];
              }
            } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
              contents = `Examine this jewelry image URL: "${imageUrl}". Which specific category does it depict? Reply ONLY with ONE word from: [Necklace, Ring, Bangles, Bracelet, Earrings, Coins]. Do NOT output any additional words or punctuation.`;
            }

            if (contents) {
              const aiResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents,
              });
              const text = aiResponse.text?.trim() || '';
              const validCategories = ['Necklace', 'Ring', 'Bangles', 'Bracelet', 'Earrings', 'Coins'];
              const foundCat = validCategories.find((c) => text.toLowerCase().includes(c.toLowerCase()));
              if (foundCat) {
                detectedCategory = foundCat;
              }
            }
          } catch (geminiErr) {
            console.warn('[Gemini Visual Search Error]:', geminiErr);
          }
        }

        // 3. Fallback keyword matching on image URL / filename string
        if (!detectedCategory) {
          if (lowerUrl.includes('necklace') || lowerUrl.includes('1599643478518') || lowerUrl.includes('kundan') || lowerUrl.includes('pendant') || lowerUrl.includes('choker') || lowerUrl.includes('har')) {
            detectedCategory = 'Necklace';
          } else if (lowerUrl.includes('ring') || lowerUrl.includes('1605100804763') || lowerUrl.includes('solitaire') || lowerUrl.includes('band')) {
            detectedCategory = 'Ring';
          } else if (lowerUrl.includes('bangle') || lowerUrl.includes('1611591475168') || lowerUrl.includes('kada')) {
            detectedCategory = 'Bangles';
          } else if (lowerUrl.includes('bracelet') || lowerUrl.includes('1535632066927')) {
            detectedCategory = 'Bracelet';
          } else if (lowerUrl.includes('coin') || lowerUrl.includes('1610375461246') || lowerUrl.includes('bar')) {
            detectedCategory = 'Coins';
          } else if (lowerUrl.includes('earring') || lowerUrl.includes('jhumka') || lowerUrl.includes('stud')) {
            detectedCategory = 'Earrings';
          }
        }
      }

      // 4. Strict same-category in-stock inventory lookup
      if (detectedCategory) {
        // Get all in-stock products strictly matching detectedCategory
        let matchingInStock = currentProducts.filter((p) => p.inStock && isProductInTargetCategory(p, detectedCategory));

        // If exactProduct exists and is in matchingInStock, rank it FIRST at index 0
        if (exactProduct && exactProduct.inStock) {
          matchingInStock = matchingInStock.filter((p) => p.id !== exactProduct.id);
          matchingInStock.unshift(exactProduct);
        }

        if (matchingInStock.length > 0) {
          res.json({
            success: true,
            exactMatch: !!exactProduct,
            exactProductId: exactProduct?.id || matchingInStock[0]?.id || null,
            category: detectedCategory,
            searchTerm: detectedCategory,
            matchedProducts: matchingInStock,
            notFound: false,
          });
          return;
        }
      }

      // 5. If category missing or no in-stock products match: return empty matchedProducts with 'No Stock Item'
      res.json({
        success: true,
        exactMatch: false,
        exactProductId: null,
        category: detectedCategory || null,
        searchTerm: 'No Stock Item',
        matchedProducts: [],
        notFound: true,
      });
    } catch (err: any) {
      console.error('[Visual Search API Error]:', err);
      // Graceful error response without server crash or random fallback
      res.json({
        success: true,
        exactMatch: false,
        exactProductId: null,
        category: null,
        searchTerm: 'No Stock Item',
        matchedProducts: [],
        notFound: true,
        message: err?.message || 'Visual search error',
      });
    }
  });

  // Admin PIN Rate Limiting & Lockout Memory Store
  interface AdminLockoutState {
    attempts: number;
    lockoutUntil: number;
  }
  const adminAttemptsMap = new Map<string, AdminLockoutState>();

  // Admin PIN Verification with 3-Attempt Lockout
  app.post('/api/admin/verify-pin', (req, res) => {
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || 'global';
    const { pin } = req.body;
    const now = Date.now();

    const currentState = adminAttemptsMap.get(clientIp) || { attempts: 0, lockoutUntil: 0 };

    if (currentState.lockoutUntil > now) {
      const remainingSeconds = Math.ceil((currentState.lockoutUntil - now) / 1000);
      res.status(429).json({
        success: false,
        message: `Too many failed attempts. Locked out for ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}.`,
        lockout: true,
        remainingSeconds,
      });
      return;
    }

    const expectedPin = process.env.ADMIN_PIN || '7788';

    if (pin && String(pin).trim() === expectedPin) {
      adminAttemptsMap.delete(clientIp);
      res.json({ success: true, message: 'Admin authenticated successfully' });
    } else {
      const newAttempts = currentState.attempts + 1;
      if (newAttempts >= 3) {
        const lockoutUntil = now + 60 * 1000; // 60 seconds lockout
        adminAttemptsMap.set(clientIp, { attempts: 0, lockoutUntil });
        res.status(429).json({
          success: false,
          message: '3 incorrect attempts. Access locked out for 60 seconds.',
          lockout: true,
          remainingSeconds: 60,
        });
      } else {
        adminAttemptsMap.set(clientIp, { attempts: newAttempts, lockoutUntil: 0 });
        const attemptsLeft = 3 - newAttempts;
        res.status(400).json({
          success: false,
          message: `Invalid Admin Passcode. ${attemptsLeft} attempt${attemptsLeft > 1 ? 's' : ''} remaining before lockout.`,
          attemptsLeft,
        });
      }
    }
  });

  // Helper to normalize banner object fields
  function normalizeBanner(b: Banner): Banner {
    const img = b.image || b.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200';
    const tag = b.discountBadge || b.discountTag || 'SPECIAL OFFER';
    return {
      ...b,
      image: img,
      imageUrl: img,
      discountBadge: tag,
      discountTag: tag,
    };
  }

  // 3. Banners
  app.get('/api/banners', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, banners: currentBanners.map(normalizeBanner) });
  });

  app.post('/api/admin/banners', (req, res) => {
    const rawBanner = req.body as Banner;
    const newBanner = normalizeBanner({
      ...rawBanner,
      id: rawBanner.id || `b-${Date.now()}`,
    });

    const idx = currentBanners.findIndex((b) => b.id === newBanner.id);
    if (idx !== -1) {
      currentBanners[idx] = newBanner;
    } else {
      currentBanners.push(newBanner);
    }

    saveData('banners.json', currentBanners);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, banners: currentBanners, message: 'Banner saved successfully!' });
  });

  app.delete('/api/admin/banners/:id', (req, res) => {
    const { id } = req.params;
    currentBanners = currentBanners.filter((b) => b.id !== id);
    saveData('banners.json', currentBanners);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, banners: currentBanners, message: 'Banner removed successfully' });
  });

  // 3.5 Categories Partitions
  app.get('/api/categories', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, categories: currentCategories });
  });

  app.post('/api/admin/categories', (req, res) => {
    const { categories } = req.body;
    if (Array.isArray(categories)) {
      currentCategories = categories;
      saveData('categories.json', currentCategories);
    }
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, categories: currentCategories, message: 'Categories updated successfully!' });
  });

  // 3.8 Bottom Banner
  app.get('/api/bottom-banner', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, bottomBanner: currentBottomBanner });
  });

  app.post('/api/admin/bottom-banner', (req, res) => {
    const rawBanner = req.body as BottomBanner;
    currentBottomBanner = {
      ...currentBottomBanner,
      ...rawBanner,
    };
    saveData('bottom-banner.json', currentBottomBanner);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, bottomBanner: currentBottomBanner, message: 'Bottom banner updated successfully!' });
  });

  // 3.9 Hamburger Drawer Dashboard Configuration
  app.get('/api/drawer-config', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, drawerConfig: currentDrawerConfig });
  });

  app.post('/api/admin/drawer-config', (req, res) => {
    const rawConfig = req.body as Partial<DrawerConfig>;
    currentDrawerConfig = {
      ...currentDrawerConfig,
      ...rawConfig,
    };
    saveData('drawer-config.json', currentDrawerConfig);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, drawerConfig: currentDrawerConfig, message: 'Hamburger menu updated successfully!' });
  });

  // 3.10 Footer Configuration
  app.get('/api/footer-config', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, footerConfig: currentFooterConfig });
  });

  app.post('/api/admin/footer-config', (req, res) => {
    const rawConfig = req.body as Partial<FooterConfig>;
    currentFooterConfig = {
      ...currentFooterConfig,
      ...rawConfig,
    };
    saveData('footer-config.json', currentFooterConfig);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, footerConfig: currentFooterConfig, message: 'Footer configuration updated successfully!' });
  });

  // 4. OTP Auth
  app.post('/api/auth/send-otp', async (req, res) => {
    try {
      const { email } = req.body;
      const cleanEmail = email ? String(email).trim().toLowerCase() : '';

      if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        res.status(400).json({ success: false, message: 'Invalid email address format.' });
        return;
      }

      // Generate secure 4-digit verification code
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      otpStore[cleanEmail] = generatedOtp;

      // Await email dispatch so SMTP connection completes before container HTTP cycle finishes
      const emailResult = await sendOtpViaEmail(cleanEmail, generatedOtp);

      if (!emailResult.success) {
        console.error(`[Email Gateway Error] Provider: ${emailResult.provider}, Error: ${emailResult.error}`);
        res.status(500).json({
          success: false,
          message: `Email Dispatch Failed: ${emailResult.error || 'SMTP Connection Error'}`,
        });
        return;
      }

      console.log(`[Email OTP Success] Verification code ${generatedOtp} dispatched to ${cleanEmail} via ${emailResult.provider}`);

      // ✅ FIXED: Only include the OTP in the API response when we genuinely
      // could NOT deliver it by email (emailResult.devOtp is only set by the
      // fallback path in sendOtpViaEmail). When real delivery via Gmail SMTP
      // or Resend succeeds, the OTP must stay server-side only — otherwise
      // the frontend was showing it on-screen every single time, even on a
      // successful send, defeating the purpose of email verification.
      const responsePayload: {
        success: true;
        email: string;
        provider: string;
        message: string;
        otp?: string;
      } = {
        success: true,
        email: cleanEmail,
        provider: emailResult.provider,
        message: `Verification code sent via Email to ${cleanEmail}`,
      };

      if (emailResult.devOtp) {
        responsePayload.otp = emailResult.devOtp;
      }

      res.json(responsePayload);
    } catch (error: any) {
      console.error('[Email OTP API Error]:', error);
      res.status(500).json({
        success: false,
        message: error?.message || 'Server error while dispatching email verification code.',
      });
    }
  });

  app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp, name, address } = req.body;
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    const cleanOtp = String(otp || '').trim();
    const storedOtp = otpStore[cleanEmail];

    // Verify against active OTP or instant fallback passcodes
    const isValid = (storedOtp && cleanOtp === storedOtp) || cleanOtp === '7788' || cleanOtp === '1234';

    if (isValid) {
      // Clear OTP once used
      delete otpStore[cleanEmail];
      const emailPrefix = cleanEmail.split('@')[0] || 'Customer';
      const defaultDerivedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

      res.json({
        success: true,
        profile: {
          email: cleanEmail,
          name: (name && name.trim()) ? name.trim() : defaultDerivedName,
          address: address || {
            street: 'MG Road, Royal Palace Area',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
          },
          isLoggedIn: true,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP code. Please enter the 4-digit code shown or use 7788.' });
    }
  });

  // 5. Gold Savings Scheme
  app.get('/api/scheme/:email', (req, res) => {
    const email = decodeURIComponent(req.params.email).toLowerCase();
    let scheme = schemes[email];
    if (!scheme) {
      // Create a default new scheme for user
      scheme = {
        id: `SCH-${Math.floor(10000 + Math.random() * 90000)}`,
        email,
        schemeName: 'Shubham Swarna Varsha Plan',
        monthlyInstallment: 3000,
        totalMonths: 11,
        monthsPaid: 1,
        totalPaid: 3000,
        bonusDiscount: 3000,
        nextDueDate: '10th of Next Month',
        history: [
          { month: 1, amount: 3000, date: new Date().toISOString().split('T')[0], status: 'Paid', transactionId: `TXN${Math.floor(10000 + Math.random() * 90000)}` },
          { month: 2, amount: 3000, date: 'Pending', status: 'Pending' },
        ],
      };
      schemes[email] = scheme;
      saveData('schemes.json', schemes);
    }
    res.json({ success: true, scheme });
  });

  app.post('/api/scheme/pay', (req, res) => {
    const { email, amount } = req.body;
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    let scheme = schemes[cleanEmail];
    if (!scheme) {
      scheme = {
        id: `SCH-${Math.floor(10000 + Math.random() * 90000)}`,
        email: cleanEmail,
        schemeName: 'Shubham Swarna Varsha Plan',
        monthlyInstallment: Number(amount) || 3000,
        totalMonths: 11,
        monthsPaid: 0,
        totalPaid: 0,
        bonusDiscount: Number(amount) || 3000,
        nextDueDate: '10th of Next Month',
        history: [],
      };
      schemes[cleanEmail] = scheme;
    }

    const nextMonth = scheme.monthsPaid + 1;
    const txId = `TXN${Math.floor(100000 + Math.random() * 900000)}`;

    scheme.monthsPaid += 1;
    scheme.totalPaid += Number(amount);
    scheme.history.unshift({
      month: nextMonth,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
      transactionId: txId,
    });

    saveData('schemes.json', schemes);
    res.json({ success: true, scheme, receipt: { txId, amount, date: new Date().toLocaleDateString('en-IN') } });
  });

  // 6. App Version & Real-Time In-App Updates
  app.get('/api/version', (req, res) => {
    res.json({ success: true, versionInfo: currentVersion });
  });

  app.post('/api/admin/version', (req, res) => {
    const { latestVersion, updateMessage, releaseNotes } = req.body;
    currentVersion = {
      currentVersion: currentVersion.currentVersion,
      latestVersion: latestVersion || '2.1.0',
      updateAvailable: true,
      updateMessage: updateMessage || 'A new update for Shubham Jewellers is now available!',
      releaseNotes: releaseNotes || [
        'Real-time Live Gold Rate alerts',
        'Zero Data Loss Account & Order Synchronization',
        'Editable Pre-formatted WhatsApp Inquiries',
      ],
    };
    saveData('version.json', currentVersion);
    res.json({ success: true, versionInfo: currentVersion, message: 'New version broadcasted to all active app instances!' });
  });

  // 7. Company Details / About Us
  app.get('/api/company-info', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, companyInfo: currentCompanyInfo });
  });

  app.post('/api/admin/company-info', (req, res) => {
    const infoUpdate = req.body as Partial<CompanyInfo>;
    currentCompanyInfo = { ...currentCompanyInfo, ...infoUpdate };
    saveData('company-info.json', currentCompanyInfo);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, companyInfo: currentCompanyInfo, message: 'Company details updated live!' });
  });

  // 8. Zero Data Loss Account Sync (User Profile, Cart, Wishlist)
  app.get('/api/user-data/:email', (req, res) => {
    const email = decodeURIComponent(req.params.email).toLowerCase();
    const data = userDataStore[email];
    if (data) {
      res.json({ success: true, userData: data });
    } else {
      res.json({ success: false, message: 'No stored data found for user' });
    }
  });

  app.post('/api/user-data', (req, res) => {
    const { email, profile, cart, wishlistIds } = req.body;
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    if (!cleanEmail) {
      res.status(400).json({ success: false, message: 'Email address required for sync' });
      return;
    }
    const emailPrefix = cleanEmail.split('@')[0] || 'Customer';
    const defaultDerivedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

    userDataStore[cleanEmail] = {
      email: cleanEmail,
      profile: profile || { email: cleanEmail, name: defaultDerivedName, address: { street: '', city: '', state: '', pincode: '' }, isLoggedIn: true },
      cart: cart || [],
      wishlistIds: wishlistIds || [],
      lastUpdated: new Date().toISOString(),
    };
    saveData('user-data.json', userDataStore);
    res.json({ success: true, message: 'Account data synced safely to remote database!' });
  });

  // Vite development middleware vs Static Production
  if (NODE_ENV !== 'production') {
    console.log('🔧 Running in DEVELOPMENT mode with Vite HMR');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('📦 Running in PRODUCTION mode - serving static files');
    // ✅ FIXED: Correct path for production build
    const distPath = path.join(resolvedDirname, '../dist');
    
    if (!fs.existsSync(distPath)) {
      console.error(`❌ ERROR: dist folder not found at ${distPath}`);
      console.error('Make sure you run: npm run build');
      process.exit(1);
    }

    // Serve static files from dist
    app.use(express.static(distPath, { 
      maxAge: '1d',
      etag: false 
    }));

    // SPA fallback - serve index.html for all other routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
          console.error('Error serving index.html:', err);
          res.status(500).json({ success: false, message: 'Internal server error' });
        }
      });
    });
  }

  // ✅ FIXED: Listen on correct HOST and PORT
  app.listen(PORT, HOST, () => {
    console.log(`\n✅ Shubham Jewellers Server started successfully!`);
    console.log(`📍 Listening on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log(`📦 Environment: ${NODE_ENV}`);
    console.log(`📁 Data directory: ${DATA_DIR} (persistent disk: ${usingPersistentDisk ? 'YES' : 'NO - see warning above'})\n`);
  });

  // Handle server errors
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});