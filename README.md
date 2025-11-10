# Bilancio

Bilancio to desktopowa aplikacja stworzona w technologii Electron z wykorzystaniem React + TypeScript, służąca do zarządzania dokumentami komunikacyjnymi (takimi jak prawa jazdy, dowody rejestracyjne i tablice rejestracyjne) w powiązaniu z fakturami oraz do generowania dedykowanych raportów.
Aplikacja działa w pełni offline, korzystając z lokalnej bazy danych SQL, co pozwala na bezpieczne przechowywanie danych w środowisku wewnętrznym, bez potrzeby połączenia z internetem.

Główne funkcjonalności:

1. Automatyczne logowanie użytkownika - system rozpoznaje nazwę użytkownika z domeny Windows i loguje go bez konieczności wprowadzania hasła.
2. Zarządzanie fakturami - możliwość dodawania, edycji i usuwania faktur zawierających dokumenty komunikacyjne.
3. Obsługa dokumentów komunikacyjnych - przypisywanie ilości i cen poszczególnych dokumentów (np. prawa jazdy, dowody, tablice).
4. Generowanie raportów - aplikacja tworzy raporty według wybranych kryteriów, a następnie pozwala na eksport w formacie PDF, PNG oraz XLSX.
5. Rejestrowanie aktywności użytkowników - logowanie zmian i operacji w celu zapewnienia kontroli historii działań.
6. Nowoczesny interfejs - przejrzysty układ oparty o React Router, z podziałem na sekcje: Home, Reports, Settings.
7. Powiadomienia i toast messages - komunikaty wizualne o stanie generowania raportów i błędach z procesu głównego Electron.
8. Tryb w pełni desktopowy - aplikacja nie wymaga połączenia sieciowego i działa jako samodzielny program w systemie Windows.

Technologie:

1. Electron - środowisko uruchomieniowe aplikacji desktopowej.
2. React + TypeScript - warstwa interfejsu użytkownika.
3. SQL (lokalna baza) - przechowywanie danych o fakturach i dokumentach.
4. Vite - szybki system budowania aplikacji front-end.
5. React Router - obsługa nawigacji i tras (m.in. Home, Reports, Settings).
6. SCSS modules - stylizacja komponentów.
7. react-hot-toast - system powiadomień.
8. IPC (Inter-Process Communication) - komunikacja między procesem głównym a rendererem Electron.

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})


```

Bilancio
├─ backup
│  ├─ ai.docx
│  ├─ BilancioDataBase.27.07.2025.db
│  ├─ BilancioDataBase03.08.2025.db
│  ├─ BilancioDataBase1.db
│  ├─ BilancioDataBase14.07.2025.db
│  ├─ BilancioDataBase20.04.2025.db
│  ├─ BilancioDataBase20.04.2025a.db
│  ├─ BilancioDataBase21.07.2025.db
│  ├─ config.ts
│  ├─ package2.json
│  │  └─ package.json
│  └─ tsconfig.app.json..txtbackup
├─ desktopIcon.png
├─ electron-builder.json
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ playwright.config.ts
├─ README.md
├─ src
│  ├─ assets
│  │  ├─ footer
│  │  │  ├─ 3KLogo.png
│  │  │  └─ konikMaly24x24Squoosh.png
│  │  ├─ trayIcon.png
│  │  └─ trayIconTemplate.png
│  ├─ electron
│  │  ├─ config.ts
│  │  ├─ dataBase
│  │  │  ├─ dbClass.ts
│  │  │  ├─ dbFunction.ts
│  │  │  ├─ dbQuerySqlString.ts
│  │  │  └─ enum.ts
│  │  ├─ dataBase.ts
│  │  ├─ main.ts
│  │  ├─ menu.ts
│  │  ├─ pathResolver.ts
│  │  ├─ preload.cts
│  │  ├─ resourceManager.ts
│  │  ├─ sharedTypes
│  │  │  └─ status.ts
│  │  ├─ tray.ts
│  │  ├─ tsconfig.json
│  │  └─ util.ts
│  └─ ui
│     ├─ App
│     │  ├─ App.css
│     │  └─ App.tsx
│     ├─ assets
│     │  └─ react.svg
│     ├─ BaseChart.tsx
│     ├─ Chart.tsx
│     ├─ components
│     │  ├─ ButtonUniversal
│     │  │  ├─ ButtonUniversal.module.scss
│     │  │  └─ ButtonUniversal.tsx
│     │  ├─ CheckboxSlider
│     │  │  ├─ CheckboxSlider.module.scss
│     │  │  └─ CheckboxSlider.tsx
│     │  ├─ ComboBox
│     │  │  └─ ComboBox.tsx
│     │  ├─ Context
│     │  │  ├─ ElectronProvider.tsx
│     │  │  └─ useOptionsImage.ts
│     │  ├─ DateTimePicker
│     │  │  ├─ DateTimePicer.module.scss
│     │  │  └─ DateTimePicker.tsx
│     │  ├─ ErrorBoundary
│     │  │  └─ ErrorBoundary.tsx
│     │  ├─ Footer
│     │  │  ├─ Footer.module.scss
│     │  │  └─ Footer.tsx
│     │  ├─ FormAddInvoice
│     │  │  ├─ FormAddInvoice.module.scss
│     │  │  └─ FormAddInvoice.tsx
│     │  ├─ FormAddInvoiceDocuments
│     │  │  ├─ FormAddInvoiceDocuments.module.scss
│     │  │  └─ FormAddInvoiceDocuments.tsx
│     │  ├─ FormHomeDate
│     │  │  ├─ FormHomeDate.module.scss
│     │  │  └─ FormHomeDate.tsx
│     │  ├─ GlobalFunctions
│     │  │  └─ GlobalFunctions.ts
│     │  ├─ IconInfo
│     │  │  ├─ IconInfo.module.scss
│     │  │  └─ IconInfo.tsx
│     │  ├─ Loader
│     │  │  ├─ Loader.module.scss
│     │  │  └─ Loader.tsx
│     │  ├─ LogoBilancio
│     │  │  ├─ LogoBilancio.module.scss
│     │  │  └─ LogoBilancio.tsx
│     │  ├─ MainTable
│     │  │  ├─ MainTable.module.scss
│     │  │  └─ MainTable.tsx
│     │  ├─ ModalAddInvoice
│     │  │  ├─ ModalAddInvoice.module.scss
│     │  │  └─ ModalAddInvoice.tsx
│     │  ├─ ModalConfirmationSave
│     │  │  ├─ ModalConfirmationSave.module.scss
│     │  │  ├─ ModalConfirmationSave.tsx
│     │  │  ├─ TableDetailsInvoiceModalConfirmationSave
│     │  │  │  ├─ TableDetailsInvoiceModalConfirmationSave.module.scss
│     │  │  │  └─ TableDetailsInvoiceModalConfirmationSave.tsx
│     │  │  └─ TableInvoiceModalConfirmationSave
│     │  │     ├─ TableInvoiceModalConfirmationSave.module.scss
│     │  │     └─ TableInvoiceModalConfirmationSave.tsx
│     │  ├─ ModalSelectionWindow
│     │  │  ├─ ModalSelectionWindow.module.scss
│     │  │  └─ ModalSelectionWindow.tsx
│     │  ├─ Navigation
│     │  │  ├─ Navigation.module.scss
│     │  │  └─ Navigation.tsx
│     │  ├─ NavigationSettings
│     │  │  ├─ NavigationSettings.module.scss
│     │  │  └─ NavigationSettings.tsx
│     │  ├─ Pagination
│     │  │  ├─ Pagination.module.scss
│     │  │  ├─ pagination.scss
│     │  │  ├─ Pagination.tsx
│     │  │  └─ usePagination.ts
│     │  ├─ SingleInput
│     │  │  ├─ SingleInput.module.scss
│     │  │  └─ SingleInput.tsx
│     │  └─ TextInput
│     │     ├─ TextInput.module.scss
│     │     └─ TextInput.tsx
│     ├─ hooks
│     │  ├─ useAddActivityLogs.ts
│     │  ├─ useAddDocument.ts
│     │  ├─ useAddInvoice.ts
│     │  ├─ useAllActivityLog.ts
│     │  ├─ useAllDocumentName.ts
│     │  ├─ useAllInvoices.ts
│     │  ├─ useConfig.ts
│     │  ├─ useConnectedTableDictionary.ts
│     │  ├─ useDeleteDocument.ts
│     │  ├─ useDeleteInvoice.ts
│     │  ├─ useEditDocument.ts
│     │  ├─ useLocalStorage.ts
│     │  ├─ useRestoreDocument.ts
│     │  ├─ useRestoreInvoice.ts
│     │  ├─ useTableDictionaryDocuments.ts
│     │  ├─ useToggle.ts
│     │  └─ useUpdateInvoice.ts
│     ├─ index.css
│     ├─ main.tsx
│     ├─ pages
│     │  ├─ HomePage
│     │  │  ├─ HomePage.module.scss
│     │  │  └─ HomePage.tsx
│     │  ├─ LayoutPage
│     │  │  ├─ LayoutPage.module.scss
│     │  │  └─ LayoutPage.tsx
│     │  ├─ ReportDataPage
│     │  │  └─ ReportDataPage.tsx
│     │  └─ SettingsPage
│     │     ├─ ActivityLogPage
│     │     │  ├─ ActivityLog.module.scss
│     │     │  ├─ ActivityLogPage.tsx
│     │     │  └─ SeparateActivityLog
│     │     │     ├─ SeparateActivityLog.module.scss
│     │     │     └─ SeparateActivityLog.tsx
│     │     ├─ DocumentsPage
│     │     │  ├─ DocumentsPage.module.scss
│     │     │  ├─ DocumentsPage.tsx
│     │     │  └─ SeparateDocument
│     │     │     ├─ SeparateDocument.module.scss
│     │     │     └─ SeparateDocument.tsx
│     │     ├─ FilesPage
│     │     │  ├─ FilesPage.module.scss
│     │     │  └─ FilesPage.tsx
│     │     ├─ SettingsPage.module.scss
│     │     ├─ SettingsPage.tsx
│     │     └─ UsersPage
│     │        ├─ UsersPage.module.scss
│     │        └─ UsersPage.tsx
│     ├─ TempStart
│     │  ├─ TempStart.css
│     │  └─ TempStart.tsx
│     ├─ useStatistics.ts
│     └─ vite-env.d.ts
├─ tsconfig.json
├─ tsconfig.node.json
├─ types.d.ts
└─ vite.config.ts
