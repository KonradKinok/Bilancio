# React + TypeScript + Vite

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

```
Bilancio
├─ backup
│  ├─ BilancioDataBase1.db
│  ├─ BilancioDataBase20.04.2025.db
│  ├─ BilancioDataBase20.04.2025a.db
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
│  │  ├─ trayIcon.png
│  │  └─ trayIconTemplate.png
│  ├─ electron
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
│  │  │  ├─ status.backup..js
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
│     │  ├─ ButtonCancel
│     │  │  ├─ ButtonCancel.module.scss
│     │  │  └─ ButtonCancel.tsx
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
│     │  ├─ MainTable
│     │  │  ├─ MainTable.module.scss
│     │  │  └─ MainTable.tsx
│     │  ├─ ModalAddInvoice
│     │  │  ├─ ModalAddInvoice.module.scss
│     │  │  └─ ModalAddInvoice.tsx
│     │  ├─ Navigation
│     │  │  ├─ Navigation.module.scss
│     │  │  └─ Navigation.tsx
│     │  ├─ SingleInput
│     │  │  ├─ SingleInput.module.scss
│     │  │  └─ SingleInput.tsx
│     │  └─ TextInput
│     │     ├─ TextInput.module.scss
│     │     └─ TextInput.tsx
│     ├─ hooks
│     │  ├─ useAllDocumentName.ts
│     │  ├─ useAllInvoices.ts
│     │  ├─ useConnectedTableDictionary.ts
│     │  ├─ useLocalStorage.ts
│     │  ├─ useTableDictionaryDocuments.ts
│     │  └─ useToggle.ts
│     ├─ index.css
│     ├─ main.tsx
│     ├─ pages
│     │  ├─ HomePage
│     │  │  ├─ HomePage.module.scss
│     │  │  └─ HomePage.tsx
│     │  ├─ LayoutPage
│     │  │  ├─ LayoutPage.module.scss
│     │  │  └─ LayoutPage.tsx
│     │  └─ ReportDataPage
│     │     └─ ReportDataPage.tsx
│     ├─ TempStart
│     │  ├─ TempStart.css
│     │  └─ TempStart.tsx
│     ├─ useStatistics.ts
│     └─ vite-env.d.ts
├─ structure.txt
├─ tsconfig.json
├─ tsconfig.node.json
├─ types.d.ts
└─ vite.config.ts

```