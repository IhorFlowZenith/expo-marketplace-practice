 # 👟 Expo Marketplace Practice

Мобільний маркетплейс на **Expo SDK 54**. Практичний проєкт для освоєння архітектури, UI/UX та типізованої валідації в React Native.

**Stack:** Expo SDK 54 · Expo Router · Firebase v12 · React Hook Form · Zod · Reanimated · TypeScript

---

## 📋 Зміст
- [Ключові фічі](#ключові-фічі)
- [Журнал змін](#журнал-змін)
- [Скріншоти](#скріншоти)

---

## Ключові фічі

| Область | Що реалізовано |
|---------|----------------|
| 🔐 Auth | Email/Password + Google via Firebase. Auth Guard на рівні роутера. Persistent sessions через AsyncStorage |
| 🛡 Валідація | Zod-схеми + React Hook Form. Real-time підсвітка помилок у полях |
| 🎨 Теми | Автоматична Dark/Light тема через системний колірний режим |
| 🗺 Навігація | File-based routing (Expo Router). Групи: `(auth)`, `(tabs)`, `(settings)`, `(support)`, `(profile-extra)` |
| 🔔 Push | Expo Push API — реальні push-сповіщення на телефон. Токен зберігається в Firestore. Сповіщення при реєстрації та оформленні замовлення |
| 🚀 Onboarding | 3-слайдовий вступний екран для нових користувачів. Показується лише один раз — стан зберігається в AsyncStorage |
| 📤 Share | Нативний Share API на екрані деталей товару — ділитися назвою, брендом та ціною одним тапом |
| 🏷 Промокоди | Промокоди в Firestore — валідація на льоту, адмін керує через Firebase Console без релізу |
| 🖼 Банери | Промо-банери на головному екрані з Firestore — реальний час, сортування за `order` |

---

## Журнал змін

> 🟢 — Останній коміт · 🔴 — Попередні етапи · Читається зверху вниз (нове → старе)
---

### 🟢 [03.05.2026] Промокоди · Банери з Firebase · Виправлення багів

**Що зроблено:** Промокоди та банери перенесено в Firestore, нові сервіси та хуки, оновлено правила безпеки, виправлено краші.

---

#### Рішення та обґрунтування

**🏷 Промокоди в Firestore**
- **Проблема:** Промокоди були захардкоджені в `constants/promoCodes.ts` — щоб додати новий код, потрібно було перезбирати додаток.
- **Рішення:** Колекція `promoCodes` в Firestore з полями `code`, `discountPercent`, `description`, `isActive`. `PromoCodesService.validate(code)` робить запит з фільтром `isActive == true`. Логіка валідації залишена в `applyPromoCode()` — але тепер приймає масив з Firestore замість локальних констант.
- **Хук `usePromoCodes`:** Інкапсулює весь стан (input, discount, label, error, validating) і async-валідацію. `checkout.tsx` тепер не знає про деталі реалізації.
- **Чому саме так:** Адмін може вмикати/вимикати промокоди через Firebase Console без релізу.

**🖼 Банери в Firestore**
- **Проблема:** `MOCK_BANNERS` в `constants/products.ts` — статичні дані, не можна змінити без релізу.
- **Рішення:** Колекція `banners` з полями `title`, `offer`, `target`, `image`, `isActive`, `order`. `BannersService.getAll()` читає активні банери, відсортовані за `order`. Хук `useBanners` — простий fetch при монтуванні.
- **`BannerItem` тип:** Перенесено з `constants/products.ts` в `types/index.ts` — прибрано дублювання. Додано поле `order?: number`.
- **Чому саме так:** Маркетинг може керувати банерами в реальному часі без участі розробника.

**🔒 Правила Firestore**
- `banners` — `allow read: if true` (публічні, навіть без авторизації)
- `promoCodes` — `allow read: if request.auth != null` (тільки авторизовані)
- Запис в обидві колекції — тільки через Admin SDK

---

#### Змінені файли

| # | File | What changed |
|---|------|--------------|
| 🆕 | `hooks/useBanners.ts` | Fetch банерів з Firestore |
| 🆕 | `hooks/usePromoCodes.ts` | Стан і async-валідація промокоду |
| 🔄 | `services/firestore.ts` | `PromoCodesService`, `BannersService` |
| 🔄 | `constants/promoCodes.ts` | Видалено `PROMO_CODES[]`, `applyPromoCode` тепер приймає масив |
| 🔄 | `app/(tabs)/checkout.tsx` | Використовує `usePromoCodes` хук |
| 🔄 | `app/(tabs)/index.tsx` | `MOCK_BANNERS` → `useBanners()`, додано імпорт |
| 🔄 | `components/PromoBanner.tsx` | `BannerItem` імпортується з `@/types` |
| 🔄 | `types/index.ts` | `BannerItem` — додано поле `order?: number` |
| 🔄 | `firestore.rules` | Правила для `banners` і `promoCodes` |
| 🔄 | `scripts/seed-firestore.js` | Seed для `promoCodes` і `banners` |
| 🐛 | `app/(tabs)/_layout.tsx` | `"bag"` → `"bag-outline"` |

---

### 🔴 [03.05.2026] Onboarding · Share товару · Buy Now · Автовибір варіантів · Рефакторинг

**Що зроблено:** Екран онбордингу з одноразовим показом, функція поділитися товаром, кнопка Buy Now з переходом на Checkout, автовибір першого варіанту товару, рефакторинг `sizeOptions`/`colorOptions`, заміна однолітерних змінних.

---

#### Рішення та обґрунтування

**🚀 Onboarding (одноразовий показ)**
- **Проблема:** Відсутній вступний екран для нових користувачів. При повторному запуску додатку онбординг показувався знову.
- **Рішення:** Створено `app/(onboarding)/index.tsx` — 3-слайдовий екран з іконками, заголовками та підзаголовками (через `i18n`). Після завершення або натискання "Skip" в `AsyncStorage` записується ключ `@onboarding_completed = 'true'`.
- **Перевірка при старті:** У `RootLayoutNav` (`app/_layout.tsx`) при монтуванні зчитується `AsyncStorage`. Поки перевірка не завершена — рендериться `null` (уникаємо флікеру). Якщо онбординг пройдено — одразу редирект на `/(auth)/login`, минаючи `/(onboarding)`.
- **Чому саме так:** `AsyncStorage` — стандартний спосіб персистентності в Expo без нативних залежностей. Рендер `null` до завершення перевірки гарантує, що `SplashScreen` залишається видимим і користувач не бачить миготіння онбордингу.

**📤 Share товару**
- **Проблема:** На екрані деталей товару `handleShare` викликав `Share.share()`, але `Share` не був імпортований з `react-native` — runtime crash `ReferenceError: Property 'Share' doesn't exist`.
- **Рішення:** Додано `Share` до імпорту з `react-native` в `app/(tabs)/product-details/[id].tsx`.
- **Чому саме так:** `Share` — вбудований React Native API, окремої установки не потребує.

**🛒 Buy Now → одразу на Checkout**
- **Проблема:** Кнопка "Buy Now" лише додавала товар до кошика, але не переходила на оформлення.
- **Рішення:** Додано `handleBuyNow` — викликає `addItem` і одразу `router.push('/(tabs)/checkout')`. Логіка побудови `CartItem` винесена в `buildCartItem()`, щоб не дублювати між `handleAddToCart` і `handleBuyNow`.

**✅ Автовибір першого варіанту**
- **Проблема:** При відкритті екрана деталей розмір і колір не були вибрані — користувач мусив вибирати вручну перед додаванням у кошик.
- **Рішення:** `useEffect` після завантаження `product` автоматично встановлює `sizes[0]` і `colors[0]` як вибрані значення.

**⚡ Рефакторинг варіантів товару**
- **Проблема:** `sizeOptions` і `colorOptions` мали ідентичну логіку, продубльовану в двох `useMemo` (22 рядки). Всі колбеки використовували однолітерну змінну `v`.
- **Рішення:** Винесено в хелпер `buildOptions(key, filterKey, filterValue)` — одна функція покриває обидва випадки, `useMemo` скоротились до одного рядка кожен. Замінено `v` → `variant`, `sum` → `total` у всіх колбеках файлу.

---

#### Змінені файли

| # | File | What changed |
|---|------|--------------|
| 🆕 | `app/(onboarding)/index.tsx` | 3-слайдовий onboarding з пагінацією, кнопками Next/Get Started/Skip |
| 🔄 | `app/_layout.tsx` | Перевірка `@onboarding_completed` при старті, `render null` до завершення перевірки |
| 🔄 | `app/(tabs)/product-details/[id].tsx` | `handleBuyNow`, `buildCartItem`, `buildOptions`, автовибір варіантів, фікс імпорту `Share`, читабельні імена змінних |

---

### 🔴 [01.05.2026 – 02.05.2026] Інтернаціоналізація (i18n) · Skeleton · Push-сповіщення · Telegram Auth · Аватарка · Виправлення багів

**Що зроблено:** Повна підтримка двох мов (EN/UK), анімовані скелетони на всіх екранах, реальні push-сповіщення через Expo Push API + FCM v1, сповіщення при оформленні замовлення, спроба інтеграції Telegram OIDC, сторінка сповіщень винесена з tabs, аватарка з Firestore однакова на всіх екранах, блокування Checkout при порожньому кошику, виправлення TypeScript помилок та роутингу.

---

#### Рішення та обґрунтування

**🌐 Інтернаціоналізація (i18n-js + LanguageContext)**
- **Проблема:** Всі тексти інтерфейсу були захардкоджені англійською (~150+ рядків по 20+ файлах).
- **Рішення:** Встановлено `i18n-js` + `expo-localization`. Створено `locales/en.json` та `locales/ua.json` з повним покриттям усіх екранів. Глобальний `LanguageContext` з хуком `useLanguage()` та функцією `t()` обгорнуто в кореневий `_layout.tsx`.
- **Чому саме так:** `i18n-js` — легковагова бібліотека без нативних залежностей, працює в Expo Go. `LanguageContext` дає реактивне перемикання мови без перезапуску додатку.
- **Персистентність:** Обрана мова зберігається в `AsyncStorage` під ключем `@app_locale` та відновлюється при наступному запуску додатку.

**💀 Skeleton-завантаження (react-native-reanimated)**
- **Проблема:** `ActivityIndicator` на весь екран — поганий UX, не дає уявлення про структуру контенту.
- **Рішення:** Створено `components/ui/Skeleton.tsx` з базовим компонентом `Skeleton` та 7 спеціалізованими варіантами: `ProductCarouselSkeleton`, `ProductGridSkeleton`, `CartRowSkeleton`, `OrderCardSkeleton`, `ProductDetailsSkeleton`, `FormSectionSkeleton`, `BannerSkeleton`.
- **Чому саме так:** `reanimated` вже є в проєкті — нульова нова залежність. Пульсуюча анімація через `withRepeat` + `withSequence` дає плавний ефект без `Animated.loop`.
- **Де застосовано:** `index.tsx`, `products.tsx`, `search.tsx`, `cart.tsx`, `favorites.tsx`, `orders.tsx`, `product-details/[id].tsx`, `checkout.tsx`, `profile-details.tsx`.

**🔀 Рефакторинг product-details: 423 → 148 рядків**
- **Проблема:** `[id].tsx` містив 423 рядки — галерею, зум-модал, інформацію про товар, специфікації, стилі — все в одному файлі.
- **Рішення:** Виділено два компоненти:
  - `components/product-details/ImageGallery.tsx` — галерея з пагінацією, кнопки back/favorite, зум-модал
  - `components/product-details/ProductInfo.tsx` — назва, ціна, рейтинг, опис, варіанти, специфікації
- **Чому саме так:** Кожен компонент має єдину відповідальність і власні стилі. `[id].tsx` тепер містить тільки логіку екрана (хуки, handlers, useMemo).

**🔔 Push-сповіщення через Expo Push API + FCM v1**
- **Проблема:** `NotificationsService.create()` лише записував в Firestore, але реальний push на телефон не відправлявся. Legacy FCM API вимкнений Google.
- **Рішення:** Додано функцію `sendExpoPush()` в `services/firestore.ts` — HTTP POST на `https://exp.host/--/api/v2/push/send`. FCM v1 налаштовано через Service Account JSON в Expo Credentials.
- **Чому саме так:** Expo Push API — офіційний спосіб відправки push без власного бекенду. FCM v1 — єдиний актуальний спосіб після вимкнення Legacy API.
- **Обмеження:** В Expo Go з SDK 53+ remote push не підтримуються — тільки APK/development build.

**📦 Сповіщення при оформленні замовлення**
- **Проблема:** Тип `order_placed` існував в типах, але ніколи не створювався.
- **Рішення:** Після `OrdersService.create()` в `useOrders.placeOrder()` автоматично викликається `NotificationsService.create()` з типом `order_placed`, кількістю товарів та сумою.

**🔕 Сторінка сповіщень винесена з tabs**
- **Проблема:** `/notifications` відображалась як окремий таб у нижній навігації.
- **Рішення:** Додано `href: null` і `tabBarStyle: hiddenTabBarStyle` в `_layout.tsx`. Сторінка доступна через навігацію з профілю.

**🔔 Тумблер сповіщень — реальна функціональність**
- **Проблема:** Switch в `app/(settings)/notifications.tsx` був локальним `useState(true)` і нічого не робив.
- **Рішення:** Підключено до `Notifications.getPermissionsAsync()` / `requestPermissionsAsync()`. При вмиканні — запитує системний дозвіл. При вимиканні — відкриває системні налаштування. Оновлюється через `AppState` listener.

**� Аватарка з Firestore — однакова на всіх екранах**
- **Проблема:** Аватарка генерувалась через `pravatar.cc` на основі `displayName` як seed — різний `displayName` на різних екранах давав різні картинки.
- **Рішення:** `AuthContext` підписується на `users/{uid}` через `onSnapshot` і надає `photoURL` глобально. `UserAvatar` показує `photoURL` якщо є, інакше генерує через pravatar.cc. Seed змінено з `displayName` на `email`.
- **Чому саме так:** Email унікальний і незмінний — ідеальний seed для детермінованої генерації аватарки.

**🛒 Блокування Checkout при порожньому кошику**
- **Проблема:** Кнопка "Checkout" була активна навіть якщо кошик порожній.
- **Рішення:** Додано `disabled={items.length === 0}` і `opacity: 0.4` на кнопку в `cart.tsx`.

**🔐 Telegram Auth (в процесі)**
- Досліджено: OIDC через `expo-auth-session`, нативний SDK `expo-telegram-login-sdk` (несумісний з Gradle 8.14), Telegram Login Widget.
- Поточна реалізація: `expo-auth-session` з `makeRedirectUri({ scheme: 'marketplace', path: 'tglogin' })`.
- **Статус:** Потребує верифікованого App Link або налаштування OIDC провайдера в Firebase Console.

**🔧 Виправлення**
- `PaymentCardModal.tsx` — відсутній імпорт `useLanguage` (crash на вкладці "Особиста інформація")
- `orders.tsx` — відсутній імпорт `OrderCardSkeleton` (runtime crash)
- `usePushNotifications.ts` — `shouldShowBanner`/`shouldShowList`, `useRef(null)`, `try/catch` для Expo Go
- `services/firestore.ts` — імпорт `AppNotification`, `NotificationType`; правило `notifications` в `firestore.rules`; composite index
- `app/(auth)/tglogin.tsx` — видалено застарілий файл, що конфліктував з роутингом

---

#### Змінені файли

| # | File | What changed |
|---|------|--------------|
| 🆕 | `locales/en.json` | Всі тексти інтерфейсу англійською |
| 🆕 | `locales/ua.json` | Всі тексти інтерфейсу українською |
| 🆕 | `locales/index.ts` | Ініціалізація `i18n-js` |
| 🆕 | `context/LanguageContext.tsx` | `LanguageProvider`, `useLanguage()`, `setLocale()`, персистентність |
| 🆕 | `components/ui/Skeleton.tsx` | Базовий `Skeleton` + 7 спеціалізованих варіантів |
| 🆕 | `components/product-details/ImageGallery.tsx` | Галерея + зум-модал |
| 🆕 | `components/product-details/ProductInfo.tsx` | Інформація про товар |
| 🔄 | `services/firestore.ts` | `sendExpoPush()`, імпорт типів, правило `notifications` |
| 🔄 | `hooks/useOrders.ts` | `NotificationsService.create()` після оформлення замовлення |
| 🔄 | `hooks/usePushNotifications.ts` | `shouldShowBanner`/`shouldShowList`, `useRef(null)`, `try/catch` |
| 🔄 | `app/(tabs)/_layout.tsx` | `notifications` — `href: null`, прихований з tabs |
| 🔄 | `app/(settings)/notifications.tsx` | Реальний дозвіл, `AppState`, `try/catch` для Expo Go |
| 🔄 | `app/(tabs)/cart.tsx` | `disabled` + `opacity: 0.4` на Checkout при порожньому кошику |
| 🔄 | `context/AuthContext.tsx` | `onSnapshot` на `users/{uid}`, `photoURL` в контексті |
| 🔄 | `components/ui/UserAvatar.tsx` | Проп `photoURL`, seed змінено на `email` |
| 🔄 | `app/(tabs)/profile.tsx` | `photoURL` з `useAuth()` → `UserAvatar` |
| 🔄 | `app/(tabs)/index.tsx` | `photoURL` з `useAuth()` → `UserAvatar` |
| 🔄 | `app/(profile-extra)/profile-details.tsx` | `photoURL` з `useAuth()` → `UserAvatar` |
| 🔄 | `app/(tabs)/orders.tsx` | Додано імпорт `OrderCardSkeleton` |
| 🔄 | `components/profile/PaymentCardModal.tsx` | Додано імпорт `useLanguage` |
| 🔄 | `hooks/useTelegramAuth.ts` | `makeRedirectUri`, прибрано `expo-telegram-login-sdk` |
| 🔄 | `app.json` | Видалено невалідний App Link, залишено custom scheme |
| 🔄 | `firestore.rules` | Додано правило для колекції `notifications` |
| 🔄 | `firestore.indexes.json` | Composite index `notifications: userId + createdAt` |
| 🔄 | `app/(auth)/*.tsx` + 30 файлів | Всі тексти через `t()`, скелетони |
| ❌ | `app/(auth)/tglogin.tsx` | Видалено — конфліктував з роутингом |

#### Заплановано
- [ ] Telegram Auth — OIDC провайдер в Firebase Console
- [ ] Сповіщення при зміні статусу замовлення (shipped, delivered)
- [ ] Переклад повідомлень валідації Zod

---

### 🔴 [29.04.2026 – 30.04.2026] Firebase · Firestore · Checkout · Profile · Cart UX · Telegram OIDC · Avatar · Refactoring

**Що зроблено:** Повна Firebase інтеграція, Checkout flow, профіль у Firestore, глобальний стан кошика/обраного, Telegram OIDC, рерайт VariantSelector, рефакторинг великих файлів, динамічні аватари, виправлення багів.

---
#### Рішення та обґрунтування

**🗂 Архітектура Firestore та структура даних**
- **Проблема:** Стара модель продукту мала лише `color` і `size` як рядки. Дані зберігалися локально в MOCK-масивах, що унеможливлювало реальну роботу магазину.
- **Рішення:** Розроблено схему з колекціями: `products` (з вкладеними `variants[]` та `specs`), `carts`, `favorites`, `orders`, `users`. Впроваджено скрипт `seed-firestore.js` для початкового наповнення.
- **Чому саме так:** Необхідно для підтримки реального e-commerce, де кожен варіант має свій `stock` та `sku`, а дані ізольовано за правилами `firestore.rules`.
- **Компроміс:** Продукти доступні всім на читання, але запис можливий виключно через Admin SDK (backend).

**🔌 Перехід на Real-time синхронізацію**
- **Проблема:** Хуки `useCart` і `useFavorites` створювали окремі підписки `onSnapshot` на кожному екрані, дублюючи запити і створюючи розсинхрони.
- **Рішення:** Створено глобальні `CartProvider` та `FavoritesProvider` у кореневому `_layout.tsx`. Замінено всі MOCK на дані з контексту.
- **Чому саме так:** Одна підписка на весь додаток економить ліміти Firestore і дає миттєвий доступ до `count` (для бейджа в таббарі) без prop drilling.

**🎨 VariantSelector: повний рерайт**
- **Проблема:** Кольори відображалися некоректно (чорні квадрати замість hex), а рамки вибору не зникали при зміні через конфлікт inline-стилів.
- **Рішення:** Впроваджено `COLOR_MAP` для конвертації назв у кольори. Додано стан disabled (перекреслено) для `stock: 0`. 
- **Чому саме так:** Використання об'єктних стилів (динамічний `borderColor`) повністю вирішує баг з рамками, а `isLightColor()` гарантує контрастність чекмарку (білий/чорний).

**🛒 Checkout Flow та Адреса**
- **Проблема:** Checkout показував хардкодну ціну та адресу (`street`, `city`). Адреса в профілі зберігалася як один неструктурований рядок.
- **Рішення:** Додано `country` та `postalCode` в `AddressModal`. `Checkout` тепер читає профіль з Firestore і дозволяє заповнити відсутні дані прямо під час оформлення.
- **Чому саме так:** Зменшує кількість кроків для нових користувачів. Структурована адреса необхідна для подальшого масштабування доставки (розрахунок тарифів).

**❌ Скасування замовлень клієнтом**
- **Проблема:** Правила Firestore забороняли клієнтам оновлювати колекцію `orders`, тому користувачі не могли скасувати замовлення без звернення в підтримку.
- **Рішення:** Розширено `firestore.rules` для дозволу `update`, додано кнопку `Cancel` на замовленнях у статусах `pending/active`.
- **Чому саме так:** Дає користувачам автономію та зменшує навантаження на службу підтримки.

**📱 Telegram OIDC Auth**
- **Проблема:** Firebase не підтримує Telegram нативно, а React Native не має браузерних методів на зразок `signInWithPopup`.
- **Рішення:** Впроваджено кастомний `oidc.telegram` через `expo-auth-session` з використанням Authorization Code + PKCE.
- **Чому саме так:** Єдиний надійний спосіб інтеграції без WebView, що використовує офіційний OIDC-ендпоінт Telegram.
- **Компроміс:** Потребує налаштування backend-проксі для перевірки підпису Telegram та генерації JWT (зараз залишено як TODO).

**👤 Персоналізація профілю**
- **Проблема:** Використовувалася статична іконка профілю без унікальності.
- **Рішення:** Впроваджено компонент `UserAvatar`, що завантажує фото з Firestore або генерує унікальне зображення через `pravatar.cc` за хешем імені.
- **Чому саме так:** Значно покращує UI/UX без вимоги завантажувати фото самостійно.

**📜 Cart Layout UX**
- **Проблема:** Товари і summary зливалися, summary прокручувався разом з товарами, що змушувало скролити вниз для натискання Checkout.
- **Рішення:** Зафіксовано Order Summary знизу, список товарів зменшено та обгорнуто в `ScrollView`.
- **Чому саме так:** Кнопка Checkout тепер завжди видима і доступна в 1 клік.

```text
[ Screen Top ]
+-------------------------+
| [ Item 1: $120 ]        | <-- Scrollable Area
| [ Item 2: $30  ]        |
| [ Item 3: $15  ]        |
+-------------------------+
| [ Fixed Bottom Sheet ]  | <-- Pinned Area
| Subtotal: $165          |
| Total: $165             |
| [ CHECKOUT ]            |
+-------------------------+
```

#### Змінені файли

| # | File | What changed |
|---|------|--------------|
| 🆕 | `types/index.ts` | Всі TypeScript типи |
| 🆕 | `services/firestore.ts` | `ProductsService`, `CartService`, `FavoritesService`, `OrdersService`, `UserService`, `ReviewsService` |
| 🆕 | `services/storage.ts` | Firebase Storage |
| 🆕 | `hooks/useCart.ts` | Real-time кошик |
| 🆕 | `hooks/useFavorites.ts` | Real-time обране |
| 🆕 | `hooks/useOrders.ts` | Замовлення + `placeOrder()` + `cancelOrder()` |
| 🆕 | `hooks/useProducts.ts` | `useProducts`, `useFeaturedProducts`, `useProduct` |
| 🆕 | `hooks/useUserProfile.ts` | Профіль: `updateField`, `savePaymentCard`, `changePassword` |
| 🆕 | `context/CartContext.tsx` | Глобальний стан кошика |
| 🆕 | `context/FavoritesContext.tsx` | Глобальний стан обраного |
| 🆕 | `components/ui/UserAvatar.tsx` | Рандомний аватар з `pravatar.cc` + fallback ініціали |
| 🆕 | `firestore.rules` | Правила безпеки (+ дозволено скасування замовлень) |
| 🆕 | `storage.rules` | Правила Storage |
| 🆕 | `firestore.indexes.json` | 8 composite індексів |
| 🆕 | `firebase.json` | Конфіг для `firebase deploy` |
| 🆕 | `scripts/seed-firestore.js` | 8 продуктів |
| 🔄 | `app/(tabs)/index.tsx` | `useFeaturedProducts()`, `UserAvatar` |
| 🔄 | `app/(tabs)/cart.tsx` | `useCartContext`, ScrollView, фіксований summary |
| 🔄 | `app/(tabs)/favorites.tsx` | `useFavoritesContext`, `useCartContext` |
| 🔄 | `app/(tabs)/orders.tsx` | `useOrders()`, кнопка Cancel |
| 🔄 | `app/(tabs)/products.tsx` | `useProducts(filters)` |
| 🔄 | `app/(tabs)/search.tsx` | Firestore, пошук по `tags[]` |
| 🔄 | `app/(tabs)/product-details/[id].tsx` | `useProduct()`, stock-aware variants, 454→283 рядки |
| 🔄 | `app/(tabs)/checkout.tsx` | Повний flow з Firestore, 413→256 рядки, без PayPal |
| 🔄 | `app/(auth)/register.tsx` | Зберігає профіль в Firestore |
| 🔄 | `app/(profile-extra)/profile-details.tsx` | Firestore, `UserAvatar`, saving overlay |
| 🔄 | `app/(tabs)/_layout.tsx` | `CartTabIcon` з бейджем |
| 🔄 | `app/_layout.tsx` | `CartProvider`, `FavoritesProvider` |
| 🔄 | `components/ProductCard.tsx` | Серце + кошик підключені, discountPrice |
| 🔄 | `components/ui/VariantSelector.tsx` | `COLOR_MAP`, `isLightColor()`, disabled variants |
| 🔄 | `components/profile/ChangePasswordModal.tsx` | Реальний Firebase Auth |
| 🔄 | `hooks/useTelegramAuth.ts` | OIDC Code+PKCE, Expo Go detection |
| 🔄 | `eas.json` | `env` секція в `preview` і `production` |
| ❌ | `hooks/useFacebookAuth.ts` | Видалено |

#### Заплановано
- [ ] Відгуки на екрані деталей товару
- [ ] Telegram deep link в APK

---

### 🔴 [28.04.2026] Favorites · Profile · Payment Card · My Orders · Support Screens · Refactoring

**Що зроблено:** Реалізовано екран обраного, редагування профілю, управління картою оплати, екран замовлень, екрани Contact Us / Share App / Help та рефакторинг монолітних компонентів.

---

#### Рішення та обґрунтування

**💳 Payment Card: Живе прев'ю та маскування**
- **Рішення:** Створено `PaymentCardModal` з візуальною картою, що оновлюється в реальному часі. Використано кастомні хелпери для форматування номера (4-4-4-4) та терміну дії (MM/YY).
- **Рефакторинг:** Файл скорочено з 363 до 115 рядків шляхом винесення стилів у `.styles.ts` та логіки у `utils/cardUtils.ts`.
- **Чому саме так:** Це забезпечує преміальний UX (користувач бачить свою карту) без захаращення коду екрана.

**🗂 Чиста архітектура компонентів**
- **Проблема:** Файли ставали занадто великими (>300 рядків), що ускладнювало огляд.
- **Рішення:** Перехід до структури "Компонент + Стилі + Утиліти". Кожен великий UI-блок тепер має свій файл стилів.
- **Чому саме так:** Стандарт розробки великих проектів, що спрощує паралельну роботу та тестування.

**📋 Favorites: swipe-to-delete + move-to-cart**
- **Рішення:** `ReanimatedSwipeable` для видалення, окрема кнопка `bag-add` для переміщення в кошик замість лічильника кількості.
- **Чому саме так:** На екрані Favorites зміна кількості — зайва дія; логічніший flow — вирішити "брати чи ні" і одразу переходити в кошик.
- **Компроміс:** Переміщення в кошик поки симулюється видаленням зі списку — потрібен глобальний cart state.

**🗂 Component extraction: монолітний файл 529 рядків → 3 компоненти**
- **Проблема:** `profile-details.tsx` містив inline-типи, JSX двох модалів, стилі та бізнес-логіку — 529 рядків в одному файлі.
- **Рішення:** Виділено три компоненти з чіткою відповідальністю:
  - `ProfileFieldRow` — рядок редагованого поля + спільні типи (`EditableField`, `UserProfile`, `FIELD_META`)
  - `EditModal` — bottom-sheet модал для редагування одного поля
  - `ChangePasswordModal` — самодостатній модал зміни пароля з власним локальним станом
- **Чому саме так:** Кожен компонент можна тестувати та замінювати ізольовано. `ChangePasswordModal` сам керує своїм станом — батьківський екран передає лише `visible` + `onClose`.
- **Компроміс:** `EditableField` / `FIELD_META` живуть у `ProfileFieldRow.tsx`, а не в окремому `types/`-файлі — достатньо для поточного масштабу.

**🔒 ChangePasswordModal: клієнтська валідація**
- Три поля (current / new / confirm), кожне з окремим `show/hide` toggle.
- Послідовна валідація: пусте поле → довжина < 6 → mismatch → Firebase call.
- **Чому не `useReducer`:** 3 поля + 3 boolean — ще в межах `useState` без надмірного ускладнення.

**👁 Favorites: приховано tab bar**
- `tabBarStyle: hiddenTabBarStyle` в `_layout.tsx` для маршруту `favorites` — аналогічно до `cart`, `products`, `checkout`.
- **Чому:** Favorites є фокусним екраном (вибір/відбір товарів), нижня навігація відволікає.

**📦 My Orders: 3 таби статусу**
- **Рішення:** Екран замовлень з табами Active / Completed / Cancel. Кнопка дії змінюється залежно від статусу (Track Order / Re-Order / Order Again).
- **Чому саме так:** Стандартний e-commerce патерн розділення замовлень за статусом.

**📩 Support Screens: Contact · Share**
- **Contact Us:** 5 методів зв'язку (Phone, Email, WhatsApp, Instagram, Twitter) з нативним `Linking.openURL`. Розклад робочих годин та адреса офісу.
- **Share App:** Простий екран з нативним `Share` API — одна кнопка для шерінгу посилання на додаток.
- **Чому саме так:** Нативні API замість веб-в'ю — кращий UX на мобільних.

**📖 Консолідація Help**
- **Проблема:** Help був доступний з двох місць (Profile та Settings) як два окремі екрани.
- **Рішення:** Видалено `(support)/help.tsx`. Обидва маршрути тепер ведуть на єдиний `(settings)/help-center.tsx`.
- **Чому саме так:** Одне джерело правди для допомоги — немає ризику розсинхрону.

---

#### Змінені файли

| # | File | What changed |
|---|------|--------------|
| 🆕 | `app/(tabs)/favorites.tsx` | Екран обраного: swipe-видалення, кнопка "в кошик", empty state |
| 🔄 | `app/(tabs)/_layout.tsx` | Приховано tab bar для `favorites` |
| 🆕 | `app/(profile-extra)/profile-details.tsx` | Повноцінний екран (160 рядків) — orchestrator поверх компонентів |
| 🆕 | `components/profile/ProfileFieldRow.tsx` | Рядок редагованого поля + типи `EditableField`, `UserProfile`, `FIELD_META` |
| 🆕 | `components/EditModal.tsx` | Bottom-sheet модал редагування поля |
| 🆕 | `components/profile/ChangePasswordModal.tsx` | Самодостатній модал зміни пароля з валідацією |
| 🆕 | `components/profile/PaymentCardModal.tsx` | Модал редагування картки з живим прев'ю та форматуванням |
| 🔄 | `app/(tabs)/orders.tsx` | Повноцінний екран замовлень з 3 табами та картками товарів |
| 🔄 | `app/(tabs)/_layout.tsx` | Приховано tab bar для `favorites` та `orders` |
| 🔄 | `constants/products.ts` | Додано `OrderItem`, `OrderStatus`, `MOCK_ORDERS` |
| 🔄 | `app/(support)/contact.tsx` | Контакти: 5 методів зв'язку, графік роботи, адреса |
| 🔄 | `app/(support)/share.tsx` | Share App: нативний Share API, кнопка шерінгу |
| ❌ | `app/(support)/help.tsx` | Видалено — консолідовано в `(settings)/help-center.tsx` |
| 🔄 | `app/(support)/_layout.tsx` | Прибрано маршрут `help` |
| 🔄 | `app/(tabs)/profile.tsx` | Help веде на `/help-center` замість `/help` |

#### Заплановано
- [ ] Підключити cart state — переміщення з Favorites до Cart без видалення зі списку
- [ ] Firebase `updatePassword` у `ChangePasswordModal.handleSave`
- [ ] Вибір фото профілю (Image Picker)
- [ ] Favorites persistence (AsyncStorage або Firebase)
- [ ] Деталізація замовлення (окремий екран при натисканні Track Order)

---

### 🔴 [24.04.2026 - 26.04.2026] UI Responsiveness · Security · Refactoring · Navigation · Catalog · Cart/Checkout

**Що зроблено:** Об'єднано системний рефакторинг адаптивності й безпеки з новим продуктовим флоу (`Search`, `Products`, `Cart`, `Checkout`), оновленою навігацією каталогу, чисткою auth-модуля та переходом на строгу типізацію (видалення `any`).

---

#### Рішення та обґрунтування

**🔤 Глобальна підтримка SafeAreaView**
- **Проблема:** Відступи від статус-бару робилися вручну через жорсткі `paddingTop`, що некоректно працювало на різних пристроях.
- **Рішення:** Обгортання додатку в `SafeAreaProvider` та використання кастомного `SafeAreaView` з `components/Themed.tsx` замість звичайного `View`.
- **Чому саме так:** `react-native-safe-area-context` автоматично вираховує точні системні відступи (insets) для кожної платформи.

**🔤 Динамічні розміри екрана замість статичних**
- **Проблема:** Використання статичного `Dimensions.get('window')` не реагує на зміну орієнтації екрана або перемикання спліт-скріну.
- **Рішення:** Заміна всіх викликів `Dimensions.get` на React Hook `useWindowDimensions()`.
- **Чому саме так:** Хук автоматично тригерить ре-рендер при зміні розмірів екрана, роблячи UI адаптивним у реальному часі.

**🔤 Безпечне зберігання ключів Firebase та Google**
- **Проблема:** Хардкод секретних ключів та Client ID безпосередньо у вихідному коді створює ризики безпеки при публікації репозиторію.
- **Рішення:** Винесення всіх конфігурацій Firebase та Google Auth у файл `.env` з префіксом `EXPO_PUBLIC_` та додавання його у `.gitignore`.
- **Чому саме так:** Стандартна практика розробки для збереження секретів локально та автоматичної ін'єкції під час збірки (EAS Build / Metro).

**🔤 Міграція з TouchableOpacity на Pressable**
- **Проблема:** Використання `TouchableOpacity`, який має обмежені можливості кастомізації стану натискання та вважається менш гнучким.
- **Рішення:** Глобальна заміна `TouchableOpacity` на `Pressable`. Анімація натискання (зменшення opacity) тепер реалізована через передачу функції у `style={({ pressed }) => [...]}`. Виправлено баг з колапсом розмірів зображень у `FlashList` через відсутність явних `width/height` у нового контейнера.
- **Чому саме так:** `Pressable` є сучасним стандартом React Native. Він дає доступ до станів `pressed`, `hovered`, дозволяє точніше налаштовувати Hit Slop та є більш продуктивним.

**🔤 Покращення UI/UX та рефакторинг компонентів**
- **Рішення:** Створення універсального компонента `VariantSelector`, який підтримує два режими: текстовий (для розмірів) та колірний (візуальні плашки з кольором та індикацією вибору). Видалення зайвих 100 рядків коду з екрана деталей товару.
- **Чому саме так:** Покращує UX (користувач бачить колір, а не читає його назву) та робить код екрана деталей товару чистішим та легшим для підтримки.

**🔤 Редизайн соціальної авторизації**
- **Проблема:** Громіздка кнопка "Continue with Google" займала багато місця та не дозволяла зручно додати інші методи входу (Facebook, Telegram).
- **Рішення:** Створення компактного компонента `SocialIconButton` (тільки іконка) та групування методів авторизації в один рядок.
- **Чому саме так:** Більш сучасний вигляд (UI), економія вертикального простору на екранах входу/реєстрації та легке масштабування для нових методів.

**🔤 Оптимізація сітки фільтрів (SelectionGrid)**
- **Проблема:** Чіпси фільтрів мали різну ширину через внутрішні відступи, що створювало "рваний" вигляд сітки.
- **Рішення:** Перехід на `flexBasis: '31%'` та `flexGrow: 1` для елементів сітки.
- **Чому саме так:** Гарантує рівну сітку по 3 елементи в ряд. `flexGrow` дозволяє останньому елементу в ряду гарно заповнювати простір.

**🔤 Вирівнювання та рефакторинг слайдера ціни (PriceRangeSlider)**
- **Проблема:** Підписи цін та крайні положення повзунків виходили за межі лінії треку, а складна математика координат була розкидана між файлами.
- **Рішення:** Впроваджено `THUMB_OFFSET` (9px) для точного позиціонування візуального центру кульки. Компонент зроблено повністю самодостатнім (ізоляція SharedValues та Gesture всередині).
- **Чому саме так:** Покращення візуальної симетрії (нуль та максимум тепер стоять точно над краями лінії) та спрощення коду на ~94 рядки (−30%) без втрати 60fps плавності.

**🔤 Динамічний PromoBanner з пагінацією**
- **Проблема:** Промо-банер на головному екрані був статичним та захардкодженим, що не дозволяло показувати кілька акцій.
- **Рішення:** Створення окремого компонента `PromoBanner` з підтримкою горизонтальної пагінації та активними індикаторами (dots); пізніше оновлено на відображення по 1 банеру на екран із paging.
- **Чому саме так:** Дозволяє гнучко додавати нові акційні банери через `MOCK_BANNERS` і дає передбачуваний UX скролу.

**🧭 Розділення Search і Products**
- **Проблема:** Один екран одночасно виконував роль пошуку і каталогу, через що сценарії змішувалися.
- **Рішення:** Виділено окремий екран `Products` з власним списком, категоріями та кнопкою фільтрів.
- **Чому саме так:** Розділення відповідальностей спрощує UX і масштабування логіки.
- **Компроміс:** Частина фільтраційної логіки тимчасово дублюється між `search.tsx` і `products.tsx`.

```text
Home
 ├─ Search input -> /search
 ├─ Category chips -> /products?category=...
 └─ Section "See All" -> /products?category=...
```

**🛒 Cart: swipe-to-delete без підтвердження**
- **Проблема:** Видалення через окрему кнопку-смітник збільшувало кількість дій.
- **Рішення:** Замінено на swipe вліво з автоматичним видаленням (`onSwipeableOpen`).
- **Чому саме так:** Це швидше для користувача і відповідає патерну e-commerce кошика.
- **Компроміс:** Наразі немає Undo-дії після видалення.

**🧱 Спрощення структури Cart Summary**
- **Проблема:** Повторювані рядки summary у `cart.tsx` ускладнювали читабельність.
- **Рішення:** Винесено рядок summary в окремий компонент `SummaryRow`, а блок `Order Summary` залишено інлайн у `cart.tsx`.
- **Чому саме так:** Зберігається чиста структура основного екрана без зайвої обгортки та мінімізується дублювання.

**💳 Checkout як окремий крок**
- **Проблема:** Після кошика не було завершеного флоу оформлення.
- **Рішення:** Додано екран `checkout.tsx` з адресою, summary та вибором методу оплати.
- **Чому саме так:** Відокремлений checkout дозволяє розширювати оплату/доставку без ускладнення `cart.tsx`.
- **Компроміс:** Дані summary у checkout поки статичні, без синхронізації зі станом кошика.

**🧩 Керування tabbar для фокусних екранів**
- **Проблема:** Нижній tabbar відволікав на `cart`, `products`, `checkout`.
- **Рішення:** Приховано tabbar для цих роутів у `app/(tabs)/_layout.tsx`.
- **Чому саме так:** Краще фокусує користувача на завершенні поточного сценарію.
- **Компроміс:** Швидкий перехід в інші таби з цих екранів недоступний.

**🧹 Рефакторинг auth-екранів: спільні стилі та видалення мертвого коду**
- **Проблема:** Екрани `login.tsx`, `register.tsx` та `forgot-password.tsx` мали ~70% ідентичних стилів (container, header, divider, footer, error тощо). У `register.tsx` лишались невикористані стейти `error` та `notFound` (скопійовані з login і забуті). У `forgot-password.tsx` — аналогічний мертвий `notFound`.
- **Рішення:** Створено єдиний файл `constants/authStyles.ts` зі спільними стилями. Локальні `StyleSheet.create` у `register.tsx` та `forgot-password.tsx` повністю видалені; у `login.tsx` залишено тільки 3 унікальні стилі (`errorLink`, `forgotPassword`, `forgotText`). Видалено мертвий код.
- **Чому саме так:** Єдине джерело для візуального стилю auth-потоку. Зміна кольору, відступу чи шрифту тепер робиться в одному місці.

**🐛 Виправлення бага: `forgot-password.tsx` не показував помилки**
- **Проблема:** Серверна помилка (`serverError`) ловилась у `catch`-блоці та записувалась у стейт, але ніде не рендерилась у JSX. Користувач не бачив повідомлення про помилку при невірному email.
- **Рішення:** Додано блок `{serverError ? <ServerError /> : null}` між полем вводу та кнопкою "Send Reset Link".
- **Чому саме так:** Стандартний патерн відображення помилок, вже використаний у `login.tsx` та `register.tsx`.

**🔤 Виправлення тексту в Zod-схемі**
- **Проблема:** У `schemas/authSchema.ts` повідомлення валідації містило помилку: `"must ne"` замість `"must be"`.
- **Рішення:** Виправлено на `"Full name must be at least 2 characters"`.

**🛡️ Строга типізація (TypeScript)**
- **Проблема:** У багатьох компонентах (`AppInput`, `AppButton`, `SettingsItem`, `FiltersSheet` тощо) та екранах використовувався тип `any`, що знижувало надійність коду та викликало потенційні проблеми з підтримкою.
- **Рішення:** Проведено глобальну заміну `any` на специфічні типи. Додано інтерфейси для props (наприклад, `NotificationOptionProps`, `FAQItemProps`, `FilterOptions`). Використано `keyof typeof Ionicons.glyphMap` для іконок та `unknown` з тайп-кастингом для помилок у `catch` блоках.
- **Чому саме так:** Стандарт індустрії. Покращує автодоповнення (IntelliSense) у редакторі, допомагає уникати runtime-помилок і робить код самодокументованим.

---

#### Змінені файли

| # | File | What changed |
|---|------|--------------|
| 🆕 | `.env` | Файл конфігурації зі змінними середовища |
| 🔄 | `app/_layout.tsx` | Додано `SafeAreaProvider` у кореневий layout |
| 🔄 | `components/Themed.tsx` | Створено тематичний `SafeAreaView` з підтримкою dark/light modes |
| 🔄 | `app/**/*.tsx` (21 файл) | Масова заміна кореневого `View` на `SafeAreaView` та видалення зайвих `paddingTop` |
| 🔄 | `components/ui/PriceRangeSlider.tsx` | Повний рефакторинг: компонент став самодостатнім, виправлено позиціонування та вирівнювання цін |
| 🔄 | `components/FiltersSheet.tsx` | Спрощено логіку (видалено математику координат), впроваджено 3-колонкову сітку для чіпсів |
| 🔄 | `app/(tabs)/index.tsx` | Рефакторинг: винесено промо-банер в окремий компонент |
| 🆕 | `components/PromoBanner.tsx` | Новий компонент для гортання рекламних банерів з точками-індикаторами |
| 🔄 | `constants/products.ts` | Додано інтерфейс `BannerItem` та масив `MOCK_BANNERS` |
| 🔄 | `constants/firebase.ts` | Заміна захардкоджених значень на `process.env.EXPO_PUBLIC_*` |
| 🔄 | `hooks/useGoogleAuth.ts` | Підключення Client ID через змінні середовища |
| 🔄 | `.gitignore` | Додано ігнорування `.env` файлу |
| 🔄 | `components/**/*.tsx`, `app/**/*.tsx` | Глобальна заміна `TouchableOpacity` на `Pressable` з налаштуванням стилів через стан `pressed` |
| 🆕 | `components/ui/VariantSelector.tsx` | Універсальний компонент для вибору варіантів (розмір/колір) |
| 🔄 | `app/(tabs)/product-details/[id].tsx` | Рефакторинг: впровадження `VariantSelector` та видалення ~100 рядків зайвого коду |
| 🆕 | `components/ui/SocialIconButton.tsx` | Компактна кнопка соцмереж (Google, Facebook, Telegram) |
| 🔄 | `app/(auth)/login.tsx`, `register.tsx` | Впровадження рядка соціальних іконок замість великої кнопки |
| ❌ | `components/ui/GoogleButton.tsx` | Видалено (замінено на `SocialIconButton`) |
| 🆕 | `app/(tabs)/products.tsx` | Окремий екран каталогу з категоріями та фільтрами |
| 🆕 | `app/(tabs)/checkout.tsx` | Новий екран оформлення замовлення |
| 🔄 | `app/(tabs)/cart.tsx` | Swipe-to-delete, новий header, перехід у checkout, inline Order Summary |
| 🔄 | `app/(tabs)/_layout.tsx` | Приховано tabbar для `cart`, `products`, `checkout` |
| 🔄 | `constants/products.ts` | Винесено `CartItem` та `INITIAL_CART` |
| 🆕 | `components/SummaryRow.tsx` | Універсальний рядок для summary-блоків (label/value) |
| 🆕 | `constants/authStyles.ts` | Спільні стилі для auth-екранів (container, header, error, divider, footer) |
| 🔄 | `app/(auth)/login.tsx` | Перехід на `authStyles`, видалення ~60 рядків дубльованих стилів |
| 🔄 | `app/(auth)/register.tsx` | Видалення мертвого коду (`error`, `notFound`), повний перехід на `authStyles` |
| 🐛 | `app/(auth)/forgot-password.tsx` | Виправлено баг: додано рендер `serverError`, видалено мертвий `notFound`, перехід на `authStyles` |
| 🔄 | `schemas/authSchema.ts` | Виправлено текст у повідомленні валідації |
| 🛡️ | `components/**/*.tsx`, `app/**/*.tsx` | Повна відмова від `any` на користь строгих типів (interfaces, type casting, `unknown` для помилок) |

#### Заплановано
- [ ] Винесення повторюваних елементів (банери, стрічка пошуку) в окремі UI-компоненти.
- [ ] Налаштування EAS Secrets для CI/CD збірок.
- [ ] Підключити checkout до реального стану кошика (items/subtotal/total).
- [ ] Додати Undo після swipe-видалення товару з кошика.
- [ ] Довести нові екрани до повної dark/light parity без hardcoded кольорів.

---

### 🔴 [22.04.2026] Advanced Search · Filters · Modular Refactoring · Code Style
    
**Що зроблено:** Створення повноцінної системи пошуку та фільтрації товарів (Search Flow) з централізацією констант, використанням нативних анімацій, рефакторингом компонентів та глобальним оновленням стилю коду.

---

#### Рішення та обґрунтування

**🔍 Реалізація пошуку та фільтрації**
- **Проблема:** Повна відсутність інструментів для знаходження товарів за назвою, категорією або ціною.
- **Рішення:** Створення екрана пошуку з глобальною фільтрацією та винос додаткових параметрів у Bottom Sheet (`ActionSheet`).
- **Чому саме так:** Це дозволяє тримати інтерфейс чистим для швидкого пошуку, надаючи розширені можливості лише за запитом користувача.

**⚡ Price Slider (Reanimated 3)**
- **Проблема:** Дьоргання ціни при оновленні через React state під час руху повзунка.
- **Рішення:** Використання `SharedValues` та логіки `translationX`. Оновлення ціни відбувається в нативному потоці через `AnimatedTextInput`.
- **Чому саме так:** Забезпечує стабільні 60 FPS, роблячи взаємодію з ціною максимально гладкою.

**🏗 Модульний рефакторинг шторки**
- **Проблема:** Шторка фільтрів стала занадто складною для розміщення в одному файлі.
- **Рішення:** Винесення логіки слайдера в окремий компонент `PriceRangeSlider.tsx`.
- **Чому саме так:** Дозволяє ізолювати складну математику анімацій та покращити читабельність основного файлу `FiltersSheet.tsx`.

**🏢 Централізація даних (Single Source of Truth)**
- **Проблема:** Незручність управління розрізненими масивами опцій для фільтрів.
- **Рішення:** Винесення всіх констант (`PRODUCT_CATEGORIES`, `BRAND_OPTIONS`, `COLOR_OPTIONS`) в єдиний файл `constants/products.ts`.
- **Чому саме так:** Забезпечує легкість масштабування та одну точку правки для всіх параметрів фільтрації.

**🌓 Адаптація під світлу/темну теми**
- **Проблема:** Стандартні елементи вводу не завжди коректно відображають текст при зміні системної теми.
- **Рішення:** Динамічне керування кольорами тексту та фону через хук `useThemeColor`.

**⚡ UX: Автофокус при переході**
- **Рішення:** Використання `autoFocus={true}` при ініціалізації екрана пошуку.
- **Чому саме так:** Зменшує кількість дій користувача, дозволяючи почати ввід тексту одразу після відкриття пошуку.

**💎 Глобальне форматування**
- **Рішення:** Перехід на використання табуляції у всіх файлах проекту.
- **Причина:** Просто так.

---

#### Змінені файли

| # | Файл | Зміна |
|---|------|-------|
| 🆕 | `components/ui/PriceRangeSlider.tsx` | Високопродуктивний компонент слайдера цін |
| 🆕 | `app/(tabs)/search.tsx` | Екран пошуку з інтеграцією фільтрів |
| 🔄 | `components/FiltersSheet.tsx` | Рефакторинг шторки фільтрів |
| 🔄 | `constants/products.ts` | Централізація опцій фільтрації та мок-даних |
| 🏁 | Глобально | Оновлення табуляції у всіх файлах проекту |

#### Заплановано
- [ ] Збереження історії останніх пошукових запитів
- [ ] Оптимізація списків товарів
- [ ] Додавання скелетонів для завантаження

---

### 🔴 [21.04.2026] Home Screen · Product Details · Image Gallery

**Що зроблено:** Головний екран із горизонтальними слайдерами + повноцінний екран деталей товару (галерея, зум, вибір розміру, bottom bar) + інструкція для ШІ для документації.

---

#### Рішення та обґрунтування

**🔄 FlashList замість Carousel**
- **Проблема:** `react-native-reanimated-carousel` спричиняв дьоргання інтерфейсу при скролі.
- **Рішення:** `@shopify/flash-list` — рендерить тільки видимі елементи, не конфліктує з жестами вкладених `ScrollView`.
- **Компроміс:** Останній елемент слайдера поки не обрізається краєм екрана — виправлю окремо.

**🖼 Галерея на екрані деталей**
- `FlashList` з `pagingEnabled` → посторінковий горизонтальний свайп між фото.
- Dots-індикатор: активна крапка розширюється до `width: 18` (стандартний патерн).
- Поточний індекс відстежується через `onMomentumScrollEnd`.
- **Чому FlashList, а не FlatList?** Відсутність конфліктів жестів при вкладенні в зовнішній `ScrollView`.

**🔍 Зум зображення**
- Тап на фото → `Modal` з `react-native-image-pan-zoom` (pinch / pan / double-tap).

**🔢 OptionSelector (вибір розміру)**
- Винесено в окремий компонент для подальшого повторного використання.
- Недоступні розміри: `opacity: 0.3` + діагональна лінія поверх елемента.

**📦 Зміна інтерфейсу `ProductItem`**
```ts
// Було
image: string

// Стало — зворотна сумісність збережена
image: string     // картки на головному екрані (без змін)
images: string[]  // галерея на екрані деталей (нове поле)
```

---

#### Змінені файли

| # | Файл | Зміна |
|---|------|-------|
| 🆕 | `app/(tabs)/index.tsx` | Головна сторінка, FlashList слайдери |
| 🆕 | `app/(tabs)/product-details/[id].tsx` | Екран деталей товару |
| 🔄 | `components/ProductCard.tsx` | Адаптація під горизонтальні списки |
| 🔄 | `constants/products.ts` | Поле `images: string[]` в інтерфейсі та моках |
| 🔄 | `package.json` | + `@shopify/flash-list`, + `react-native-image-pan-zoom` |

#### Заплановано
- [ ] Обрізка останнього елемента слайдера краєм екрана
- [ ] Промо-банери: перехід на динамічне управління з БД (4 варіанти дизайну)

---

### 🔴 [20.04.2026] Auth Validation & Refactoring

**Що зроблено:** Клієнтська валідація авторизаційного флоу через зв'язку React Hook Form + Zod.

---

#### Рішення та обґрунтування

**🛡 Zod замість ручної валідації**
- **Чому Zod?** Схеми автоматично генерують TypeScript-типи через `z.infer` — один source of truth для валідації і типізації одночасно.
- Централізовані правила: `emailRule`, `passwordRule` (мін. 6 символів + обов'язкова цифра в `registerSchema`).

**📋 React Hook Form + Controller**
- `useForm` з `@hookform/resolvers/zod` → Zod-схема напряму підключається як resolver.
- `<Controller />` зв'язує UI-компоненти з формою без зайвих ре-рендерів (на відміну від `useState` на кожне поле).

**🔴 Real-time feedback в `AppInput`**
- Доданий проп `error?: string`.
- При помилці валідації: червоний border + текст підказки з'являються миттєво, без сабміту форми.

---

#### Змінені файли

| # | Файл | Зміна |
|---|------|-------|
| 🆕 | `schemas/authSchema.ts` | Zod-схеми для login / register / forgot-password |
| 🆕 | `app/(tabs)/favorites.tsx` | Екран обраного |
| 🆕 | `hooks/useGoogleAuth.ts` | Заглушка-хук для Google Auth |
| 🔄 | `app/(auth)/login.tsx` | Рефакторинг форми під RHF + Zod |
| 🔄 | `app/(auth)/register.tsx` | Рефакторинг форми під RHF + Zod |
| 🔄 | `app/(auth)/forgot-password.tsx` | Рефакторинг форми під RHF + Zod |
| 🔄 | `components/ui/AppInput.tsx` | Prop `error`, візуалізація помилок |

---

### 🔴 [19.04.2026] Navigation Overhaul & Architecture

**Що зроблено:** Реструктуризація роутингу на Expo Router Groups + Auth Guard.

---

#### Рішення та обґрунтування

**🗺 File-based групи замість ручного Stack**
- Групи `(auth)`, `(tabs)`, `(settings)`, `(support)`, `(profile-extra)` — кожна має свій `_layout.tsx`.
- Це дає ізольовані стеки навігації без prop drilling і без конфліктів між екранами.

**🔒 Auth Guard в `_layout.tsx`**
- Редирект з кореневого `_layout.tsx` залежно від стану `AuthContext`.
- Неавторизований користувач фізично не може потрапити в `(tabs)` — редирект відбувається до рендеру.

**🎨 Рефакторинг `Colors.ts`**
- Перехід до єдиної палітри замість розрізнених значень — основа для консистентної теми по всьому проєкту.

---

#### Змінені файли

| # | Файл | Зміна |
|---|------|-------|
| 🔄 | `app/_layout.tsx` | Redirect logic, Auth Guard |
| 🔄 | `constants/Colors.ts` | Design system палітра |
| 🆕 | `components/SettingsItem.tsx` | Універсальний компонент рядка налаштувань |
| 🆕 | `app/(tabs)/_layout.tsx` | Bottom Tab навігація |
| 🆕 | `app/(auth)/_layout.tsx` | Auth stack |
| 🆕 | `app/(settings)/_layout.tsx` | Settings stack |
| 🆕 | `app/(support)/_layout.tsx` | Support stack |
| 🆕 | `app/(profile-extra)/_layout.tsx` | Profile extra stack |
| 🆕 | `app/(settings)/settings.tsx` | Повноцінний UI, без логіки |
| 🆕 | `app/(settings)/notifications.tsx` | Повноцінний UI, без логіки |
| 🆕 | `app/(settings)/language.tsx` | Повноцінний UI, без логіки |
| 🆕 | `app/(settings)/privacy.tsx` | Повноцінний UI, без логіки |
| 🆕 | `app/(settings)/about-us.tsx` | Повноцінний UI, без логіки |
| 🆕 | `app/(support)/help-center.tsx` | Повноцінний UI, без логіки |
| 🆕 | `app/(tabs)/search.tsx` | Placeholder |
| 🆕 | `app/(tabs)/cart.tsx` | Placeholder |
| 🆕 | `app/(tabs)/orders.tsx` | Placeholder |
| 🆕 | `app/(tabs)/categories.tsx` | Placeholder |
| 🆕 | `app/(support)/contact.tsx` | Placeholder |
| 🆕 | `app/(profile-extra)/profile-details.tsx` | Placeholder |

---

### 🔴 [17.04.2026] Firebase Auth Integration

**Що зроблено:** Підключення Firebase SDK + глобальний стейт авторизації.

---

#### Рішення та обґрунтування

**🔥 Firebase + AsyncStorage Persistence**
- `getReactNativePersistence(AsyncStorage)` → сесія зберігається після перезапуску додатку.
- Ініціалізація винесена в `constants/firebase.ts` — один інстанс на весь проєкт.

**🌐 AuthContext**
- Глобальний контекст замість передачі стану пропами.
- Подписка на `onAuthStateChanged` → UI реагує на зміну авторизації автоматично.

---

#### Змінені файли

| # | Файл | Зміна |
|---|------|-------|
| 🆕 | `context/AuthContext.tsx` | Глобальний стейт авторизації |
| 🆕 | `constants/firebase.ts` | Ініціалізація Firebase |
| 🆕 | `components/ui/GoogleButton.tsx` | UI кнопка Google Sign-In |
| 🔄 | `app/(tabs)/profile.tsx` | Відображення даних юзера + Sign Out |
| ❌ | `app/(auth)/reset-password.tsx` | Видалено — замінено на новий флоу |
| ❌ | `app/(auth)/verify-code.tsx` | Видалено — замінено на новий флоу |

---

### 🔴 [16.04.2026] UI Construction & Components

**Що зроблено:** Базова бібліотека UI-компонентів + конфігурація EAS збірок.

---

#### Змінені файли

| # | Файл | Зміна |
|---|------|-------|
| 🆕 | `components/ui/AppButton.tsx` | Базова кнопка з кастомними стилями |
| 🆕 | `components/ui/BackButton.tsx` | Кнопка назад |
| 🆕 | `components/ui/AppInput.tsx` | Перша версія поля вводу |
| 🆕 | `app/(auth)/forgot-password.tsx` | Базовий UI |
| 🆕 | `app/(auth)/success.tsx` | Базовий UI |
| 🆕 | `eas.json` | EAS конфігурація для Android/iOS |

---

### 🔴 [15.04.2026] Initial Setup & Theme Fixes

**Що зроблено:** Ініціалізація проєкту, чистка дефолтного шаблону, виправлення рендерингу тем.

---

#### Рішення та обґрунтування

**🎨 Фікс білих блоків під текстом (Light тема)**
- Дефолтний шаблон `tabs@54` мав hardcoded кольори в кількох компонентах — замінено на `useColorScheme`-залежні значення.

---

#### Змінені файли

| # | Файл | Зміна |
|---|------|-------|
| 🆕 | `app.json`, `package.json`, `tsconfig.json` | Конфіги проєкту |
| 🆕 | `app/+html.tsx`, `app/+not-found.tsx` | Системні екрани |
| 🆕 | `app/(auth)/login.tsx`, `register.tsx` | Базовий UI |
| 🆕 | `assets/fonts/SpaceMono-Regular.ttf` | Шрифт |
| 🔄 | `components/Themed.tsx` | Фікс тем |
| 🔄 | `components/StyledText.tsx` | Фікс тем |
| 🔄 | `components/useColorScheme.ts` | Фікс тем |
| ❌ | `components/EditScreenInfo.tsx` | Видалено дефолтний шаблон |
| ❌ | `hooks/useClientOnlyValue.ts` | Видалено дефолтний шаблон |
| ❌ | `hooks/useClientOnlyValue.web.ts` | Видалено дефолтний шаблон |
| ❌ | `components/useColorScheme.web.ts` | Видалено дефолтний шаблон |

---

## Скріншоти

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
