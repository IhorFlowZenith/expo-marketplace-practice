# 👟 Expo Marketplace Practice

Mobile marketplace practice project on Expo.

---

## 📌 Зміст
* [🟡 Міні-інформація](#info)
* [🟣 Скріншоти](#screenshots)
* [🟢 19.04.2026 -- Commit 8](#commit-8)
* [🔴 17.04.2026 -- Commit 7](#commit-7)
* [🔴 16.04.2026 -- Commit 6](#commit-6)
* [🔴 15.04.2026 -- Commit 3, 4, 5](#commit-3-4-5)
* [🔴 15.04.2026 -- Commit 2](#commit-2)
* [🔴 15.04.2026 -- Commit 1](#commit-1)

<a name="commit-8"></a>
## 🟢 [19.04.2026] — Дуже багато нових сторінок
* Створено групування сторінок `(auth)`, `(profile-extra)`, `(settings)`, `(support)` та `(tabs)`.
* Розроблено повноцінні сторінки `about-us.tsx`, `help-center.tsx`, `language.tsx`, `notifications.tsx`, `privacy.tsx` та `settings.tsx`. Всі сторінки без функціоналу, лише фронт.
* Розроблено сторінки-заглушки `search.tsx`, `cart.tsx`, `orders.tsx`, `categories.tsx`, `contact.tsx`, `help.tsx`, `share.tsx` та `profile-details.tsx`.
* Розроблене нижнє tab-меню
* Винесено всі кольори в окремий файл `src/constants/Colors.ts`
* Оновлено всі скріншоти

<a name="commit-7"></a>
## 🔴 [17.04.2026] — Змінено авторизацію + firebase
* Видалено сторінки `reset-password` та `verify-code.tsx`.
* Перероблено сторінки з папки (auth).
* Підключено авторизація firebase. 
* Підключено сам firebase.
* Tab 1 — показує ім'я, email, кнопку Sign Out
* 🟠 Авторизація через Google тимчасово не працює.
* 🟠 Половина коду було розроблено за допомгою ШІ.

<a name="commit-6"></a>
## 🔴 [16.04.2026] — Додаткові сторінки + компоненти
* Розроблено сторінки: `forgot-password.tsx`, `reset-password.tsx`, `success.tsx` та `verify-code.tsx`.
* Кнопку зроблено компонентом `src/components/ui/AppButton.tsx`.
* Кнопку "Назад" зроблено компонентом `src/components/ui/BackButton.tsx`.
* Всі сторінки без функціоналу (З базовим router)
* Встановлено `eas-cli` для збірки APK файлів. (Просто встановив) 

<a name="commit-3-4-5"></a>
## 🔴 [15.04.2026] — fix: RegisterScreen + README.md
* Виправлено відображення тексту на світлій темі (Прибрано білі контейнери під текстом на світлій темі).
* Добавлено скріншоти.
* 🟠 Помилку з відображення виправив ШІ.

<a name="commit-2"></a>
## 🔴 [15.04.2026] — auth: LoginScreen + RegisterScreen
* Видалено файли `EditScreenInfo.tsx`, `useClientOnlyValue.ts`, `useClientOnlyValue.web.ts` та `useColorScheme.web.ts`.
* Розроблено сторінку входу, без функціоналу.
* Розроблено сторінку реєстрації, без функціоналу.

<a name="commit-1"></a>
## 🔴 [15.04.2026] — Ініціалізація проєкту
* Створено базовий проєкт за допомогою `npx create-expo-app@latest my-tabs-app --template tabs@54`.
* Реалізована зрозуміла та структурована схема `README.md` з клікабельним змістом та журналом змін.

<a name="screenshots"></a>
##  🟣 Скріншоти

### 🔐 Authentication Flow
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
        <td align="center"><b>Privacy Policy Dark</b></td> 
        <td align="center"><b>Privacy Policy Light</b></td> 
    </tr> 
    <tr> 
        <td><img src="./assets/screenshots/LanguageScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/LanguageScreen-light.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/PrivacyPoliciScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/PrivacyPoliciScreen-light.jpg" width="200"/></td>
    </tr>
    <tr> 
        <td align="center"><b>Help Center Dark</b></td> 
        <td align="center"><b>Help Center Light</b></td> 
        <td align="center"><b>About Us Dark</b></td> 
        <td align="center"><b>About Us Light</b></td> 
    </tr> 
    <tr> 
        <td><img src="./assets/screenshots/HelpCenter-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/HelpCenter-light.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/AboutUsScreen-dark.jpg" width="200"/></td>
        <td><img src="./assets/screenshots/AboutUsScreen-light.jpg" width="200"/></td>
    </tr>
</table>

<a name="info"></a>
## 🟡 Міні-інформація
* Одразу адаптація під світлу й темну теми.
* 🟢 - Останній коміт
* 🔴 - Старі коміти 
* 🟠 - Міні-інформація/Коментар до коміту