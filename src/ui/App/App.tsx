import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutPage } from "../pages/LayoutPage/LayoutPage";
import { RestrictedRoute } from "../components/RestrictedRoute/RestrictedRoute";
import { Loader } from "../components/Loader/Loader";

const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const ReportsPage = lazy(() => import("../pages/ReportsPage/ReportsPage"));

// Główne strony
const ReportsStandardPage = lazy(
  () => import("../pages/ReportsPage/ReportsStandardPage/ReportsStandardPage")
);
const ReportsCustomPage = lazy(
  () => import("../pages/ReportsPage/ReportsCustomPage/ReportsCustomPage")
);
const SettingsPage = lazy(() => import("../pages/SettingsPage/SettingsPage"));

// Zagnieżdżone strony w ReportsStandardPage
const ReportStandardInvoicePage = lazy(
  () =>
    import(
      "../pages/ReportsPage/ReportsStandardPage/ReportStandardInvoicePage/ReportStandardInvoicePage"
    )
);
const ReportStandardDocumentsPage = lazy(
  () =>
    import(
      "../pages/ReportsPage/ReportsStandardPage/ReportStandardDocumentsPage/ReportStandardDocumentsPage"
    )
);

// Zagnieżdżone strony w SettingsPage
const DocumentsPage = lazy(
  () => import("../pages/SettingsPage/DocumentsPage/DocumentsPage")
);
const UsersPage = lazy(
  () => import("../pages/SettingsPage/UsersPage/UsersPage")
);

// Inne strony
const NotLoggedInPage = lazy(
  () => import("../pages/NotLoggedInPage/NotLoggedInPage")
);

const App: React.FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          path="/"
          element={
            <RestrictedRoute
              component={LayoutPage}
              redirectTo="/notLoggedInPage"
            />
          }
        >
          <Route index element={<HomePage />} />
          <Route path="reportsPage" element={<ReportsPage />}>
            <Route
              index
              element={<Navigate to="reportsStandardPage" replace />}
            />
            <Route path="reportsStandardPage" element={<ReportsStandardPage />}>
              <Route
                index
                element={<Navigate to="reportsStandardInvoicesPage" replace />}
              />
              <Route
                path="reportsStandardInvoicesPage"
                element={<ReportStandardInvoicePage />}
              />
              <Route
                path="reportsCustomDocumentsPage"
                element={<ReportStandardDocumentsPage />}
              />
            </Route>
            <Route path="reportsCustomPage" element={<ReportsCustomPage />} />
          </Route>
          <Route path="settingsPage" element={<SettingsPage />}>
            <Route index element={<Navigate to="documentsPage" replace />} />
            <Route path="documentsPage" element={<DocumentsPage />} />
            <Route path="usersPage" element={<UsersPage />} />
          </Route>
        </Route>
        <Route path="notLoggedInPage" element={<NotLoggedInPage />} />
        <Route path="*" element={<LayoutPage />} />
      </Routes>
    </Suspense>
  );
};
export default App;
