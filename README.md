# 👟 Expo Marketplace Practice

Mobile marketplace practice project on Expo.

---

## 📌 Зміст
* [🟡 Міні-інформація](#info)
* [🟣 Скріншоти](#screenshots)
* [🟢 17.04.2026 -- Commit 7](#commit-7)
* [🔴 16.04.2026 -- Commit 6](#commit-6)
* [🔴 15.04.2026 -- Commit 3, 4, 5](#commit-3-4-5)
* [🔴 15.04.2026 -- Commit 2](#commit-2)
* [🔴 15.04.2026 -- Commit 1](#commit-1)

<a name="commit-7"></a>
## 🟢 [17.04.2026] — Додаткові сторінки + компоненти
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
        <td align="center"><b>Forgot Password Dark</b></td>
        <td align="center"><b>Forgot Password Light</b></td>
        <td align="center"><b>Verify Code Dark</b></td>
        <td align="center"><b>Verify Code Light</b></td>
    </tr>
    <tr>
        <td><img src="https://github.com/IhorFlowZenith/expo-marketplace-practice/blob/main/assets/screenshots/forgot-password-dark.png" width="200"/></td>
        <td><img src="https://github.com/IhorFlowZenith/expo-marketplace-practice/blob/main/assets/screenshots/forgot-password-light.png" width="200"/></td>
        <td><img src="https://github.com/IhorFlowZenith/expo-marketplace-practice/blob/main/assets/screenshots/verify-code-dark.png" width="200"/></td>
        <td><img src="https://github.com/IhorFlowZenith/expo-marketplace-practice/blob/main/assets/screenshots/verify-code-light.png" width="200"/></td>
    </tr>
<tr>
        <td align="center"><b>Reset Password Dark</b></td>
        <td align="center"><b>Reset Password Light</b></td>
        <td align="center"><b>Success Dark</b></td>
        <td align="center"><b>Success Light</b></td>
    </tr>
    <tr>
        <td><img src="https://github.com/IhorFlowZenith/expo-marketplace-practice/blob/main/assets/screenshots/reset-password-dark.png" width="200"/></td>
        <td><img src="https://github.com/IhorFlowZenith/expo-marketplace-practice/blob/main/assets/screenshots/reset-password-light.png" width="200"/></td>
        <td><img src="https://github.com/IhorFlowZenith/expo-marketplace-practice/blob/main/assets/screenshots/success-dark.png" width="200"/></td>
        <td><img src="https://github.com/IhorFlowZenith/expo-marketplace-practice/blob/main/assets/screenshots/success-light.png" width="200"/></td>
    </tr>
</table>

<a name="info"></a>
## 🟡 Міні-інформація
* Одразу адаптація під світлу й темну теми.
* 🟢 - Останній коміт
* 🔴 - Старі коміти 
* 🟠 - Міні-інформація/Коментар до коміту