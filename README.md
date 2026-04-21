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

---

## Журнал змін

> 🟢 — Останній коміт · 🔴 — Попередні етапи · Читається зверху вниз (нове → старе)

---

### 🟢 [21.04.2026] Home Screen · Product Details · Image Gallery

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
- Підписка на `onAuthStateChanged` → UI реагує на зміну авторизації автоматично.

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
