<p align="center">
  <img src="./assets/screenshots/IndexScreen-dark.jpg" width="28%" alt="Home Dark" />
  <img src="./assets/screenshots/ProductDetailsScreen-dark.jpg" width="28%" alt="Product Details" />
  <img src="./assets/screenshots/ProfileScreen-dark.jpg" width="28%" alt="Profile" />
</p>

<div align="center">

# 🛍 Expo Marketplace

**Cross-Platform Mobile Marketplace** — *Browse, search, and purchase products with a sleek adaptive theme.*

[![Expo](https://img.shields.io/badge/Expo_SDK-54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase_v12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Expo Router](https://img.shields.io/badge/Expo_Router-6.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://docs.expo.dev/router/introduction/)

<br />

[Features](#features) •
[Tech Stack](#-tech-stack) •
[Architecture](#-project-architecture) •
[Getting Started](#-getting-started) •
[Tests](#-tests) •
[Technical Deep Dive](#-technical-deep-dive)

</div>

---

## 📖 About

**Expo Marketplace** is a full-featured cross-platform mobile marketplace built with **Expo SDK 54** and **Firebase**. It provides a complete e-commerce experience — from user authentication and onboarding to product browsing, cart management, checkout, and push notifications — all wrapped in a polished adaptive theme (dark/light).

```
┌──────────────────────────────────────────┐
│  Email/Google auth · Real-time Firestore │
│  Dark/Light theme · i18n (EN/UK)        │
│  Push notifications · Promo banners     │
└──────────────────────────────────────────┘
```

The app features a file-based routing architecture (Expo Router), real-time data sync via Firestore, Zod-validation-powered forms, animated skeletons, promo code validation, and a complete order lifecycle.

---

## ✨ Features

| # | Feature | Details |
|:--:|---------|---------|
| 🔐 | **Auth Flow** | Email/Password + Google Sign-In via Firebase, persistent sessions |
| 👋 | **Onboarding** | 3-slide intro shown once (AsyncStorage flag) |
| 🔍 | **Live Search & Filters** | Search by name/tags/brand, filter by category/gender/brand/color/price range |
| 🏠 | **Product Catalog** | Home screen with featured products, categories, promo banners |
| 🍕 | **Product Details** | Image gallery with zoom, size/color variants, stock-aware selection |
| 🛒 | **Cart Management** | Real-time cart with swipe-to-delete, quantity controls, fixed order summary |
| 💳 | **Checkout** | Address entry, promo codes, payment card modal, order placement |
| 📋 | **Order History** | Active/Completed/Canceled tabs with status badges |
| 👤 | **Profile** | Editable fields, change password, payment card, avatar (Firestore/pravatar) |
| 🌐 | **i18n** | Full English & Ukrainian localization with LanguageContext |
| 🎨 | **Adaptive Theme** | Automatic dark/light mode via system color scheme |
| 🔔 | **Push Notifications** | Expo Push API + FCM v1, permission toggle, notification list |
| 🏷 | **Promo Codes** | Server-side validation via Firestore, managed through Firebase Console |
| 🖼 | **Promo Banners** | Real-time banners from Firestore, sorted by priority |
| 📤 | **Share** | Native Share API on product details |
| 💀 | **Skeleton Loading** | 8 animated skeleton variants across all screens |
| ⭐ | **Reviews** | Firestore-backed reviews with auto-updated product ratings |

---

## 🛠 Tech Stack

### Frontend & Core

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Expo | `54.0.33` |
| **Language** | TypeScript | `5.9` |
| **UI Library** | React | `19.1.0` |
| **Router** | Expo Router | `6.0.23` |
| **Animations** | react-native-reanimated | `4.1.1` |
| **Gestures** | react-native-gesture-handler | `2.31.1` |
| **Lists** | @shopify/flash-list | `2.0.2` |
| **Safe Area** | react-native-safe-area-context | `5.6.0` |

### Forms & Validation

| Library | Version | Purpose |
|---------|---------|---------|
| **react-hook-form** | `7.72.1` | Performant form state management |
| **Zod** | `4.3.6` | Schema validation + type inference |
| **@hookform/resolvers** | `5.2.2` | Zod-React Hook Form bridge |

### Backend & Services

| Service | Version | Purpose |
|---------|---------|---------|
| **Firebase** (`firebase`) | `12.12.0` | Auth, Firestore, Cloud Messaging |
| **Firebase Admin** (`firebase-admin`) | `13.8.0` | Server-side seeding & operations |
| **AsyncStorage** | `2.2.0` | Local persistence (session, preferences) |

### Internationalization

| Library | Purpose |
|---------|---------|
| **i18n-js** | Runtime translation engine |
| **expo-localization** | Device locale detection |

### Other Key Libraries

| Library | Purpose |
|---------|---------|
| **expo-auth-session** | OIDC / Telegram Auth |
| **expo-notifications** | Push notification handling |
| **expo-image-picker** | Profile photo selection |
| **react-native-actions-sheet** | Bottom sheet UI |
| **react-native-image-pan-zoom** | Image zoom modal |
| **@react-native-google-signin/google-signin** | Native Google Sign-In |
| **@expo/vector-icons** | Icon library |

---

## 📂 Project Architecture

```
expo-marketplace-main/
│
├── app/                               # Expo Router (file-based routing)
│   ├── _layout.tsx                    # Root layout — providers, auth guard
│   │
│   ├── (auth)/                        # 🔑 Unauthenticated flow
│   │   ├── _layout.tsx                # Auth stack layout
│   │   ├── login.tsx                  # Email/password login
│   │   ├── register.tsx               # Registration form
│   │   ├── forgot-password.tsx        # Password reset
│   │   └── success.tsx                # Post-action success screen
│   │
│   ├── (onboarding)/                  # 👋 First-launch onboarding
│   │   └── index.tsx                  # 3-slide onboarding with skip
│   │
│   ├── (tabs)/                        # 📱 Main app (authenticated)
│   │   ├── _layout.tsx                # Bottom tab navigator
│   │   ├── index.tsx                  # Home — featured, banners, categories
│   │   ├── search.tsx                 # Search with filters
│   │   ├── products.tsx               # Product catalog
│   │   ├── product-details/
│   │   │   └── [id].tsx               # Product detail with variants
│   │   ├── cart.tsx                   # Shopping cart
│   │   ├── checkout.tsx               # Order checkout flow
│   │   ├── orders.tsx                 # Order history (3 tabs)
│   │   ├── favorites.tsx              # Wishlist
│   │   ├── categories.tsx             # Category browser
│   │   ├── notifications.tsx          # Push notification list
│   │   └── profile.tsx                # User profile
│   │
│   ├── (settings)/                    # ⚙️ Settings screens
│   │   ├── _layout.tsx
│   │   ├── settings.tsx
│   │   ├── notifications.tsx          # Permission toggle
│   │   ├── language.tsx               # EN/UK switcher
│   │   ├── privacy.tsx
│   │   ├── help-center.tsx
│   │   └── about-us.tsx
│   │
│   ├── (support)/                     # 📩 Support screens
│   │   ├── _layout.tsx
│   │   ├── contact.tsx                # 5 contact methods
│   │   └── share.tsx                  # Native share
│   │
│   ├── (profile-extra)/               # 👤 Extended profile
│   │   ├── _layout.tsx
│   │   └── profile-details.tsx        # Editable profile fields
│   │
│   ├── +html.tsx                      # Web HTML template
│   └── +not-found.tsx                 # 404 screen
│
├── components/                        # 🧩 Reusable UI components
│   ├── ui/
│   │   ├── AppButton.tsx              # Styled button
│   │   ├── AppInput.tsx               # Form input with error display
│   │   ├── BackButton.tsx             # Navigation back button
│   │   ├── PriceRangeSlider.tsx       # Reanimated price slider
│   │   ├── Skeleton.tsx               # 8 animated skeleton variants
│   │   ├── SocialIconButton.tsx       # Social auth icons
│   │   ├── UserAvatar.tsx             # Avatar with Firestore/pravatar fallback
│   │   └── VariantSelector.tsx        # Size/color variant picker
│   │
│   ├── product-details/
│   │   ├── ImageGallery.tsx           # Zoomable image gallery
│   │   └── ProductInfo.tsx            # Product info + variants
│   │
│   ├── profile/
│   │   ├── ProfileFieldRow.tsx        # Editable field row
│   │   ├── AddressModal.tsx           # Address input modal
│   │   ├── ChangePasswordModal.tsx    # Password change modal
│   │   └── PaymentCardModal.tsx       # Card editor with live preview
│   │
│   ├── FiltersSheet.tsx               # Search filter sheet
│   ├── ProductCard.tsx                # Product grid card
│   ├── PromoBanner.tsx                # Paginated promo banner
│   ├── SettingsItem.tsx               # Settings row component
│   ├── SummaryRow.tsx                 # Cart summary row
│   ├── sheets.ts                      # Sheet configurations
│   ├── Themed.tsx                     # Themed SafeAreaView
│   └── StyledText.tsx                 # Themed text component
│
├── context/                           # 🌍 Global state
│   ├── AuthContext.tsx                 # Auth state (login/logout)
│   ├── CartContext.tsx                 # Cart state (items, totals)
│   ├── FavoritesContext.tsx            # Favorites state
│   └── LanguageContext.tsx             # i18n locale state
│
├── hooks/                             # 🪝 Custom hooks
│   ├── useBanners.ts                  # Firestore banner fetch
│   ├── useCart.ts                     # Cart service operations
│   ├── useFavorites.ts                # Favorites service operations
│   ├── useGoogleAuth.ts               # Google Sign-In hook
│   ├── useNotifications.ts            # Notification list
│   ├── useOrders.ts                   # Order lifecycle (place, cancel)
│   ├── useProducts.ts                 # Product queries
│   ├── usePromoCodes.ts               # Promo code validation
│   ├── usePushNotifications.ts        # Push token + permission
│   ├── useTelegramAuth.ts             # Telegram OIDC flow
│   └── useUserProfile.ts              # Profile CRUD operations
│
├── services/                          # 🔌 Firebase services
│   ├── firestore.ts                   # All Firestore CRUD services
│   └── storage.ts                     # Firebase Storage service
│
├── schemas/                           # ✅ Zod validation schemas
│   └── authSchema.ts                  # Login/register/forgot schemas
│
├── types/                             # 📐 TypeScript type definitions
│   ├── index.ts                       # Core types (Product, Cart, Order, etc.)
│   └── categories.ts                  # Category types
│
├── constants/                         # 📊 Constants & config
│   ├── Colors.ts                      # Design system palette
│   ├── authStyles.ts                  # Shared auth screen styles
│   ├── firebase.ts                    # Firebase initialization
│   ├── products.ts                    # Product constants & mocks
│   └── promoCodes.ts                  # Promo code logic
│
├── locales/                           # 🌐 i18n translations
│   ├── en.json                        # English strings
│   ├── ua.json                        # Ukrainian strings
│   └── index.ts                       # i18n-js initialization
│
├── assets/                            # 🖼 Static assets
│   ├── fonts/
│   ├── images/
│   └── screenshots/                   # App previews
│
├── scripts/                           # 📜 Utility scripts
│   └── seed-firestore.js              # Seed products, banners, promos
│
├── firestore.rules                    # Firestore security rules
├── storage.rules                      # Storage security rules
├── firestore.indexes.json             # Composite indexes
├── firebase.json                      # Firebase CLI config
├── app.json                           # Expo config
├── eas.json                           # EAS Build config
└── tsconfig.json                      # TypeScript config
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Check |
|-------------|---------|-------|
| **Node.js** | `>= 18` | `node --version` |
| **npm** or **yarn** | (bundled) | `npm --version` |
| **Expo CLI** | latest | `npx expo --version` |
| **EAS CLI** (optional) | latest | `npx eas --version` |

> 💡 New to Expo? Follow the [official setup guide](https://docs.expo.dev/get-started/installation/).

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/expo-marketplace-main.git
cd expo-marketplace-main

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env   # if .env.example exists, otherwise create .env manually
```

> **Note:** `.env` is already ignored via `.gitignore`. If `.env.example` is not present in the repo, create `.env` manually using the variables below.

### Environment Variables

Create a `.env` file with your Firebase configuration:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id
EXPO_PUBLIC_TELEGRAM_CLIENT_ID=your_telegram_client_id
EXPO_PUBLIC_TELEGRAM_CLIENT_SECRET=your_telegram_client_secret
```

### Running the App

```bash
# Start Expo dev server
npx expo start

# Run on specific platform
npx expo start --android    # Android emulator / device
npx expo start --ios        # iOS simulator
npx expo start --web        # Web browser
```

### Firebase Setup

```bash
# Seed initial data (products, banners, promo codes)
# Requires serviceAccountKey.json in project root
node scripts/seed-firestore.js

# Deploy Firestore rules & indexes
firebase deploy --only firestore
```

---

## 📋 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm start` | `expo start` | Start Expo dev server |
| `npm run android` | `expo run:android` | Build & launch on Android |
| `npm run ios` | `expo run:ios` | Build & launch on iOS |
| `npm run web` | `expo start --web` | Run in web browser |
| `node scripts/seed-firestore.js` | — | Seed Firestore with initial data |

---

## 🧪 Tests

```bash
# Run tests (react-test-renderer)
npx react-test-renderer
```

> **Note:** The current test suite is minimal. Only `components/__tests__/StyledText-test.js` is present. There is no Jest configuration in the project.

---

## 🔬 Technical Deep Dive

### Navigation Architecture

```
app/_layout.tsx (Root — Providers + Auth Guard)
│
├── Unauthenticated
│   └── (auth)/_layout.tsx
│       ├── login.tsx
│       ├── register.tsx
│       ├── forgot-password.tsx
│       └── success.tsx
│
├── Onboarding (first launch only)
│   └── (onboarding)/index.tsx
│
└── Authenticated
    └── (tabs)/_layout.tsx (Bottom Tab Navigator)
        ├── index.tsx (Home)
        ├── search.tsx
        ├── products.tsx
        ├── product-details/[id].tsx
        ├── cart.tsx
        ├── checkout.tsx
        ├── orders.tsx
        ├── favorites.tsx
        ├── categories.tsx
        ├── notifications.tsx
        └── profile.tsx
            ├── (settings)/*          (settings, help, privacy, etc.)
            ├── (support)/*           (contact, share)
            └── (profile-extra)/*     (profile-details)
```

### Data Flow

```
┌──────────┐  queries    ┌──────────────┐  onSnapshot   ┌──────────┐
│  Screens │ ──────────> │  Firestore   │ <──────────── │ Context  │
│  (views) │ <────────── │  (backend)   │ ────────────> │ (state)  │
└──────────┘  real-time  └──────────────┘   updates     └──────────┘
     │                                                    │
     │ user actions                                       │ badge /
     ▼                                                    │ data
┌──────────┐                                     ┌──────────────┐
│ Services │                                     │  Components  │
│ (CRUD)   │                                     │  (UI tree)   │
└──────────┘                                     └──────────────┘
```

### State Management

| Context | State | Methods | Consumers |
|---------|-------|---------|-----------|
| **AuthContext** | `user`, `isAuthenticated`, `photoURL` | `login`, `logout` (Firebase Auth) | `_layout.tsx` (auth guard), profile, avatar |
| **CartContext** | `items`, `totalCount`, `totalPrice` | `addItem`, `removeItem`, `updateQuantity`, `clearCart` | Cart screen, tab badge, checkout |
| **FavoritesContext** | `items`, `count` | `addFavorite`, `removeFavorite` | Favorites screen, product cards |
| **LanguageContext** | `locale`, `t()` | `setLocale` (persisted to AsyncStorage) | All screens via `useLanguage()` |

### Auth Guard Pattern

The root `_layout.tsx` implements conditional rendering based on `AuthContext`:

```typescript
// Simplified logic
if (loading) return <SplashScreen />;
if (!onboardingCompleted) return <Redirect href="/(onboarding)" />;
if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
return <Redirect href="/(tabs)" />;
```

### Adaptive Theme System

```typescript
// Design tokens (constants/Colors.ts)
light: {
  background: '#FFFFFF',
  surface:   '#F5F5F5',
  text:      '#1A1A1A',
  accent:    '#007AFF',
  border:    '#E0E0E0',
}
dark: {
  background: '#0F0F0F',
  surface:   '#1C1C1E',
  text:      '#F5F5F5',
  accent:    '#0A84FF',
  border:    '#38383A',
}
```

### Key Patterns

| Pattern | Implementation | Benefit |
|---------|---------------|---------|
| **File-based routing** | Expo Router groups `(auth)`, `(tabs)`, `(settings)`, etc. | Clear separation, lazy loading per group |
| **Real-time sync** | Firestore `onSnapshot` in global contexts | Instant UI updates across screens |
| **Skeleton loading** | 8 animated variants via Reanimated `withRepeat` + `withSequence` | Smooth perceived performance |
| **Zod + RHF** | Schema-driven validation with real-time error display | Type-safe forms, reduced boilerplate |
| **Modular components** | Components split by domain (product-details/, profile/, ui/) | Single responsibility, testability |
| **i18n-js + context** | Translation files + reactive LanguageContext | Hot-switchable locale without restart |
| **Firestore rules** | Granular read/write per collection with auth checks | Security without backend |

---

## 🏗 Android Build Details

| Property | Value |
|----------|-------|
| **package** | `com.pelykhihor.marketplace` |
| **compileSdk** | `35` |
| **minSdk** | `24` (Android 7.0) |
| **targetSdk** | `35` |
| **Build System** | EAS Build (managed workflow) |

---

## 🤝 Contributing

This repository is marked as **private**. If you have access and want to contribute:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💻 Make your changes
4. 📝 Commit (`git commit -m 'feat: add amazing feature'`)
5. 🚀 Push (`git push origin feature/amazing-feature`)
6. 🔄 Open a Pull Request

---

## 📸 Screenshots

### 🔍 Search & Filtering
<table>
    <tr>
        <td align="center"><b>Search Dark</b></td>
        <td align="center"><b>Search Light</b></td>
        <td align="center"><b>Filter Sheet Dark</b></td>
        <td align="center"><b>Filter Sheet Light</b></td>
    </tr>
    <tr>
        <td><img src="./assets/screenshots/searchScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/searchScreen-light.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/FilterSheet-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/FilterSheet-light.jpg" width="200"/></td>
    </tr>
</table>

### 🏠 Discovery & Marketplace
<table>
    <tr>
        <td align="center"><b>Home Dark</b></td>
        <td align="center"><b>Home Light</b></td>
        <td align="center"><b>Product Details Dark</b></td>
        <td align="center"><b>Product Details Light</b></td>
    </tr>
    <tr>
        <td><img src="./assets/screenshots/IndexScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/IndexScreen-light.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/ProductDetailsScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/ProductDetailsScreen-light.jpg" width="200"/></td>
    </tr>
</table>

### 🔐 Auth Flow
<table>
    <tr>
        <td align="center"><b>Login Dark</b></td>
        <td align="center"><b>Login Light</b></td>
        <td align="center"><b>Register Dark</b></td>
        <td align="center"><b>Register Light</b></td>
    </tr>
    <tr>
        <td><img src="./assets/screenshots/LoginScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/LoginScreen-light.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/RegisterScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/RegisterScreen-light.jpg" width="200"/></td>
    </tr>
    <tr>
        <td align="center"><b>Forgot Password Dark</b></td>
        <td align="center"><b>Forgot Password Light</b></td>
        <td align="center"><b>Success Dark</b></td>
        <td align="center"><b>Success Light</b></td>
    </tr>
    <tr>
        <td><img src="./assets/screenshots/ForgotPasswordScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/ForgotPasswordScreen-light.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/SuccessScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/SuccessScreen-light.jpg" width="200"/></td>
    </tr>
</table>

### 👤 Profile & Details
<table>
    <tr>
        <td align="center"><b>Profile Dark</b></td>
        <td align="center"><b>Profile Light</b></td>
        <td align="center"><b>Profile Details Dark</b></td>
        <td align="center"><b>Profile Details Light</b></td>
    </tr>
    <tr>
        <td><img src="./assets/screenshots/ProfileScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/ProfileScreen-light.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/ProfileDetailsScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/ProfileDetailsScreen-light.jpg" width="200"/></td>
    </tr>
</table>

### ⚙️ Settings & Support
<table>
    <tr>
        <td align="center"><b>Settings Dark</b></td>
        <td align="center"><b>Settings Light</b></td>
        <td align="center"><b>Notifications Dark</b></td>
        <td align="center"><b>Notifications Light</b></td>
    </tr>
    <tr>
        <td><img src="./assets/screenshots/SettingsScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/SettingsScreen-light.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/NotificationsScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/NotificationsScreen-light.jpg" width="200"/></td>
    </tr>
    <tr>
        <td align="center"><b>Language Dark</b></td>
        <td align="center"><b>Language Light</b></td>
        <td align="center"><b>Help Center Dark</b></td>
        <td align="center"><b>Help Center Light</b></td>
    </tr>
    <tr>
        <td><img src="./assets/screenshots/LanguageScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/LanguageScreen-light.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/HelpCenter-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/HelpCenter-light.jpg" width="200"/></td>
    </tr>
    <tr>
        <td align="center"><b>About Us Dark</b></td>
        <td align="center"><b>About Us Light</b></td>
        <td align="center"><b>Privacy Policy Dark</b></td>
        <td align="center"><b>Privacy Policy Light</b></td>
    </tr>
    <tr>
        <td><img src="./assets/screenshots/AboutUsScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/AboutUsScreen-light.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/PrivacyPoliciScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/PrivacyPoliciScreen-light.jpg" width="200"/></td>
    </tr>
</table>

---

<p align="center">
  <sub>Built with ❤️ using Expo · React Native · TypeScript · Firebase</sub>
  <br />
  <sub>© 2026</sub>
</p>
