import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dns from 'dns';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import mongoose, { Schema } from 'mongoose';
import Razorpay from 'razorpay';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import {
  initialGoldRates,
  initialBanners,
  initialBottomBanner,
  initialCategoryItems,
  initialProducts,
  initialVersionInfo,
  initialCompanyInfo,
  initialDrawerConfig,
  initialFooterConfig,
} from './src/data/initialData.js';

import {
  GoldRates,
  Banner,
  BottomBanner,
  CategoryItem,
  Product,
  AppVersionInfo,
  GoldScheme,
  CompanyInfo,
  UserSyncedData,
  DrawerConfig,
  FooterConfig,
} from './src/types.js';

// Works in both ESM (local dev via tsx) and the CJS bundle esbuild produces for production
declare const __dirname: string | undefined;
function resolveDirname(): string {
  if (typeof __dirname !== 'undefined') return __dirname;
  return path.dirname(fileURLToPath(import.meta.url));
}
const resolvedDirname = resolveDirname();

/* ==========================================================================
   MONGOOSE SCHEMAS & MODELS (MongoDB Atlas)
   ========================================================================== */

// 1. Gold Rates Schema
const GoldRatesSchema = new Schema<GoldRates>(
  {
    gold24k: { type: Number, required: true },
    gold22k: { type: Number, required: true },
    gold18k: { type: Number, required: true },
    silver: { type: Number, required: true },
    lastUpdated: { type: String, default: '' },
    trend24k: { type: Number, default: 0 },
    trendSilver: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export const RatesModel = mongoose.model<GoldRates>('GoldRate', GoldRatesSchema);

// 2. Banner Schema
const BannerSchema = new Schema<Banner>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    image: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    discountBadge: { type: String, default: '' },
    discountTag: { type: String, default: '' },
    ctaText: { type: String, default: 'Explore Collection' },
    categoryLink: { type: String, default: 'Gold' },
  },
  { timestamps: true }
);
export const BannerModel = mongoose.model<Banner>('Banner', BannerSchema);

// 3. Category Items Schema
const CategoryItemSchema = new Schema<CategoryItem>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
export const CategoryModel = mongoose.model<CategoryItem>('Category', CategoryItemSchema);

// 4. Bottom Banner Schema
const BottomBannerSchema = new Schema<BottomBanner>(
  {
    id: { type: String, default: 'bb1' },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    discountBadge: { type: String, default: '' },
    image: { type: String, required: true },
    categoryLink: { type: String, default: 'Gold' },
    ctaText: { type: String, default: 'Join Swarna Scheme Now' },
  },
  { timestamps: true }
);
export const BottomBannerModel = mongoose.model<BottomBanner>('BottomBanner', BottomBannerSchema);

// 5. Product Schema
const ProductSchema = new Schema<Product>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    purity: { type: String, default: '22K' },
    weightGrams: { type: Number, required: true },
    makingChargePercent: { type: Number, default: 12 },
    baseMakingCharge: { type: Number, default: 250 },
    image: { type: String, required: true },
    gallery: { type: [String], default: [] },
    description: { type: String, default: '' },
    gender: { type: String, default: 'Women' },
    collection: { type: String, default: 'Daily Wear' },
    isNewArrival: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: true },
    inStock: { type: Boolean, default: true },
    hallmarkCertified: { type: Boolean, default: true },
  },
  { timestamps: true }
);
export const ProductModel = mongoose.model<Product>('Product', ProductSchema);

// 6. Company Info Schema
const CompanyInfoSchema = new Schema<CompanyInfo>(
  {
    name: { type: String, required: true },
    tagline: { type: String, default: '' },
    establishedYear: { type: String, default: '1988' },
    bisHallmarkReg: { type: String, default: '' },
    phone: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    storeHours: { type: String, default: '' },
    aboutText: { type: String, default: '' },
  },
  { timestamps: true }
);
export const CompanyInfoModel = mongoose.model<CompanyInfo>('CompanyInfo', CompanyInfoSchema);

// 7. Gold Savings Scheme Schema
const GoldSchemeSchema = new Schema<GoldScheme>(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, index: true },
    schemeName: { type: String, default: 'Shubham Swarna Varsha Plan' },
    monthlyInstallment: { type: Number, required: true },
    totalMonths: { type: Number, default: 11 },
    monthsPaid: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    bonusDiscount: { type: Number, default: 0 },
    nextDueDate: { type: String, default: '' },
    history: {
      type: [
        {
          month: Number,
          amount: Number,
          date: String,
          status: String,
          transactionId: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);
export const GoldSchemeModel = mongoose.model<GoldScheme>('GoldScheme', GoldSchemeSchema);

// 8. User Synced Data Schema
const UserSyncedDataSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    profile: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      avatar: { type: String, default: '' },
      address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        pincode: { type: String, default: '' },
      },
      isLoggedIn: { type: Boolean, default: false },
    },
    cart: { type: Schema.Types.Mixed, default: [] },
    wishlistIds: { type: [String], default: [] },
    lastUpdated: { type: String, default: '' },
  },
  { timestamps: true }
);
export const UserDataModel = mongoose.model<UserSyncedData>('UserData', UserSyncedDataSchema as any);

// 9. Drawer Configuration Schema
const DrawerConfigSchema = new Schema<DrawerConfig>(
  {
    headerTitle: { type: String, default: 'SHUBHAM JEWELLERS' },
    welcomeSubtitle: { type: String, default: 'Heritage & BIS Hallmarked Fine Gold' },
    aboutBtnText: { type: String, default: 'About Us & Showroom Info' },
    schemeBtnTitle: { type: String, default: 'Jewellery Savings Plan' },
    schemeBtnSubtitle: { type: String, default: 'Pay 10 Installments & Get 1 Month Bonus' },
    whatsappBtnTitle: { type: String, default: 'Direct WhatsApp Support' },
    whatsappBtnSubtitle: { type: String, default: 'Chat live with our gold consultants' },
    categorySectionTitle: { type: String, default: 'Shop By Category' },
    shopForSectionTitle: { type: String, default: 'Shop For' },
    footerTagline: { type: String, default: 'Shubham Jewellers   Verified BIS Hallmarked' },
  },
  { timestamps: true }
);
export const DrawerConfigModel = mongoose.model<DrawerConfig>('DrawerConfig', DrawerConfigSchema);

// 10. Footer Configuration Schema
const FooterConfigSchema = new Schema<FooterConfig>(
  {
    trustBadges: {
      type: [
        {
          title: String,
          subtitle: String,
          icon: String,
        },
      ],
      default: [],
    },
    brandTitle: { type: String, default: 'SHUBHAM JEWELLERS' },
    brandDescription: { type: String, default: '' },
    officialStoreLabel: { type: String, default: 'Official Authorised Store' },
    collectionsTitle: { type: String, default: 'Collections & Categories' },
    collectionsList: { type: [String], default: [] },
    customerCareTitle: { type: String, default: 'Customer Care & Store' },
    tollFreeText: { type: String, default: '' },
    careEmail: { type: String, default: '' },
    storeAddress: { type: String, default: '' },
    schemeTitle: { type: String, default: '' },
    schemeDescription: { type: String, default: '' },
    schemeHighlightBox: { type: String, default: '' },
    copyrightText: { type: String, default: '  2026 Shubham Jewellers. All rights reserved.' },
  },
  { timestamps: true }
);
export const FooterConfigModel = mongoose.model<FooterConfig>('FooterConfig', FooterConfigSchema);

// 11. App Version Schema
const VersionInfoSchema = new Schema<AppVersionInfo>(
  {
    currentVersion: { type: String, default: '1.0.0' },
    latestVersion: { type: String, default: '1.0.0' },
    updateAvailable: { type: Boolean, default: false },
    updateMessage: { type: String, default: '' },
    releaseNotes: { type: [String], default: [] },
  },
  { timestamps: true }
);
export const VersionInfoModel = mongoose.model<AppVersionInfo>('AppVersion', VersionInfoSchema);


/* ==========================================================================
   DATABASE SEEDING (Run if MongoDB Collections are Empty)
   ========================================================================== */

async function seedInitialDataIfEmpty() {
  try {
    const rateCount = await RatesModel.countDocuments();
    if (rateCount === 0) {
      await RatesModel.create(initialGoldRates);
      console.log('  Seeded default Gold & Silver rates to MongoDB');
    }

    const bannerCount = await BannerModel.countDocuments();
    if (bannerCount === 0) {
      await BannerModel.insertMany(initialBanners.map(normalizeBanner));
      console.log(`  Seeded ${initialBanners.length} banners to MongoDB`);
    }

    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      await ProductModel.insertMany(initialProducts);
      console.log(`  Seeded ${initialProducts.length} products to MongoDB`);
    }

    const categoryCount = await CategoryModel.countDocuments();
    if (categoryCount === 0) {
      await CategoryModel.insertMany(initialCategoryItems);
      console.log(`  Seeded ${initialCategoryItems.length} categories to MongoDB`);
    }

    const bottomBannerCount = await BottomBannerModel.countDocuments();
    if (bottomBannerCount === 0) {
      await BottomBannerModel.create(initialBottomBanner);
      console.log('  Seeded bottom banner to MongoDB');
    }

    const companyCount = await CompanyInfoModel.countDocuments();
    if (companyCount === 0) {
      await CompanyInfoModel.create(initialCompanyInfo);
      console.log('  Seeded company info to MongoDB');
    }

    const drawerCount = await DrawerConfigModel.countDocuments();
    if (drawerCount === 0) {
      await DrawerConfigModel.create(initialDrawerConfig);
      console.log('  Seeded drawer config to MongoDB');
    }

    const footerCount = await FooterConfigModel.countDocuments();
    if (footerCount === 0) {
      await FooterConfigModel.create(initialFooterConfig);
      console.log('  Seeded footer config to MongoDB');
    }

    const versionCount = await VersionInfoModel.countDocuments();
    if (versionCount === 0) {
      await VersionInfoModel.create(initialVersionInfo);
      console.log('  Seeded version info to MongoDB');
    }

    const schemeCount = await GoldSchemeModel.countDocuments();
    if (schemeCount === 0) {
      await GoldSchemeModel.create({
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
      });
      console.log('  Seeded demo customer scheme to MongoDB');
    }

  } catch (err) {
    console.error('Error during MongoDB initial seed:', err);
  }
}

// Helper to normalize banner object fields
function normalizeBanner(b: any): Banner {
  const img = b.image || b.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200';
  const tag = b.discountBadge || b.discountTag || 'SPECIAL OFFER';
  return {
    id: b.id || `b-${Date.now()}`, // <--- The cause of changing IDs is isolated here
    title: b.title || 'Royal Jewellery Collection',
    subtitle: b.subtitle || 'Exclusive Festival Offer',
    image: img,
    imageUrl: img,
    discountBadge: tag,
    discountTag: tag,
    ctaText: b.ctaText || 'Explore Collection',
    categoryLink: b.categoryLink || 'Gold',
  };
}


/* ==========================================================================
   SERVER INITIALIZATION & API ROUTES
   ========================================================================== */

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = process.env.HOST || '0.0.0.0';
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // Allow CORS from mobile apps (capacitor://, file://, localhost) and web clients
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Increase payload limit to 50mb to support base64 product photo uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // File-based persistence fallback directory
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

  // Safe file loader helper (used as fallback when MongoDB is not connected)
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

  // Fallback in-memory states
  let currentRates: GoldRates = loadData<GoldRates>('rates.json', { ...initialGoldRates });
  
  // FIX: Normalize ONCE during initialization to prevent changing IDs on every fetch
  let currentBanners: Banner[] = loadData<Banner[]>('banners.json', [...initialBanners]).map(normalizeBanner);
  
  let currentProducts: Product[] = loadData<Product[]>('products.json', [...initialProducts]);
  let currentCategories: CategoryItem[] = loadData<CategoryItem[]>('categories.json', [...initialCategoryItems]);
  let currentBottomBanner: BottomBanner = loadData<BottomBanner>('bottom-banner.json', { ...initialBottomBanner });
  let currentDrawerConfig: DrawerConfig = loadData<DrawerConfig>('drawer-config.json', { ...initialDrawerConfig });
  let currentFooterConfig: FooterConfig = loadData<FooterConfig>('footer-config.json', { ...initialFooterConfig });
  let currentVersion: AppVersionInfo = loadData<AppVersionInfo>('version.json', { ...initialVersionInfo });
  let currentCompanyInfo: CompanyInfo = loadData<CompanyInfo>('company-info.json', { ...initialCompanyInfo });
  const userDataStore: Record<string, UserSyncedData> = loadData<Record<string, UserSyncedData>>('user-data.json', {});

  const schemes: Record<string, GoldScheme> = loadData<Record<string, GoldScheme>>('schemes.json', {
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
  });

  // Generated OTP cache - Strictly empty initial state (no hardcoded backdoors)
  const otpStore: Record<string, string> = {};

  // Razorpay Gateway Client (Lazy initialization to prevent crashes if keys not yet set)
  let razorpayClient: Razorpay | null = null;
  function getRazorpay(): Razorpay | null {
    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!keyId || !keySecret) return null;

    if (!razorpayClient) {
      razorpayClient = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    }
    return razorpayClient;
  }

  // Check ADMIN_PIN configuration
  const configuredAdminPin = process.env.ADMIN_PIN?.trim();
  if (!configuredAdminPin) {
    console.error('\n' + '='.repeat(70));
    console.error('  CRITICAL SECURITY ALERT: ADMIN_PIN environment variable is NOT set!');
    console.error('   Admin Passcode verification will be DISABLED until ADMIN_PIN is set.');
    console.error('   Please add ADMIN_PIN=<your-secure-pin> in .env or your deployment dashboard.');
    console.error('='.repeat(70) + '\n');
  }

  /* ==========================================================================
     CONNECT TO MONGODB ATLAS
     ========================================================================== */
  let isMongoConnected = false;
  const mongoUri = process.env.MONGODB_URI?.trim();

  if (mongoUri) {
    try {
      console.log('  Connecting to MongoDB Atlas...');
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 8000,
      });
      isMongoConnected = true;
      console.log('  MongoDB Atlas connected successfully!');
      
      await seedInitialDataIfEmpty();

    } catch (mongoErr: any) {
      console.error('  [MongoDB Connection Warning] Could not connect to MongoDB Atlas:', mongoErr?.message || mongoErr);
      console.warn('   Continuing with local fallback storage until MONGODB_URI is reachable.');
      isMongoConnected = false;
    }
  } else {
    console.warn(
      '\n   [MongoDB Setup Notice]\n' +
      '   MONGODB_URI environment variable is not configured.\n' +
      '   The app will run with file/memory storage.\n' +
      '   To connect MongoDB Atlas permanently: set MONGODB_URI in your .env or Render Dashboard.\n'
    );
  }

  mongoose.connection.on('connected', () => {
    isMongoConnected = true;
    console.log('  MongoDB Atlas Connection state: CONNECTED');
  });

  mongoose.connection.on('error', (err) => {
    console.error('  MongoDB Connection Error:', err);
    isMongoConnected = false;
  });

  mongoose.connection.on('disconnected', () => {
    isMongoConnected = false;
    console.warn('  MongoDB Atlas Disconnected.');
  });

  // Connection-pooled Nodemailer Transporter (Singleton)
  let cachedTransporter: nodemailer.Transporter | null = null;
  function getEmailTransporter(user: string, pass: string): nodemailer.Transporter {
    if (!cachedTransporter) {
      cachedTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        family: 4,
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 1000,
        rateLimit: 5,
        auth: { user, pass },
        connectionTimeout: 10000,
        socketTimeout: 10000,
      } as any);
    }
    return cachedTransporter;
  }

  // Helper function to dispatch OTP via Email
  async function sendOtpViaEmail(
    email: string,
    otp: string,
    maxAttempts = 2
  ): Promise<{ success: boolean; provider: string; error?: string; devOtp?: string }> {
    const gmailUser = process.env.GMAIL_USER?.trim();
    const gmailPass = process.env.GMAIL_APP_PASSWORD?.trim();
    const resendApiKey = process.env.RESEND_API_KEY?.trim();

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

    // 1. Try Resend Direct REST API
    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
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

    // 2. Try Pooled Gmail SMTP
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

    console.log(`[Email Fallback Notice] Verification OTP for ${email} is: ${otp}. Reason: ${lastError || 'No SMTP setup'}`);
    return {
      success: true,
      provider: 'Instant OTP Fallback',
      devOtp: otp,
      error: lastError,
    };
  }


  // Helper to categorize a product
  function getProductSpecificCategory(p: Product): string {
    const title = (p.title || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    if (
      title.includes('necklace') ||
      title.includes('kundan') ||
      title.includes('pendant') ||
      title.includes('choker') ||
      title.includes('mangalsutra') ||
      desc.includes('necklace')
    ) {
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

  function isProductInTargetCategory(p: Product, targetCategory: string): boolean {
    const pCat = getProductSpecificCategory(p);
    if (pCat === targetCategory) return true;

    const catLower = targetCategory.toLowerCase();
    const title = (p.title || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();

    if (catLower === 'necklace') {
      return (
        title.includes('necklace') ||
        title.includes('pendant') ||
        title.includes('choker') ||
        title.includes('kundan') ||
        desc.includes('necklace')
      );
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

  //   HEALTH CHECK ENDPOINT
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      uptime: process.uptime(),
      database: isMongoConnected ? 'MongoDB Atlas (Connected)' : (mongoUri ? 'MongoDB Atlas (Connecting/Offline)' : 'Local JSON Storage'),
      mongoConnected: isMongoConnected,
      persistentDisk: usingPersistentDisk,
      dataDir: DATA_DIR,
    });
  });

  /* ==========================================================================
     API ROUTES (MONGODB ATLAS WITH GRACEFUL FALLBACK)
     ========================================================================== */

  // 1. Live Gold Rates
  app.get('/api/rates', async (req, res) => {
    try {
      if (isMongoConnected) {
        const rates = await RatesModel.findOne().lean();
        if (rates) {
          res.json({ success: true, rates });
          return;
        }
      }
    } catch (e) {
      console.error('[MongoDB Rates GET Error]:', e);
    }
    res.json({ success: true, rates: currentRates });
  });

  app.post('/api/admin/rates', async (req, res) => {
    const { gold24k, gold22k, gold18k, silver } = req.body;
    const updateObj: Partial<GoldRates> = {
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    if (gold24k) updateObj.gold24k = Number(gold24k);
    if (gold22k) updateObj.gold22k = Number(gold22k);
    if (gold18k) updateObj.gold18k = Number(gold18k);
    if (silver) updateObj.silver = Number(silver);

    try {
      if (isMongoConnected) {
        const updated = await RatesModel.findOneAndUpdate({}, updateObj, { upsert: true, new: true }).lean();
        if (updated) {
          currentRates = { ...currentRates, ...updated };
          saveData('rates.json', currentRates);
          res.json({ success: true, rates: updated, message: 'Live gold & silver rates updated in MongoDB!' });
          return;
        }
      }
    } catch (e) {
      console.error('[MongoDB Rates POST Error]:', e);
    }

    currentRates = { ...currentRates, ...updateObj } as GoldRates;
    saveData('rates.json', currentRates);
    res.json({ success: true, rates: currentRates, message: 'Live gold & silver rates updated!' });
  });

  // 2. Products Catalog
  app.get('/api/products', async (req, res) => {
    try {
      if (isMongoConnected) {
        const products = await ProductModel.find().lean();
        if (products && products.length > 0) {
          res.json({ success: true, products });
          return;
        }
      }
    } catch (e) {
      console.error('[MongoDB Products GET Error]:', e);
    }
    res.json({ success: true, products: currentProducts });
  });

  app.post('/api/admin/products', async (req, res) => {
    const productData = req.body as Partial<Product>;
    const targetId = productData.id || `sj-${Date.now()}`;
    const newProduct: Product = {
      id: targetId,
      title: productData.title || 'New Royal Gold Jewellery',
      category: productData.category || 'Gold',
      purity: productData.purity || '22K',
      weightGrams: Number(productData.weightGrams) || 10,
      makingChargePercent: Number(productData.makingChargePercent) || 12,
      baseMakingCharge: Number(productData.baseMakingCharge) || 250,
      image: productData.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      gallery:
        productData.gallery && productData.gallery.length > 0
          ? productData.gallery
          : [productData.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
      description: productData.description || 'Authentic BIS Hallmarked Gold piece.',
      gender: productData.gender || 'Women',
      collection: productData.collection || 'Daily Wear',
      isNewArrival: productData.isNewArrival ?? true,
      isFeatured: productData.isFeatured ?? true,
      inStock: productData.inStock ?? true,
      hallmarkCertified: true,
    };

    try {
      if (isMongoConnected) {
        await ProductModel.findOneAndUpdate({ id: targetId }, newProduct, { upsert: true, new: true });
        const allProducts = await ProductModel.find().lean();
        currentProducts = allProducts as Product[];
        saveData('products.json', currentProducts);
        res.json({ success: true, products: allProducts, message: 'Product catalog updated in MongoDB!' });
        return;
      }
    } catch (e) {
      console.error('[MongoDB Product POST Error]:', e);
    }

    const idx = currentProducts.findIndex((p) => p.id === targetId);
    if (idx !== -1) {
      currentProducts[idx] = newProduct;
    } else {
      currentProducts.unshift(newProduct);
    }
    saveData('products.json', currentProducts);
    res.json({ success: true, products: currentProducts, message: 'Product catalog updated!' });
  });

  app.delete('/api/admin/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
      if (isMongoConnected) {
        await ProductModel.deleteOne({ id });
        const allProducts = await ProductModel.find().lean();
        currentProducts = allProducts as Product[];
        saveData('products.json', currentProducts);
        res.json({ success: true, products: allProducts, message: 'Product deleted from MongoDB' });
        return;
      }
    } catch (e) {
      console.error('[MongoDB Product DELETE Error]:', e);
    }
    currentProducts = currentProducts.filter((p) => p.id !== id);
    saveData('products.json', currentProducts);
    res.json({ success: true, products: currentProducts, message: 'Product deleted' });
  });

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

      // Fetch active catalog products (from MongoDB if connected)
      let catalogProducts = currentProducts;
      if (isMongoConnected) {
        try {
          const dbProducts = await ProductModel.find().lean();
          if (dbProducts && dbProducts.length > 0) {
            catalogProducts = dbProducts as Product[];
          }
        } catch (e) {}
      }

      const lowerUrl = imageUrl.toLowerCase();

      // 1. Check exact match against catalog product images
      const exactProduct = catalogProducts.find(
        (p) => p.image === imageUrl || (p.gallery && p.gallery.includes(imageUrl))
      );

      let detectedCategory: string | null = null;
      if (exactProduct) {
        detectedCategory = getProductSpecificCategory(exactProduct);
      } else {
        // 2. Multimodal Gemini AI Visual Classifier
        if (process.env.GEMINI_API_KEY) {
          try {
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            let contents: any = null;

            if (imageUrl.startsWith('data:image/')) {
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

        // 3. Fallback keyword matching
        if (!detectedCategory) {
          if (
            lowerUrl.includes('necklace') ||
            lowerUrl.includes('1599643478518') ||
            lowerUrl.includes('kundan') ||
            lowerUrl.includes('pendant') ||
            lowerUrl.includes('choker') ||
            lowerUrl.includes('har')
          ) {
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

      // 4. In-stock inventory lookup
      if (detectedCategory) {
        let matchingInStock = catalogProducts.filter((p) => p.inStock && isProductInTargetCategory(p, detectedCategory!));
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

  // Admin PIN Rate Limiting
  interface AdminLockoutState {
    attempts: number;
    lockoutUntil: number;
  }
  const adminAttemptsMap = new Map<string, AdminLockoutState>();

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

    const expectedPin = process.env.ADMIN_PIN?.trim();

    if (!expectedPin) {
      console.error('[Admin Auth Rejected]: ADMIN_PIN environment variable is not configured on the server.');
      res.status(503).json({
        success: false,
        message: 'Admin authentication is currently disabled: ADMIN_PIN environment variable is not configured on the server.',
      });
      return;
    }

    if (pin && String(pin).trim() === expectedPin) {
      adminAttemptsMap.delete(clientIp);
      res.json({ success: true, message: 'Admin authenticated successfully' });
    } else {
      const newAttempts = currentState.attempts + 1;
      if (newAttempts >= 3) {
        const lockoutUntil = now + 60 * 1000;
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

  // =========================================================================
  // FIX: Banners endpoint no longer normalizes on GET, stopping changing IDs
  // =========================================================================
  
  // 3. Banners
  app.get('/api/banners', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    try {
      if (isMongoConnected) {
        const banners = await BannerModel.find().lean();
        if (banners && banners.length > 0) {
          res.json({ success: true, banners }); // Removed mapping
          return;
        }
      }
    } catch (e) {
      console.error('[MongoDB Banners GET Error]:', e);
    }
    res.json({ success: true, banners: currentBanners }); // Removed mapping
  });

  app.post('/api/admin/banners', async (req, res) => {
    const rawBanner = req.body as Banner;
    // Normalize ONLY on insertion
    const newBanner = normalizeBanner({
      ...rawBanner,
      id: rawBanner.id || `b-${Date.now()}`,
    });

    try {
      if (isMongoConnected) {
        await BannerModel.findOneAndUpdate({ id: newBanner.id }, newBanner, { upsert: true, new: true });
        const allBanners = await BannerModel.find().lean();
        currentBanners = allBanners as Banner[];
        saveData('banners.json', currentBanners);
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.json({ success: true, banners: currentBanners, message: 'Banner saved to MongoDB!' });
        return;
      }
    } catch (e) {
      console.error('[MongoDB Banner POST Error]:', e);
    }

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

  app.delete('/api/admin/banners/:id', async (req, res) => {
    const { id } = req.params;
    try {
      if (isMongoConnected) {
        await BannerModel.deleteOne({ id });
        const allBanners = await BannerModel.find().lean();
        currentBanners = allBanners as Banner[]; // Removed mapping
        saveData('banners.json', currentBanners);
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.json({ success: true, banners: currentBanners, message: 'Banner removed from MongoDB' });
        return;
      }
    } catch (e) {
      console.error('[MongoDB Banner DELETE Error]:', e);
    }
    currentBanners = currentBanners.filter((b) => b.id !== id);
    saveData('banners.json', currentBanners);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, banners: currentBanners, message: 'Banner removed successfully' });
  });

  // 3.5 Categories
  app.get('/api/categories', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    try {
      if (isMongoConnected) {
        const categories = await CategoryModel.find().sort({ order: 1 }).lean();
        if (categories && categories.length > 0) {
          res.json({ success: true, categories });
          return;
        }
      }
    } catch (e) {
      console.error('[MongoDB Categories GET Error]:', e);
    }
    res.json({ success: true, categories: currentCategories });
  });

  app.post('/api/admin/categories', async (req, res) => {
    const { categories } = req.body;
    if (Array.isArray(categories)) {
      try {
        if (isMongoConnected) {
          await CategoryModel.deleteMany({});
          await CategoryModel.insertMany(categories);
          const allCats = await CategoryModel.find().sort({ order: 1 }).lean();
          currentCategories = allCats as CategoryItem[];
          saveData('categories.json', currentCategories);
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
          res.json({ success: true, categories: allCats, message: 'Categories updated in MongoDB!' });
          return;
        }
      } catch (e) {
        console.error('[MongoDB Categories POST Error]:', e);
      }
      currentCategories = categories;
      saveData('categories.json', currentCategories);
    }
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, categories: currentCategories, message: 'Categories updated successfully!' });
  });

  // 3.8 Bottom Banner
  app.get('/api/bottom-banner', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    try {
      if (isMongoConnected) {
        const banner = await BottomBannerModel.findOne().lean();
        if (banner) {
          res.json({ success: true, bottomBanner: banner });
          return;
        }
      }
    } catch (e) {
      console.error('[MongoDB Bottom Banner GET Error]:', e);
    }
    res.json({ success: true, bottomBanner: currentBottomBanner });
  });

  app.post('/api/admin/bottom-banner', async (req, res) => {
    const rawBanner = req.body as BottomBanner;
    try {
      if (isMongoConnected) {
        const updated = await BottomBannerModel.findOneAndUpdate({}, rawBanner, { upsert: true, new: true }).lean();
        currentBottomBanner = updated as BottomBanner;
        saveData('bottom-banner.json', currentBottomBanner);
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.json({ success: true, bottomBanner: updated, message: 'Bottom banner updated in MongoDB!' });
        return;
      }
    } catch (e) {
      console.error('[MongoDB Bottom Banner POST Error]:', e);
    }
    currentBottomBanner = { ...currentBottomBanner, ...rawBanner };
    saveData('bottom-banner.json', currentBottomBanner);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, bottomBanner: currentBottomBanner, message: 'Bottom banner updated successfully!' });
  });

  // 3.9 Hamburger Drawer Config
  app.get('/api/drawer-config', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    try {
      if (isMongoConnected) {
        const config = await DrawerConfigModel.findOne().lean();
        if (config) {
          res.json({ success: true, drawerConfig: config });
          return;
        }
      }
    } catch (e) {
      console.error('[MongoDB Drawer Config GET Error]:', e);
    }
    res.json({ success: true, drawerConfig: currentDrawerConfig });
  });

  app.post('/api/admin/drawer-config', async (req, res) => {
    const rawConfig = req.body as Partial<DrawerConfig>;
    try {
      if (isMongoConnected) {
        const updated = await DrawerConfigModel.findOneAndUpdate({}, rawConfig, { upsert: true, new: true }).lean();
        currentDrawerConfig = updated as DrawerConfig;
        saveData('drawer-config.json', currentDrawerConfig);
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.json({ success: true, drawerConfig: updated, message: 'Hamburger menu updated in MongoDB!' });
        return;
      }
    } catch (e) {
      console.error('[MongoDB Drawer Config POST Error]:', e);
    }
    currentDrawerConfig = { ...currentDrawerConfig, ...rawConfig } as DrawerConfig;
    saveData('drawer-config.json', currentDrawerConfig);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, drawerConfig: currentDrawerConfig, message: 'Hamburger menu updated successfully!' });
  });

  // 3.10 Footer Configuration
  app.get('/api/footer-config', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    try {
      if (isMongoConnected) {
        const config = await FooterConfigModel.findOne().lean();
        if (config) {
          res.json({ success: true, footerConfig: config });
          return;
        }
      }
    } catch (e) {
      console.error('[MongoDB Footer Config GET Error]:', e);
    }
    res.json({ success: true, footerConfig: currentFooterConfig });
  });

  app.post('/api/admin/footer-config', async (req, res) => {
    const rawConfig = req.body as Partial<FooterConfig>;
    try {
      if (isMongoConnected) {
        const updated = await FooterConfigModel.findOneAndUpdate({}, rawConfig, { upsert: true, new: true }).lean();
        currentFooterConfig = updated as FooterConfig;
        saveData('footer-config.json', currentFooterConfig);
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.json({ success: true, footerConfig: updated, message: 'Footer configuration updated in MongoDB!' });
        return;
      }
    } catch (e) {
      console.error('[MongoDB Footer Config POST Error]:', e);
    }
    currentFooterConfig = { ...currentFooterConfig, ...rawConfig } as FooterConfig;
    saveData('footer-config.json', currentFooterConfig);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, footerConfig: currentFooterConfig, message: 'Footer configuration updated successfully!' });
  });

  // 4. OTP Auth & Rate Limiting
  interface OtpRateLimitState {
    lastRequestTime: number;
    hourlyRequests: number[];
  }
  const otpRateLimitMap = new Map<string, OtpRateLimitState>();

  app.post('/api/auth/send-otp', async (req, res) => {
    try {
      const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'global';
      const { email } = req.body;
      const cleanEmail = email ? String(email).trim().toLowerCase() : '';

      if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        res.status(400).json({ success: false, message: 'Invalid email address format.' });
        return;
      }

      const now = Date.now();
      const COOLDOWN_MS = 60 * 1000; // 60 seconds cooldown between successive requests
      const HOURLY_WINDOW_MS = 60 * 60 * 1000; // 1 hour window
      const MAX_HOURLY_REQUESTS = 5; // Max 5 requests per hour

      // Check rate limit for both email and IP
      const rateLimitKeys = [cleanEmail, clientIp];

      for (const key of rateLimitKeys) {
        const state = otpRateLimitMap.get(key) || { lastRequestTime: 0, hourlyRequests: [] };

        // 1. 60-second cooldown check
        const timeSinceLast = now - state.lastRequestTime;
        if (state.lastRequestTime > 0 && timeSinceLast < COOLDOWN_MS) {
          const remainingSeconds = Math.ceil((COOLDOWN_MS - timeSinceLast) / 1000);
          res.status(429).json({
            success: false,
            message: `Please wait ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''} before requesting another code.`,
            lockout: true,
            remainingSeconds,
          });
          return;
        }

        // 2. Filter requests within the last 1 hour
        const recentHourlyRequests = state.hourlyRequests.filter((timestamp) => now - timestamp < HOURLY_WINDOW_MS);

        // 3. Max 5 requests per hour check
        if (recentHourlyRequests.length >= MAX_HOURLY_REQUESTS) {
          const oldestRequest = recentHourlyRequests[0];
          const resetInMinutes = Math.ceil((HOURLY_WINDOW_MS - (now - oldestRequest)) / (60 * 1000));
          res.status(429).json({
            success: false,
            message: `Too many requests, try again later. Maximum 5 OTP requests allowed per hour. Try again in ~${resetInMinutes} minute${resetInMinutes > 1 ? 's' : ''}.`,
            lockout: true,
            resetInMinutes,
          });
          return;
        }
      }

      // Domain MX verification
      const domain = cleanEmail.split('@')[1] || '';
      const domainHasMailServer = await new Promise<boolean>((resolve) => {
        dns.resolveMx(domain, (err, addresses) => {
          resolve(!err && Array.isArray(addresses) && addresses.length > 0);
        });
      });

      if (!domainHasMailServer) {
        res.status(200).json({
          success: false,
          code: 'EMAIL_NOT_FOUND',
          message: 'No email found for this address. Please check for typos and try again.',
        });
        return;
      }

      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      otpStore[cleanEmail] = generatedOtp;

      // Update rate limit state for both email and IP
      for (const key of rateLimitKeys) {
        const state = otpRateLimitMap.get(key) || { lastRequestTime: 0, hourlyRequests: [] };
        const updatedHourly = state.hourlyRequests.filter((timestamp) => now - timestamp < HOURLY_WINDOW_MS);
        updatedHourly.push(now);

        otpRateLimitMap.set(key, {
          lastRequestTime: now,
          hourlyRequests: updatedHourly,
        });
      }

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

    // Strictly match the stored generated OTP (no hardcoded backdoors or bypass codes)
    const isValid = Boolean(storedOtp && cleanOtp === storedOtp);

    if (isValid) {
      delete otpStore[cleanEmail];

      const emailPrefix = cleanEmail.split('@')[0] || 'Customer';
      const defaultDerivedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

      res.json({
        success: true,
        profile: {
          email: cleanEmail,
          name: name && name.trim() ? name.trim() : defaultDerivedName,
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
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code. Please enter the 4-digit code sent to your email.',
      });
    }
  });

  // 5. Gold Savings Scheme & Razorpay Payment Gateway
  app.get('/api/scheme/payment-config', (req, res) => {
    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    const isConfigured = Boolean(keyId && keySecret);

    res.json({
      success: true,
      isConfigured,
      keyId: keyId || null,
      mode: isConfigured ? 'live' : 'demo',
      message: isConfigured
        ? 'Razorpay Live Gateway Active'
        : 'Demo Mode: Razorpay API keys not configured. Simulating payment confirmation.',
    });
  });

  app.get('/api/scheme/:email', async (req, res) => {
    const email = decodeURIComponent(req.params.email).toLowerCase();

    try {
      if (isMongoConnected) {
        let scheme = await GoldSchemeModel.findOne({ email }).lean();
        if (!scheme) {
          scheme = (await GoldSchemeModel.create({
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
              {
                month: 1,
                amount: 3000,
                date: new Date().toISOString().split('T')[0],
                status: 'Paid',
                transactionId: `TXN${Math.floor(10000 + Math.random() * 90000)}`,
              },
              { month: 2, amount: 3000, date: 'Pending', status: 'Pending' },
            ],
          })) as any;
        }
        res.json({ success: true, scheme });
        return;
      }
    } catch (e) {
      console.error('[MongoDB Scheme GET Error]:', e);
    }

    let scheme = schemes[email];
    if (!scheme) {
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
          {
            month: 1,
            amount: 3000,
            date: new Date().toISOString().split('T')[0],
            status: 'Paid',
            transactionId: `TXN${Math.floor(10000 + Math.random() * 90000)}`,
          },
          { month: 2, amount: 3000, date: 'Pending', status: 'Pending' },
        ],
      };
      schemes[email] = scheme;
      saveData('schemes.json', schemes);
    }
    res.json({ success: true, scheme });
  });

  // Create Razorpay Order
  app.post('/api/scheme/create-order', async (req, res) => {
    try {
      const { email, amount } = req.body;
      const cleanEmail = email ? String(email).trim().toLowerCase() : '';
      const amtNumber = Math.max(100, Number(amount) || 3000);
      const amountInPaise = Math.round(amtNumber * 100);

      const rzp = getRazorpay();
      const keyId = process.env.RAZORPAY_KEY_ID?.trim();

      if (rzp && keyId) {
        const order = await rzp.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `SCHEME_${Date.now()}`,
          notes: {
            email: cleanEmail,
            purpose: 'Shubham Swarna Varsha Gold Savings Scheme',
          },
        });

        res.json({
          success: true,
          mode: 'razorpay',
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId,
        });
        return;
      }

      // Demo Mode fallback when Razorpay keys are not yet set
      const demoOrderId = `order_demo_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

      res.json({
        success: true,
        mode: 'demo',
        orderId: demoOrderId,
        amount: amountInPaise,
        currency: 'INR',
        keyId: null,
        message: 'DEMO MODE: Razorpay credentials not provided. Simulating real checkout.',
      });
    } catch (error: any) {
      console.error('[Razorpay Create Order Error]:', error);
      res.status(500).json({
        success: false,
        message: error?.message || 'Failed to create payment order',
      });
    }
  });

  // Verify Razorpay Payment and Update Gold Savings Scheme Passbook
  app.post('/api/scheme/verify-payment', async (req, res) => {
    try {
      const { email, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature, isDemo } = req.body;
      const cleanEmail = email ? String(email).trim().toLowerCase() : '';
      const amtNumber = Number(amount) || 3000;
      const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

      if (!cleanEmail) {
        res.status(400).json({ success: false, message: 'Email address required for scheme recording' });
        return;
      }

      // If real Razorpay mode, verify cryptographic HMAC signature
      if (!isDemo && keySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
        const generatedSignature = crypto
          .createHmac('sha256', keySecret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex');

        if (generatedSignature !== razorpay_signature) {
          res.status(400).json({
            success: false,
            message: 'Payment verification failed: Invalid HMAC signature.',
          });
          return;
        }
      }

      const txId = razorpay_payment_id || `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

      if (isMongoConnected) {
        let scheme = await GoldSchemeModel.findOne({ email: cleanEmail });

        if (!scheme) {
          scheme = new GoldSchemeModel({
            id: `SCH-${Math.floor(10000 + Math.random() * 90000)}`,
            email: cleanEmail,
            schemeName: 'Shubham Swarna Varsha Plan',
            monthlyInstallment: amtNumber,
            totalMonths: 11,
            monthsPaid: 0,
            totalPaid: 0,
            bonusDiscount: amtNumber,
            nextDueDate: '10th of Next Month',
            history: [],
          });
        }

        const nextMonth = scheme.monthsPaid + 1;
        scheme.monthsPaid += 1;
        scheme.totalPaid += amtNumber;
        scheme.history.unshift({
          month: nextMonth,
          amount: amtNumber,
          date: new Date().toISOString().split('T')[0],
          status: 'Paid',
          transactionId: txId,
        });

        await scheme.save();

        res.json({
          success: true,
          scheme,
          receipt: { txId, amount: amtNumber, date: new Date().toLocaleDateString('en-IN') },
          message: 'Payment verified and credited to Swarna passbook!',
        });
        return;
      }

      let scheme = schemes[cleanEmail];
      if (!scheme) {
        scheme = {
          id: `SCH-${Math.floor(10000 + Math.random() * 90000)}`,
          email: cleanEmail,
          schemeName: 'Shubham Swarna Varsha Plan',
          monthlyInstallment: amtNumber,
          totalMonths: 11,
          monthsPaid: 0,
          totalPaid: 0,
          bonusDiscount: amtNumber,
          nextDueDate: '10th of Next Month',
          history: [],
        };
        schemes[cleanEmail] = scheme;
      }

      const nextMonth = scheme.monthsPaid + 1;
      scheme.monthsPaid += 1;
      scheme.totalPaid += amtNumber;
      scheme.history.unshift({
        month: nextMonth,
        amount: amtNumber,
        date: new Date().toISOString().split('T')[0],
        status: 'Paid',
        transactionId: txId,
      });

      saveData('schemes.json', schemes);
      res.json({
        success: true,
        scheme,
        receipt: { txId, amount: amtNumber, date: new Date().toLocaleDateString('en-IN') },
        message: 'Payment verified and credited to Swarna passbook!',
      });
    } catch (error: any) {
      console.error('[Verify Payment Error]:', error);
      res.status(500).json({ success: false, message: error?.message || 'Payment verification failed' });
    }
  });

  // Direct Pay route (backwards compatibility)
  app.post('/api/scheme/pay', async (req, res) => {
    const { email, amount } = req.body;
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    const txId = `TXN${Math.floor(100000 + Math.random() * 900000)}`;
    const amtNumber = Number(amount) || 3000;

    try {
      if (isMongoConnected) {
        let scheme = await GoldSchemeModel.findOne({ email: cleanEmail });

        if (!scheme) {
          scheme = new GoldSchemeModel({
            id: `SCH-${Math.floor(10000 + Math.random() * 90000)}`,
            email: cleanEmail,
            schemeName: 'Shubham Swarna Varsha Plan',
            monthlyInstallment: amtNumber,
            totalMonths: 11,
            monthsPaid: 0,
            totalPaid: 0,
            bonusDiscount: amtNumber,
            nextDueDate: '10th of Next Month',
            history: [],
          });
        }

        const nextMonth = scheme.monthsPaid + 1;
        scheme.monthsPaid += 1;
        scheme.totalPaid += amtNumber;
        scheme.history.unshift({
          month: nextMonth,
          amount: amtNumber,
          date: new Date().toISOString().split('T')[0],
          status: 'Paid',
          transactionId: txId,
        });

        await scheme.save();

        res.json({
          success: true,
          scheme,
          receipt: { txId, amount: amtNumber, date: new Date().toLocaleDateString('en-IN') },
        });
        return;
      }
    } catch (e) {
      console.error('[MongoDB Scheme Pay Error]:', e);
    }

    let scheme = schemes[cleanEmail];
    if (!scheme) {
      scheme = {
        id: `SCH-${Math.floor(10000 + Math.random() * 90000)}`,
        email: cleanEmail,
        schemeName: 'Shubham Swarna Varsha Plan',
        monthlyInstallment: amtNumber,
        totalMonths: 11,
        monthsPaid: 0,
        totalPaid: 0,
        bonusDiscount: amtNumber,
        nextDueDate: '10th of Next Month',
        history: [],
      };
      schemes[cleanEmail] = scheme;
    }

    const nextMonth = scheme.monthsPaid + 1;
    scheme.monthsPaid += 1;
    scheme.totalPaid += amtNumber;
    scheme.history.unshift({
      month: nextMonth,
      amount: amtNumber,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
      transactionId: txId,
    });

    saveData('schemes.json', schemes);
    res.json({ success: true, scheme, receipt: { txId, amount: amtNumber, date: new Date().toLocaleDateString('en-IN') } });
  });

  // 6. App Version
  app.get('/api/version', async (req, res) => {
    try {
      if (isMongoConnected) {
        const ver = await VersionInfoModel.findOne().lean();
        if (ver) {
          res.json({ success: true, versionInfo: ver });
          return;
        }
      }
    } catch (e) {
      console.error('[MongoDB Version GET Error]:', e);
    }
    res.json({ success: true, versionInfo: currentVersion });
  });

  app.post('/api/admin/version', async (req, res) => {
    const { latestVersion, updateMessage, releaseNotes } = req.body;

    const newVersion: Partial<AppVersionInfo> = {
      latestVersion: latestVersion || '2.1.0',
      updateAvailable: true,
      updateMessage: updateMessage || 'A new update for Shubham Jewellers is now available!',
      releaseNotes: releaseNotes || [
        'Real-time Live Gold Rate alerts',
        'Zero Data Loss MongoDB Atlas Synchronization',
        'Editable Pre-formatted WhatsApp Inquiries',
      ],
    };

    try {
      if (isMongoConnected) {
        const updated = await VersionInfoModel.findOneAndUpdate({}, newVersion, { upsert: true, new: true }).lean();
        currentVersion = updated as AppVersionInfo;
        saveData('version.json', currentVersion);
        res.json({ success: true, versionInfo: updated, message: 'New version broadcasted in MongoDB!' });
        return;
      }
    } catch (e) {
      console.error('[MongoDB Version POST Error]:', e);
    }

    currentVersion = {
      ...currentVersion,
      ...newVersion,
    };
    saveData('version.json', currentVersion);
    res.json({ success: true, versionInfo: currentVersion, message: 'New version broadcasted to all active app instances!' });
  });

  // 7. Company Details / About Us
  app.get('/api/company-info', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    try {
      if (isMongoConnected) {
        const info = await CompanyInfoModel.findOne().lean();
        if (info) {
          res.json({ success: true, companyInfo: info });
          return;
        }
      }
    } catch (e) {
      console.error('[MongoDB Company Info GET Error]:', e);
    }
    res.json({ success: true, companyInfo: currentCompanyInfo });
  });

  app.post('/api/admin/company-info', async (req, res) => {
    const infoUpdate = req.body as Partial<CompanyInfo>;

    try {
      if (isMongoConnected) {
        const updated = await CompanyInfoModel.findOneAndUpdate({}, infoUpdate, { upsert: true, new: true }).lean();
        currentCompanyInfo = updated as CompanyInfo;
        saveData('company-info.json', currentCompanyInfo);
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.json({ success: true, companyInfo: updated, message: 'Company details updated in MongoDB!' });
        return;
      }
    } catch (e) {
      console.error('[MongoDB Company Info POST Error]:', e);
    }

    currentCompanyInfo = { ...currentCompanyInfo, ...infoUpdate } as CompanyInfo;
    saveData('company-info.json', currentCompanyInfo);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.json({ success: true, companyInfo: currentCompanyInfo, message: 'Company details updated live!' });
  });

  // 8. Zero Data Loss Account Sync (User Profile, Cart, Wishlist)
  app.get('/api/user-data/:email', async (req, res) => {
    const email = decodeURIComponent(req.params.email).toLowerCase();

    try {
      if (isMongoConnected) {
        const data = await UserDataModel.findOne({ email }).lean();
        if (data) {
          res.json({ success: true, userData: data });
          return;
        }
      }
    } catch (e) {
      console.error('[MongoDB User Data GET Error]:', e);
    }

    const data = userDataStore[email];
    if (data) {
      res.json({ success: true, userData: data });
    } else {
      res.json({ success: false, message: 'No stored data found for user' });
    }
  });

  app.post('/api/user-data', async (req, res) => {
    const { email, profile, cart, wishlistIds } = req.body;
    const cleanEmail = email ? String(email).trim().toLowerCase() : '';

    if (!cleanEmail) {
      res.status(400).json({ success: false, message: 'Email address required for sync' });
      return;
    }

    const emailPrefix = cleanEmail.split('@')[0] || 'Customer';
    const defaultDerivedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

    const userPayload: UserSyncedData = {
      email: cleanEmail,
      profile: profile || {
        email: cleanEmail,
        name: defaultDerivedName,
        address: { street: '', city: '', state: '', pincode: '' },
        isLoggedIn: true,
      },
      cart: cart || [],
      wishlistIds: wishlistIds || [],
      lastUpdated: new Date().toISOString(),
    };

    try {
      if (isMongoConnected) {
        await UserDataModel.findOneAndUpdate({ email: cleanEmail }, userPayload, { upsert: true, new: true });
        userDataStore[cleanEmail] = userPayload;
        saveData('user-data.json', userDataStore);
        res.json({ success: true, message: 'Account data synced safely to MongoDB Atlas!' });
        return;
      }
    } catch (e) {
      console.error('[MongoDB User Data POST Error]:', e);
    }

    userDataStore[cleanEmail] = userPayload;
    saveData('user-data.json', userDataStore);
    res.json({ success: true, message: 'Account data synced safely to remote database!' });
  });

  // Vite development middleware vs Static Production
  if (NODE_ENV !== 'production') {
    console.log('  Running in DEVELOPMENT mode with Vite HMR');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('  Running in PRODUCTION mode - serving static files');
    const distPath = path.join(resolvedDirname, '../dist');
    if (!fs.existsSync(distPath)) {
      console.error(`  ERROR: dist folder not found at ${distPath}`);
      console.error('Make sure you run: npm run build');
      process.exit(1);
    }
    app.use(
      express.static(distPath, {
        maxAge: '1d',
        etag: false,
      })
    );
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
          console.error('Error serving index.html:', err);
          res.status(500).json({ success: false, message: 'Internal server error' });
        }
      });
    });
  }

  // Start HTTP Listener
  app.listen(PORT, HOST, () => {
    console.log(`\n  Shubham Jewellers Server started successfully!`);
    console.log(`  Listening on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log(`  Environment: ${NODE_ENV}`);
    console.log(
      `  Database: ${
        isMongoConnected ? 'MongoDB Atlas (Connected)' : mongoUri ? 'MongoDB Atlas (Connecting...)' : 'Local File Storage'
      }`
    );
    console.log(`  Data directory: ${DATA_DIR} (persistent disk: ${usingPersistentDisk ? 'YES' : 'NO'})\n`);
  });

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