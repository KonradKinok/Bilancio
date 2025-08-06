import React, { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LayoutPage } from "../pages/LayoutPage/LayoutPage";

const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const ReportDataPage = lazy(
  () => import("../pages/ReportDataPage/ReportDataPage")
);
const SettingsPage = lazy(() => import("../pages/SettingsPage/SettingsPage"));
const FilesPage = lazy(
  () => import("../pages/SettingsPage/FilesPage/FilesPage")
);
const DocumentsPage = lazy(
  () => import("../pages/SettingsPage/DocumentsPage/DocumentsPage")
);
const UsersPage = lazy(
  () => import("../pages/SettingsPage/UsersPage/UsersPage")
);
const ActivityLogPage = lazy(
  () => import("../pages/SettingsPage/ActivityLogPage/ActivityLogPage")
);

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutPage />}>
        <Route index element={<HomePage />} />
        <Route path="reportDataPage" element={<ReportDataPage />} />
        <Route path="settingsPage" element={<SettingsPage />}>
          <Route index element={<Navigate to="filesPage" replace />} />
          <Route path="filesPage" element={<FilesPage />} />
          <Route path="documentsPage" element={<DocumentsPage />} />
          <Route path="usersPage" element={<UsersPage />} />
          <Route path="activityPage" element={<ActivityLogPage />} />
        </Route>
      </Route>
      <Route path="*" element={<LayoutPage />} />
    </Routes>
  );
};
export default App;
