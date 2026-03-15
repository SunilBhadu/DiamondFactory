-- CreateEnum
CREATE TYPE "CustomerRole" AS ENUM ('CUSTOMER', 'ADMIN', 'STAFF', 'SUPPLIER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'QUALITY_CHECK', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('STRIPE', 'RAZORPAY', 'PAYPAL');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('DIAMOND', 'SETTING', 'RING', 'JEWELRY', 'GIFT_CARD');

-- CreateEnum
CREATE TYPE "DiamondShape" AS ENUM ('ROUND', 'PRINCESS', 'OVAL', 'CUSHION', 'MARQUISE', 'PEAR', 'RADIANT', 'ASSCHER', 'EMERALD', 'HEART');

-- CreateEnum
CREATE TYPE "CertificateLab" AS ENUM ('GIA', 'IGI', 'AGS', 'HRD', 'EGL');

-- CreateEnum
CREATE TYPE "MetalType" AS ENUM ('PLATINUM', 'WHITE_GOLD_18K', 'YELLOW_GOLD_18K', 'ROSE_GOLD_18K', 'WHITE_GOLD_14K', 'YELLOW_GOLD_14K', 'ROSE_GOLD_14K');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('IN_PERSON', 'VIRTUAL');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatar" TEXT,
    "role" "CustomerRole" NOT NULL DEFAULT 'CUSTOMER',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "googleId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_addresses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "deviceInfo" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "apiType" TEXT,
    "apiCredentials" JSONB,
    "markupPct" DOUBLE PRECISION NOT NULL DEFAULT 15,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "leadTimeDays" INTEGER NOT NULL DEFAULT 7,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diamonds" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "stockId" TEXT,
    "supplierId" TEXT,
    "supplierStockId" TEXT,
    "shape" "DiamondShape" NOT NULL,
    "caratWeight" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,
    "clarity" TEXT NOT NULL,
    "cut" TEXT,
    "polish" TEXT,
    "symmetry" TEXT,
    "fluorescence" TEXT,
    "certificateLab" "CertificateLab" NOT NULL,
    "certificateNo" TEXT,
    "certificateUrl" TEXT,
    "depthPct" DOUBLE PRECISION,
    "tablePct" DOUBLE PRECISION,
    "lengthMm" DOUBLE PRECISION,
    "widthMm" DOUBLE PRECISION,
    "depthMm" DOUBLE PRECISION,
    "girdle" TEXT,
    "culet" TEXT,
    "crownAngle" DOUBLE PRECISION,
    "pavilionAngle" DOUBLE PRECISION,
    "lwRatio" DOUBLE PRECISION,
    "eyeClean" BOOLEAN NOT NULL DEFAULT false,
    "isLabGrown" BOOLEAN NOT NULL DEFAULT false,
    "originCountry" TEXT,
    "treatment" TEXT,
    "costPrice" DOUBLE PRECISION,
    "priceInr" DOUBLE PRECISION NOT NULL,
    "markupPct" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isReserved" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isSold" BOOLEAN NOT NULL DEFAULT false,
    "isMemo" BOOLEAN NOT NULL DEFAULT false,
    "videoUrl" TEXT,
    "v360Url" TEXT,
    "inWishlistCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diamonds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diamond_images" (
    "id" TEXT NOT NULL,
    "diamondId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT,
    "angle" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diamond_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ring_settings" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "metalType" "MetalType" NOT NULL,
    "metalWeightG" DOUBLE PRECISION,
    "compatibleShapes" JSONB NOT NULL DEFAULT '[]',
    "minCarat" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "maxCarat" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "centerProng" INTEGER,
    "sideStones" JSONB,
    "engravingAvailable" BOOLEAN NOT NULL DEFAULT true,
    "maxEngravingChars" INTEGER DEFAULT 20,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "videoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ring_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ring_setting_images" (
    "id" TEXT NOT NULL,
    "settingId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ring_setting_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT,
    "guestEmail" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentGateway" "PaymentGateway",
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shippingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "couponCode" TEXT,
    "shippingAddressId" TEXT,
    "shippingAddress" JSONB,
    "shippingAddressSnapshot" JSONB,
    "billingAddressSnapshot" JSONB,
    "notes" TEXT,
    "giftMessage" TEXT,
    "isGift" BOOLEAN NOT NULL DEFAULT false,
    "estimatedDelivery" TIMESTAMP(3),
    "fulfilledAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "itemType" "ItemType" NOT NULL,
    "diamondId" TEXT,
    "ringSettingId" TEXT,
    "productId" TEXT,
    "sku" TEXT,
    "name" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION,
    "metalType" TEXT,
    "ringSizeUs" DOUBLE PRECISION,
    "engravingText" TEXT,
    "engravingFont" TEXT,
    "customizations" JSONB,
    "snapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "gateway" "PaymentGateway" NOT NULL,
    "gatewayPaymentId" TEXT,
    "gatewayIntentId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" TEXT,
    "methodDetails" JSONB,
    "riskScore" DOUBLE PRECISION,
    "riskLevel" TEXT,
    "failureReason" TEXT,
    "gatewayResponse" JSONB,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refunds" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "gatewayRefundId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "processedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" TEXT NOT NULL,
    "diamondId" TEXT,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "reorderPoint" INTEGER NOT NULL DEFAULT 0,
    "reorderQty" INTEGER NOT NULL DEFAULT 0,
    "warehouseLocation" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderItemId" TEXT,
    "productType" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "photos" JSONB NOT NULL DEFAULT '[]',
    "isVerifiedPurchase" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Wishlist',
    "shareToken" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" TEXT NOT NULL,
    "wishlistId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "diamondId" TEXT,
    "settingId" TEXT,
    "productId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_snapshots" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "cartData" JSONB NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "recoveryEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "minOrderAmount" DOUBLE PRECISION,
    "maxDiscountAmount" DOUBLE PRECISION,
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "estimatedDays" INTEGER NOT NULL,
    "baseRate" DOUBLE PRECISION NOT NULL,
    "freeAbove" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_bookings" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" "AppointmentType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "notes" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "staffId" TEXT,
    "meetingLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointment_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_googleId_idx" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "user_addresses_userId_idx" ON "user_addresses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_sessionToken_key" ON "user_sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");

-- CreateIndex
CREATE INDEX "user_sessions_sessionToken_idx" ON "user_sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_code_key" ON "suppliers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "diamonds_sku_key" ON "diamonds"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "diamonds_stockId_key" ON "diamonds"("stockId");

-- CreateIndex
CREATE INDEX "diamonds_shape_idx" ON "diamonds"("shape");

-- CreateIndex
CREATE INDEX "diamonds_caratWeight_idx" ON "diamonds"("caratWeight");

-- CreateIndex
CREATE INDEX "diamonds_color_idx" ON "diamonds"("color");

-- CreateIndex
CREATE INDEX "diamonds_clarity_idx" ON "diamonds"("clarity");

-- CreateIndex
CREATE INDEX "diamonds_priceInr_idx" ON "diamonds"("priceInr");

-- CreateIndex
CREATE INDEX "diamonds_isLabGrown_idx" ON "diamonds"("isLabGrown");

-- CreateIndex
CREATE INDEX "diamonds_isAvailable_idx" ON "diamonds"("isAvailable");

-- CreateIndex
CREATE INDEX "diamonds_certificateLab_idx" ON "diamonds"("certificateLab");

-- CreateIndex
CREATE INDEX "diamond_images_diamondId_idx" ON "diamond_images"("diamondId");

-- CreateIndex
CREATE UNIQUE INDEX "ring_settings_sku_key" ON "ring_settings"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ring_settings_slug_key" ON "ring_settings"("slug");

-- CreateIndex
CREATE INDEX "ring_settings_style_idx" ON "ring_settings"("style");

-- CreateIndex
CREATE INDEX "ring_settings_metalType_idx" ON "ring_settings"("metalType");

-- CreateIndex
CREATE INDEX "ring_settings_isActive_idx" ON "ring_settings"("isActive");

-- CreateIndex
CREATE INDEX "ring_setting_images_settingId_idx" ON "ring_setting_images"("settingId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_diamondId_idx" ON "order_items"("diamondId");

-- CreateIndex
CREATE INDEX "order_items_ringSettingId_idx" ON "order_items"("ringSettingId");

-- CreateIndex
CREATE INDEX "payments_orderId_idx" ON "payments"("orderId");

-- CreateIndex
CREATE INDEX "payments_gatewayPaymentId_idx" ON "payments"("gatewayPaymentId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "refunds_paymentId_idx" ON "refunds"("paymentId");

-- CreateIndex
CREATE INDEX "refunds_orderId_idx" ON "refunds"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_diamondId_key" ON "inventory"("diamondId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_sku_key" ON "inventory"("sku");

-- CreateIndex
CREATE INDEX "inventory_itemType_itemId_idx" ON "inventory"("itemType", "itemId");

-- CreateIndex
CREATE INDEX "reviews_productType_productId_idx" ON "reviews"("productType", "productId");

-- CreateIndex
CREATE INDEX "reviews_userId_idx" ON "reviews"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "wishlists_shareToken_key" ON "wishlists"("shareToken");

-- CreateIndex
CREATE INDEX "wishlists_userId_idx" ON "wishlists"("userId");

-- CreateIndex
CREATE INDEX "wishlist_items_wishlistId_idx" ON "wishlist_items"("wishlistId");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_wishlistId_itemType_diamondId_key" ON "wishlist_items"("wishlistId", "itemType", "diamondId");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_wishlistId_itemType_settingId_key" ON "wishlist_items"("wishlistId", "itemType", "settingId");

-- CreateIndex
CREATE INDEX "cart_snapshots_userId_idx" ON "cart_snapshots"("userId");

-- CreateIndex
CREATE INDEX "cart_snapshots_sessionId_idx" ON "cart_snapshots"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_code_idx" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "appointment_bookings_userId_idx" ON "appointment_bookings"("userId");

-- CreateIndex
CREATE INDEX "appointment_bookings_date_idx" ON "appointment_bookings"("date");

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diamonds" ADD CONSTRAINT "diamonds_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diamond_images" ADD CONSTRAINT "diamond_images_diamondId_fkey" FOREIGN KEY ("diamondId") REFERENCES "diamonds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ring_setting_images" ADD CONSTRAINT "ring_setting_images_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES "ring_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "user_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_diamondId_fkey" FOREIGN KEY ("diamondId") REFERENCES "diamonds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_ringSettingId_fkey" FOREIGN KEY ("ringSettingId") REFERENCES "ring_settings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_diamondId_fkey" FOREIGN KEY ("diamondId") REFERENCES "diamonds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "wishlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_diamondId_fkey" FOREIGN KEY ("diamondId") REFERENCES "diamonds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES "ring_settings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_snapshots" ADD CONSTRAINT "cart_snapshots_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_bookings" ADD CONSTRAINT "appointment_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_bookings" ADD CONSTRAINT "appointment_bookings_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
