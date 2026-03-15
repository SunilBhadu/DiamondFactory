"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
// Diamond data generators
const shapes = ['ROUND', 'OVAL', 'CUSHION', 'PRINCESS', 'EMERALD', 'PEAR', 'RADIANT', 'MARQUISE', 'ASSCHER', 'HEART'];
const colors = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
const clarities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
const cuts = ['Ideal', 'Excellent', 'Very Good', 'Good'];
const polishes = ['Excellent', 'Very Good', 'Good'];
const fluorescences = ['None', 'Faint', 'Medium', 'Strong'];
const labs = ['GIA', 'IGI', 'AGS'];
function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomBetween(min, max, decimals = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}
function generateDiamondPrice(carat, color, clarity, labGrown) {
    // Base price per carat (INR)
    const basePricePerCarat = labGrown ? 30000 : 150000;
    // Color multiplier
    const colorMultiplier = {
        D: 2.0, E: 1.8, F: 1.6, G: 1.4, H: 1.2, I: 1.0, J: 0.9, K: 0.8,
    };
    // Clarity multiplier
    const clarityMultiplier = {
        FL: 2.5, IF: 2.0, VVS1: 1.7, VVS2: 1.5, VS1: 1.3, VS2: 1.1, SI1: 1.0, SI2: 0.9,
    };
    // Carat weight exponential premium
    const caratPremium = Math.pow(carat, 1.8);
    const price = basePricePerCarat *
        caratPremium *
        (colorMultiplier[color] || 1.0) *
        (clarityMultiplier[clarity] || 1.0);
    // Round to nearest 1000
    return Math.round(price / 1000) * 1000;
}
async function main() {
    console.log('🌱 Starting Diamond Factory seed...');
    // ─── Admin User ───────────────────────────────────────────────────────────
    console.log('Creating admin user...');
    const passwordHash = await bcrypt.hash('Admin@1234', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@diamondfactory.in' },
        update: {},
        create: {
            email: 'admin@diamondfactory.in',
            passwordHash,
            firstName: 'Diamond',
            lastName: 'Admin',
            role: 'ADMIN',
            isEmailVerified: true,
            isActive: true,
        },
    });
    console.log(`✅ Admin user created: ${admin.email}`);
    // Staff user
    const staffHash = await bcrypt.hash('Staff@1234', 12);
    await prisma.user.upsert({
        where: { email: 'staff@diamondfactory.in' },
        update: {},
        create: {
            email: 'staff@diamondfactory.in',
            passwordHash: staffHash,
            firstName: 'Staff',
            lastName: 'Member',
            role: 'STAFF',
            isEmailVerified: true,
            isActive: true,
        },
    });
    // Test customer
    const customerHash = await bcrypt.hash('Customer@1234', 12);
    await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            email: 'customer@example.com',
            passwordHash: customerHash,
            firstName: 'Priya',
            lastName: 'Sharma',
            phone: '+91 98765 43210',
            role: 'CUSTOMER',
            isEmailVerified: true,
            isActive: true,
        },
    });
    // ─── Suppliers ────────────────────────────────────────────────────────────
    console.log('Creating suppliers...');
    const rapNet = await prisma.supplier.upsert({
        where: { code: 'RAPNET' },
        update: {},
        create: {
            name: 'RapNet Diamond Network',
            code: 'RAPNET',
            apiType: 'rapnet',
            markupPct: 12,
            currency: 'USD',
            leadTimeDays: 5,
            isActive: true,
        },
    });
    const igiDirect = await prisma.supplier.upsert({
        where: { code: 'IGI-DIRECT' },
        update: {},
        create: {
            name: 'IGI Direct Mumbai',
            code: 'IGI-DIRECT',
            apiType: 'custom',
            markupPct: 8,
            currency: 'INR',
            leadTimeDays: 3,
            isActive: true,
        },
    });
    const ownInventory = await prisma.supplier.upsert({
        where: { code: 'DF-OWN' },
        update: {},
        create: {
            name: 'Diamond Factory Own Inventory',
            code: 'DF-OWN',
            apiType: null,
            markupPct: 0,
            currency: 'INR',
            leadTimeDays: 0,
            isActive: true,
        },
    });
    console.log('✅ Suppliers created');
    // ─── Diamonds ─────────────────────────────────────────────────────────────
    console.log('Creating 50 diamonds...');
    const diamondData = [];
    for (let i = 1; i <= 50; i++) {
        const shape = randomFrom(shapes);
        const caratWeight = randomBetween(0.3, 3.0, 2);
        const color = randomFrom(colors);
        const clarity = randomFrom(clarities);
        const cut = randomFrom(cuts);
        const isLabGrown = i % 3 === 0; // 1/3 lab grown
        const lab = randomFrom(labs);
        const priceInr = generateDiamondPrice(caratWeight, color, clarity, isLabGrown);
        const depthPct = randomBetween(58, 65, 1);
        const tablePct = randomBetween(54, 62, 1);
        const supplierIds = [rapNet.id, igiDirect.id, ownInventory.id];
        const supplierId = supplierIds[Math.floor(Math.random() * supplierIds.length)];
        diamondData.push({
            sku: `DF-${shape.substring(0, 3).toUpperCase()}-${String(i).padStart(3, '0')}`,
            stockId: `STOCK-${String(i).padStart(5, '0')}`,
            supplierId,
            supplierStockId: `SUP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            shape,
            caratWeight,
            color,
            clarity,
            cut,
            polish: randomFrom(polishes),
            symmetry: randomFrom(polishes),
            fluorescence: randomFrom(fluorescences),
            certificateLab: lab,
            certificateNo: `${lab}-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            certificateUrl: `https://www.gia.edu/report-check?reportno=${Math.floor(Math.random() * 9000000000)}`,
            depthPct,
            tablePct,
            lengthMm: randomBetween(4.5, 12.0, 2),
            widthMm: randomBetween(4.3, 11.5, 2),
            depthMm: randomBetween(2.5, 7.5, 2),
            girdle: 'Medium to Slightly Thick',
            culet: 'None',
            crownAngle: randomBetween(32, 36, 1),
            pavilionAngle: randomBetween(40, 43, 1),
            lwRatio: parseFloat((randomBetween(95, 115, 0) / 100).toFixed(2)),
            eyeClean: clarity.startsWith('V') || clarity.startsWith('F') || clarity === 'IF',
            isLabGrown,
            originCountry: isLabGrown ? null : randomFrom(['India', 'Russia', 'Botswana', 'South Africa', 'Canada']),
            costPrice: Math.round(priceInr * 0.75),
            priceInr,
            markupPct: 33,
            currency: 'INR',
            isAvailable: Math.random() > 0.1,
            isMemo: false,
            isFeatured: i <= 6, // first 6 are featured
        });
    }
    for (const diamond of diamondData) {
        const { ...diamondFields } = diamond;
        const created = await prisma.diamond.upsert({
            where: { sku: diamond.sku },
            update: {},
            create: diamondFields,
        });
        // Create a primary image for each diamond
        const existingImage = await prisma.diamondImage.findFirst({
            where: { diamondId: created.id },
        });
        if (!existingImage) {
            await prisma.diamondImage.create({
                data: {
                    diamondId: created.id,
                    url: `https://images.unsplash.com/photo-${1573408301185 + diamondData.indexOf(diamond)}?w=800&q=80`,
                    type: 'photo',
                    angle: 'front',
                    isPrimary: true,
                    sortOrder: 0,
                },
            });
        }
    }
    console.log('✅ 50 diamonds created');
    // ─── Ring Settings ────────────────────────────────────────────────────────
    console.log('Creating ring settings...');
    const ringSettingsData = [
        // Solitaire settings
        {
            sku: 'SET-ARIA-PLT',
            name: 'The Aria Solitaire',
            slug: 'the-aria-solitaire',
            style: 'solitaire',
            metalType: 'PLATINUM',
            metalWeightG: 4.2,
            compatibleShapes: JSON.stringify(['ROUND', 'OVAL', 'CUSHION', 'PRINCESS']),
            minCarat: 0.3,
            maxCarat: 5.0,
            centerProng: 4,
            engravingAvailable: true,
            maxEngravingChars: 20,
            basePrice: 45000,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80',
        },
        {
            sku: 'SET-ARIA-WG18',
            name: 'The Aria Solitaire (White Gold)',
            slug: 'the-aria-solitaire-white-gold',
            style: 'solitaire',
            metalType: 'WHITE_GOLD_18K',
            metalWeightG: 3.8,
            compatibleShapes: JSON.stringify(['ROUND', 'OVAL', 'CUSHION', 'PRINCESS']),
            minCarat: 0.3,
            maxCarat: 5.0,
            centerProng: 4,
            engravingAvailable: true,
            maxEngravingChars: 20,
            basePrice: 38000,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80',
        },
        {
            sku: 'SET-GRAND-PLT',
            name: 'The Grand Solitaire',
            slug: 'the-grand-solitaire',
            style: 'solitaire',
            metalType: 'PLATINUM',
            metalWeightG: 5.5,
            compatibleShapes: JSON.stringify(['ROUND', 'OVAL', 'CUSHION', 'PRINCESS', 'RADIANT']),
            minCarat: 0.5,
            maxCarat: 8.0,
            centerProng: 6,
            engravingAvailable: true,
            maxEngravingChars: 25,
            basePrice: 65000,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80',
        },
        {
            sku: 'SET-BEZEL-WG18',
            name: 'The Bezel Modern',
            slug: 'the-bezel-modern',
            style: 'solitaire',
            metalType: 'WHITE_GOLD_18K',
            metalWeightG: 4.0,
            compatibleShapes: JSON.stringify(['ROUND', 'OVAL']),
            minCarat: 0.5,
            maxCarat: 3.0,
            centerProng: 0,
            engravingAvailable: true,
            maxEngravingChars: 15,
            basePrice: 52000,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=500&q=80',
        },
        // Halo settings
        {
            sku: 'SET-CELESTIAL-WG18',
            name: 'The Celestial Halo',
            slug: 'the-celestial-halo',
            style: 'halo',
            metalType: 'WHITE_GOLD_18K',
            metalWeightG: 5.8,
            compatibleShapes: JSON.stringify(['ROUND', 'OVAL', 'CUSHION', 'RADIANT']),
            minCarat: 0.5,
            maxCarat: 4.0,
            centerProng: 4,
            sideStones: JSON.stringify([{ shape: 'ROUND', totalCarat: 0.25, color: 'F', clarity: 'VS1', count: 30 }]),
            engravingAvailable: true,
            maxEngravingChars: 20,
            basePrice: 65000,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500&q=80',
        },
        {
            sku: 'SET-FLORAL-RG18',
            name: 'The Floral Halo',
            slug: 'the-floral-halo',
            style: 'halo',
            metalType: 'ROSE_GOLD_18K',
            metalWeightG: 5.2,
            compatibleShapes: JSON.stringify(['ROUND', 'OVAL', 'PEAR']),
            minCarat: 0.5,
            maxCarat: 3.5,
            centerProng: 4,
            sideStones: JSON.stringify([{ shape: 'ROUND', totalCarat: 0.20, color: 'G', clarity: 'VS2', count: 24 }]),
            engravingAvailable: true,
            maxEngravingChars: 20,
            basePrice: 78000,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
        },
        {
            sku: 'SET-DOUBLE-PLT',
            name: 'The Double Halo Prestige',
            slug: 'the-double-halo-prestige',
            style: 'halo',
            metalType: 'PLATINUM',
            metalWeightG: 7.0,
            compatibleShapes: JSON.stringify(['ROUND', 'CUSHION']),
            minCarat: 1.0,
            maxCarat: 5.0,
            centerProng: 4,
            sideStones: JSON.stringify([{ shape: 'ROUND', totalCarat: 0.40, color: 'F', clarity: 'VVS2', count: 50 }]),
            engravingAvailable: true,
            maxEngravingChars: 20,
            basePrice: 98000,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
        },
        // Three-stone settings
        {
            sku: 'SET-ETERNITY-PLT',
            name: 'The Eternity Three-Stone',
            slug: 'the-eternity-three-stone',
            style: 'three-stone',
            metalType: 'PLATINUM',
            metalWeightG: 6.5,
            compatibleShapes: JSON.stringify(['ROUND', 'OVAL', 'CUSHION', 'RADIANT', 'EMERALD']),
            minCarat: 0.5,
            maxCarat: 4.0,
            centerProng: 4,
            sideStones: JSON.stringify([{ shape: 'OVAL', totalCarat: 0.50, color: 'G', clarity: 'VS2', count: 2 }]),
            engravingAvailable: true,
            maxEngravingChars: 20,
            basePrice: 85000,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80',
        },
        {
            sku: 'SET-TRILOGY-YG18',
            name: 'The Trilogy Vintage',
            slug: 'the-trilogy-vintage',
            style: 'three-stone',
            metalType: 'YELLOW_GOLD_18K',
            metalWeightG: 6.0,
            compatibleShapes: JSON.stringify(['ROUND', 'OVAL', 'CUSHION']),
            minCarat: 0.5,
            maxCarat: 3.0,
            centerProng: 4,
            sideStones: JSON.stringify([{ shape: 'ROUND', totalCarat: 0.40, color: 'H', clarity: 'VS1', count: 2 }]),
            engravingAvailable: true,
            maxEngravingChars: 20,
            basePrice: 75000,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80',
        },
        // Vintage settings
        {
            sku: 'SET-MILGRAIN-YG18',
            name: 'The Vintage Milgrain',
            slug: 'the-vintage-milgrain',
            style: 'vintage',
            metalType: 'YELLOW_GOLD_18K',
            metalWeightG: 5.0,
            compatibleShapes: JSON.stringify(['ROUND', 'OVAL', 'CUSHION', 'PEAR']),
            minCarat: 0.3,
            maxCarat: 4.0,
            centerProng: 4,
            sideStones: JSON.stringify([{ shape: 'ROUND', totalCarat: 0.15, color: 'G', clarity: 'VS2', count: 20 }]),
            engravingAvailable: true,
            maxEngravingChars: 20,
            basePrice: 72000,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80',
        },
        {
            sku: 'SET-ARTDECO-PLT',
            name: 'The Art Deco Vintage',
            slug: 'the-art-deco-vintage',
            style: 'vintage',
            metalType: 'PLATINUM',
            metalWeightG: 6.8,
            compatibleShapes: JSON.stringify(['EMERALD', 'ASSCHER', 'RADIANT', 'ROUND']),
            minCarat: 0.5,
            maxCarat: 5.0,
            centerProng: 4,
            sideStones: JSON.stringify([{ shape: 'baguette', totalCarat: 0.30, color: 'F', clarity: 'VS1', count: 4 }]),
            engravingAvailable: true,
            maxEngravingChars: 20,
            basePrice: 92000,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=500&q=80',
        },
        // Pavé setting
        {
            sku: 'SET-PAVE-RG18',
            name: 'The Pavé Crown',
            slug: 'the-pave-crown',
            style: 'pave',
            metalType: 'ROSE_GOLD_18K',
            metalWeightG: 5.5,
            compatibleShapes: JSON.stringify(['ROUND', 'OVAL', 'CUSHION', 'RADIANT']),
            minCarat: 0.5,
            maxCarat: 4.0,
            centerProng: 4,
            sideStones: JSON.stringify([{ shape: 'ROUND', totalCarat: 0.50, color: 'F', clarity: 'VS2', count: 60 }]),
            engravingAvailable: true,
            maxEngravingChars: 15,
            basePrice: 58000,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
        },
    ];
    for (const setting of ringSettingsData) {
        const { imageUrl, ...settingFields } = setting;
        const created = await prisma.ringSetting.upsert({
            where: { sku: setting.sku },
            update: {},
            create: settingFields,
        });
        // Create image record
        const existingImage = await prisma.ringSettingImage.findFirst({
            where: { settingId: created.id },
        });
        if (!existingImage) {
            await prisma.ringSettingImage.create({
                data: {
                    settingId: created.id,
                    url: imageUrl,
                    isPrimary: true,
                    sortOrder: 0,
                },
            });
        }
    }
    console.log('✅ 12 ring settings created');
    // ─── Coupons ──────────────────────────────────────────────────────────────
    console.log('Creating coupons...');
    await prisma.coupon.upsert({
        where: { code: 'WELCOME10' },
        update: {},
        create: {
            code: 'WELCOME10',
            discountType: 'PERCENTAGE',
            discountValue: 10,
            minOrderAmount: 50000,
            maxDiscountAmount: 50000,
            usageLimit: 1000,
            expiresAt: new Date('2026-12-31'),
            isActive: true,
        },
    });
    await prisma.coupon.upsert({
        where: { code: 'DIAMOND500' },
        update: {},
        create: {
            code: 'DIAMOND500',
            discountType: 'FIXED_AMOUNT',
            discountValue: 500,
            minOrderAmount: 5000,
            isActive: true,
        },
    });
    await prisma.coupon.upsert({
        where: { code: 'LUXURY15' },
        update: {},
        create: {
            code: 'LUXURY15',
            discountType: 'PERCENTAGE',
            discountValue: 15,
            minOrderAmount: 200000,
            maxDiscountAmount: 100000,
            usageLimit: 500,
            expiresAt: new Date('2026-12-31'),
            isActive: true,
        },
    });
    console.log('✅ Coupons created');
    // ─── Shipping Methods ─────────────────────────────────────────────────────
    await prisma.shippingMethod.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'FedEx Priority Insured',
            carrier: 'FedEx',
            estimatedDays: 3,
            baseRate: 999,
            freeAbove: 50000,
            isActive: true,
        },
    });
    await prisma.shippingMethod.upsert({
        where: { id: '00000000-0000-0000-0000-000000000002' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Express Overnight',
            carrier: 'DHL',
            estimatedDays: 1,
            baseRate: 2999,
            freeAbove: null,
            isActive: true,
        },
    });
    console.log('✅ Shipping methods created');
    console.log('\n🎉 Seed completed successfully!');
    console.log('Admin credentials:');
    console.log('  Email: admin@diamondfactory.in');
    console.log('  Password: Admin@1234');
    console.log('\nTest customer:');
    console.log('  Email: customer@example.com');
    console.log('  Password: Customer@1234');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map