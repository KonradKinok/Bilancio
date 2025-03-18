import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { LayoutPage } from "../pages/LayoutPage/LayoutPage";

const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const ReportDataPage = lazy(
  () => import("../pages/ReportDataPage/ReportDataPage")
);
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutPage />}>
        <Route index element={<HomePage />} />
        <Route path="reportDataPage" element={<ReportDataPage />} />
      </Route>
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};
export default App;
