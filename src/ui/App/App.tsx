import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutPage } from "../pages/LayoutPage/LayoutPage";
import { RestrictedRoute } from "../components/RestrictedRoute/RestrictedRoute";

const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const ReportDataPage = lazy(
  () => import("../pages/ReportDataPage/ReportDataPage")
);
const SettingsPage = lazy(() => import("../pages/SettingsPage/SettingsPage"));

const DocumentsPage = lazy(
  () => import("../pages/SettingsPage/DocumentsPage/DocumentsPage")
);
const UsersPage = lazy(
  () => import("../pages/SettingsPage/UsersPage/UsersPage")
);
const ActivityLogPage = lazy(
  () => import("../pages/SettingsPage/ActivityLogPage/ActivityLogPage")
);
const NotLoggedInPage = lazy(
  () => import("../pages/NotLoggedInPage/NotLoggedInPage")
);
const App: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div>
          Ładowanie... Ładowanie... Ładowanie... Ładowanie... Ładowanie...
          Ładowanie... Ładowanie... Ładowanie... Ładowanie... Ładowanie...
        </div>
      }
    >
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
          <Route path="reportDataPage" element={<ReportDataPage />} />
          <Route path="settingsPage" element={<SettingsPage />}>
            <Route index element={<Navigate to="documentsPage" replace />} />
            <Route path="documentsPage" element={<DocumentsPage />} />
            <Route path="usersPage" element={<UsersPage />} />
            <Route path="activityPage" element={<ActivityLogPage />} />
          </Route>
        </Route>
        <Route path="notLoggedInPage" element={<NotLoggedInPage />} />
        <Route path="*" element={<LayoutPage />} />
      </Routes>
    </Suspense>
  );
};
export default App;
