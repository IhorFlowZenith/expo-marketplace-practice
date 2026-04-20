# 👟 Expo Marketplace Practice

Комплексний мобільний маркетплейс на **Expo SDK 54**, з фокусом на архітектуру, UI/UX та типізовану валідацію.

---

## 📌 Зміст
* [🟡 Міні-інформація](#info)
* [🚀 Tech Stack](#tech-stack)
* [🗝 Key Features](#features)
* [📈 Development Progress (Milestones)](#milestones)
    * [🟢 Auth Validation & Refactoring](#commit-9)
    * [🔴 Navigation Overhaul & Architecture](#commit-8)
    * [🔴 Firebase Auth Integration](#commit-7)
    * [🔴 UI Construction & Components](#commit-6)
    * [🔴 Initial Setup & Theme Fixes](#commit-1)
* [🖼 Скріншоти](#screenshots)

<a name="info"></a>
## 🟡 Міні-інформація
* 🟢 — Останній коміт.
* 🔴 — Попередні етапи розробки.
* 🟠 — Технічні примітки.
* Автоматична підтримка Dark/Light тем.

---

<a name="tech-stack"></a>
## 🚀 Tech Stack
* **Framework:** Expo SDK 54 / React Native.
* **Navigation:** Expo Router (File-based).
* **Backend & Auth:** Firebase v12 (Email, Google Auth).
* **Form Management:** React Hook Form.
* **Validation:** Zod.
* **Animation:** Reanimated.
* **Language:** TypeScript.


---

<a name="features"></a>
## 🗝 Key Features

### 🔐 Authentication
* **Firebase Auth:** Email/Password авторизація.
* **Auth Guard:** Протекція маршрутів на основі стейту авторизації.
* **Persistent sessions:** Збереження сесій через AsyncStorage.

### 🛡 Validation
* **Zod Schemas:** Клієнтська валідація на рівні схем.
* **Real-time UI:** Візуальна індикація помилок в реальному часі.

### 🎨 UI & Theming
* **Design System:** Кастомна бібліотека UI-компонентів.
* **Themes:** Динамічна зміна кольорів (Dark/Light mode).

---

<a name="milestones"></a>
## 📈 Development Progress (Milestones)

<a name="commit-9"></a>
### 🟢 [20.04.2026] Auth Validation & Refactoring
**Опис фічі**
Реалізовано надійну клієнтську архітектуру валідації для авторизаційного флоу. Використано зв'язку **React Hook Form** та **Zod** для забезпечення Type-Safety та уникнення зайвих рендерів.

**Детальна документація по імплементації:**
1.  **Zod Schemas (`schemas/authSchema.ts`)**: 
    *   Створено централізовані схеми для перевірки даних: загальний `emailRule`, `passwordRule` (мінімум 6 символів), та підримка обов'язкової наявності цифр у `registerSchema`.
    *   Ці схеми безпосередньо генерують TypeScript типи (через `z.infer`), що дозволяє гарантувати консистентність даних по проєкту.
2.  **React Hook Form Integration**: 
    *   Форми екранів (`login.tsx`, `register.tsx`, `forgot-password.tsx`) керуються хуком `useForm` із використанням `@hookform/resolvers/zod`.
    *   Для підключення UI використана компонента `<Controller />`. Це суттєво оптимізує продуктивність: замість рендеру всієї сторінки, оновлюється виключно змінений інпут.
3.  **UI Feedback (`components/ui/AppInput.tsx`)**: 
    *   Кастомний компонент вводу було розширено пропом `error` (опціональний String).
    *   При непроходженні валідації Zod, повідомлення миттєво підхоплюється UI-компонентом, що дозволяє динамічно підсвітити поле (червоний border) та вивести підказку користувачу.

**Зміни у файлах**
*   🆕 `schemas/authSchema.ts` (нова валідація).
*   🆕 `app/(tabs)/favorites.tsx` (екран обраного).
*   🆕 `hooks/useGoogleAuth.ts` (заглушка/хук для Google Auth).
*   🔄 `app/(auth)/login.tsx`, `app/(auth)/register.tsx`, `app/(auth)/forgot-password.tsx` (рефакторинг форм).
*   🔄 `components/ui/AppInput.tsx` (візуалізація помилок валідації).
*   🔄 `README.md` (нова структура документації).

<a name="commit-8"></a>
### 🔴 [19.04.2026] Navigation Overhaul & Architecture
**Опис**
Реструктуризація роутингу на базі Expo Router Groups та впровадження Auth Guard.

**Технічні деталі**
*   **Routing:** Групування `(auth)`, `(tabs)`, `(settings)`, `(support)`, `(profile-extra)`.
*   **Auth Middleware:** Логіка редиректів в роуті залежно від стану користувача.
*   **Colors:** Рефакторинг Colors.ts під універсальну палітру.

**Зміни у файлах**
*   🔄 `app/_layout.tsx` (Redirect logic & Auth Guard).
*   🔄 `constants/Colors.ts` (Design system upgrade).
*   🆕 `components/SettingsItem.tsx` (універсальний компонент списку для налаштувань).
*   🆕 `app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx` (налаштування нижнього Tab-меню).
*   🆕 `app/(auth)/_layout.tsx`, `app/(settings)/_layout.tsx`, `app/(support)/_layout.tsx`, `app/(profile-extra)/_layout.tsx` (групування роутів навколо стеків).
*   🆕 **Екрани (з повноцінним UI, але без логіки):** `app/(settings)/settings.tsx`, `notifications.tsx`, `language.tsx`, `privacy.tsx`, `about-us.tsx`, `app/(support)/help-center.tsx`.
*   🆕 **Екрани-заглушки (пустишки/placeholders):** `app/(tabs)/search.tsx`, `cart.tsx`, `orders.tsx`, `categories.tsx`, `app/(support)/contact.tsx`, `help.tsx`, `share.tsx`, `app/(profile-extra)/profile-details.tsx`.

<a name="commit-7"></a>
### 🔴 [17.04.2026] Firebase Auth Integration
**Опис**
Підключення Firebase SDK та реалізація глобального стейту авторизації.

**Технічні деталі**
*   **State:** Впровадження AuthContext.
*   **Persistence:** Налаштування getReactNativePersistence через AsyncStorage.
*   **Config:** Ініціалізація Firebase у constants/firebase.ts.

**Зміни у файлах**
*   🆕 `context/AuthContext.tsx`
*   🆕 `constants/firebase.ts`
*   🆕 `components/ui/GoogleButton.tsx` (UI компонента для входу).
*   🔄 `app/(tabs)/profile.tsx` (відображення даних користувача та Sign Out).
*   ❌ `app/(auth)/reset-password.tsx`, `app/(auth)/verify-code.tsx` (видалено для заміни флоу).

<a name="commit-6"></a>
### 🔴 [16.04.2026] UI Construction & Components
**Опис**
Розробка базової бібліотеки UI-компонентів та конфігурація збірки.

**Технічні деталі**
*   **Components:** Створення AppButton та BackButton з кастомними стилями.
*   **EAS:** Початкова конфігурація eas.json для Android/iOS збірок.

**Зміни у файлах**
*   🆕 `components/ui/AppButton.tsx`, `components/ui/BackButton.tsx` (базові компоненти).
*   🆕 `components/ui/AppInput.tsx` (перша версія поля вводу).
*   🆕 `app/(auth)/forgot-password.tsx`, `app/(auth)/success.tsx` (базовий UI екранів).
*   🆕 `eas.json` (EAS setup).

<a name="commit-1"></a>
### 🔴 [15.04.2026] Initial Setup & Theme Fixes
**Опис**
Ініціалізація проєкту, видалення зайвого шаблону та виправлення рендерингу тем.

**Технічні деталі**
*   **Fix:** Усунення білих блоків під текстом у світлій темі.
*   **Cleaning:** Видалення дефолтних файлів з tabs@54 шаблону.
*   **Routing:** Налаштування базового Stack роутера.

**Зміни у файлах**
*   🆕 `app.json`, `package.json`, `tsconfig.json`, `.gitignore`, `expo-env.d.ts` (ініціалізація конфігів).
*   🆕 `app/+html.tsx`, `app/+not-found.tsx` (базові системні екрани).
*   🆕 `app/(auth)/login.tsx`, `app/(auth)/register.tsx` (базовий UI).
*   🆕 `assets/fonts/SpaceMono-Regular.ttf`
*   🆕 `assets/images/favicon.png`, `icon.png`, `splash-icon.png`, `adaptive-icon.png`
*   🔄 `components/Themed.tsx`, `components/StyledText.tsx`, `components/useColorScheme.ts` (фікс тем).
*   ❌ `components/EditScreenInfo.tsx`, `hooks/useClientOnlyValue.ts`, `hooks/useClientOnlyValue.web.ts`, `components/useColorScheme.web.ts` (видалено дефолтний шаблон).

---

<a name="screenshots"></a>
## 🖼 Скріншоти

### 🔐 Authentication Flow
<table>
    <tr> 
        <td align="center"><b>Login Dark</b></td> 
        <td align="center"><b>Login Light</b></td> 
        <td align="center"><b>Register Dark</b></td> 
        <td align="center"><b>Register Light</b></td> 
    </tr> 
    <tr> 
        <td><img src="https://github.com/IhorFlowZenith/expo-marketplace-practice/blob/main/assets/screenshots/login-dark.png" width="200"/></td>
        <td><img src="https://github.com/IhorFlowZenith/expo-marketplace-practice/blob/main/assets/screenshots/login-light.png" width="200"/></td>
        <td><img src="https://github.com/IhorFlowZenith/expo-marketplace-practice/blob/main/assets/screenshots/register-dark.png" width="200"/></td>
        <td><img src="https://github.com/IhorFlowZenith/expo-marketplace-practice/blob/main/assets/screenshots/register-light.png" width="200"/></td>
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
</table>

---
*Практика розробки мобільних застосунків.*