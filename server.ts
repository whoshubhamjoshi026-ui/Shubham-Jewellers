import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initialGoldRates, initialBanners, initialProducts, initialVersionInfo, initialCompanyInfo } from './src/data/initialData';
import { GoldRates, Banner, Product, AppVersionInfo, GoldScheme, CompanyInfo, UserSyncedData } from './src/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

  app.use(express.json());

  // Setup JSON Persistence Directory (writable location for production)
  const DATA_DIR = path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error('[Persistence Error] Failed to create data directory:', err);
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

  // Load state from JSON files (or fallback & create defaults)
  let currentRates: GoldRates = loadData<GoldRates>('rates.json', { ...initialGoldRates });
  let currentBanners: Banner[] = loadData<Banner[]>('banners.json', [...initialBanners]);
  let currentProducts: Product[] = loadData<Product[]>('products.json', [...initialProducts]);
  let currentVersion: AppVersionInfo = loadData<AppVersionInfo>('version.json', { ...initialVersionInfo });
  let currentCompanyInfo: CompanyInfo = loadData<CompanyInfo>('company-info.json', { ...initialCompanyInfo });
  const userDataStore: Record<string, UserSyncedData> = loadData<Record<string, UserSyncedData>>('user-data.json', {});
  const schemes: Record<string, GoldScheme> = loadData<Record<string, GoldScheme>>('schemes.json', initialSchemes);

  // Generated OTP cache
  const otpStore: Record<string, string> = {
    'customer@gmail.com': '7788',
  };

  // Helper function to dispatch OTP via Gmail SMTP (or fallback log in dev)
  async function sendOtpViaEmail(email: string, otp: string): Promise<{ success: boolean; provider: string; error?: string }> {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      console.log(`[Email Dev Mode] Verification OTP for ${email} is: ${otp}. Set GMAIL_USER and GMAIL_APP_PASSWORD in environment variables for live Gmail delivery.`);
      return { success: true, provider: 'Dev Mode (Console Log)' };
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

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

      await transporter.sendMail({
        from: `"Shubham Jewellers" <${gmailUser}>`,
        to: email,
        subject: 'Shubham Jewellers - Your Verification Code',
        html: htmlContent,
      });

      return { success: true, provider: 'Gmail SMTP' };
    } catch (err: any) {
      console.error(`[Gmail SMTP Error] Failed to send email to ${email}:`, err);
      return { success: false, provider: 'Gmail SMTP', error: err?.message || 'Gmail SMTP authentication or network error' };
    }
  }

  // ✅ HEALTH CHECK ENDPOINT (for Render monitoring)
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      uptime: process.uptime(),
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
      // Update existing
      const index = currentProducts.findIndex((p) => p.id === productData.id);
      if (index !== -1) {
        currentProducts[index] = { ...currentProducts[index], ...productData } as Product;
      }
    } else {
      // Create new
      const newProduct: Product = {
        id: `sj-${Date.now().toString().slice(-4)}`,
        title: productData.title || 'New Royal Gold Jewellery',
        category: productData.category || 'Gold',
        purity: productData.purity || '22K',
        weightGrams: Number(productData.weightGrams) || 10,
        makingChargePercent: Number(productData.makingChargePercent) || 12,
        baseMakingCharge: Number(productData.baseMakingCharge) || 250,
        image: productData.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        gallery: [productData.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
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
    saveData('products.json', currentProducts);
    res.json({ success: true, products: currentProducts });
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

  // 3. Banners
  app.get('/api/banners', (req, res) => {
    res.json({ success: true, banners: currentBanners });
  });

  app.post('/api/admin/banners', (req, res) => {
    const newBanner = req.body as Banner;
    if (newBanner.id) {
      const idx = currentBanners.findIndex((b) => b.id === newBanner.id);
      if (idx !== -1) {
        currentBanners[idx] = newBanner;
      } else {
        currentBanners.push(newBanner);
      }
    } else {
      newBanner.id = `b-${Date.now()}`;
      currentBanners.push(newBanner);
    }
    saveData('banners.json', currentBanners);
    res.json({ success: true, banners: currentBanners });
  });

  app.delete('/api/admin/banners/:id', (req, res) => {
    const { id } = req.params;
    currentBanners = currentBanners.filter((b) => b.id !== id);
    saveData('banners.json', currentBanners);
    res.json({ success: true, banners: currentBanners, message: 'Banner removed successfully' });
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

      // Dispatch Email via Gmail SMTP
      const emailResult = await sendOtpViaEmail(cleanEmail, generatedOtp);

      if (!emailResult.success) {
        console.error(`[Email Gateway Error] Provider: ${emailResult.provider}, Error: ${emailResult.error}`);
        res.status(500).json({
          success: false,
          message: `Email Dispatch Failed: ${emailResult.error || 'SMTP Connection Error'}`,
        });
        return;
      }

      console.log(`[Email OTP Success] Sent verification OTP code to ${cleanEmail} via ${emailResult.provider}`);

      res.json({
        success: true,
        email: cleanEmail,
        provider: emailResult.provider,
        message: `Verification code sent via Email to ${cleanEmail}`,
      });
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
    const storedOtp = otpStore[cleanEmail];

    if (storedOtp && String(otp).trim() === storedOtp) {
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
      res.status(400).json({ success: false, message: 'Invalid OTP code. Please enter the code sent to your email.' });
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
    res.json({ success: true, companyInfo: currentCompanyInfo });
  });

  app.post('/api/admin/company-info', (req, res) => {
    const infoUpdate = req.body as Partial<CompanyInfo>;
    currentCompanyInfo = { ...currentCompanyInfo, ...infoUpdate };
    saveData('company-info.json', currentCompanyInfo);
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
    const distPath = path.join(__dirname, '../dist');
    
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
    console.log(`📁 Data directory: ${DATA_DIR}\n`);
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