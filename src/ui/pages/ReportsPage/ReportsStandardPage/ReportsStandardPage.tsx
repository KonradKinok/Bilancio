import { Suspense, useState } from "react";
import { useMainDataContext } from "../../../components/Context/useMainDataContext";
import scss from "./ReportsStandardPage.module.scss";
import { NavigationReportStandard } from "../../../components/NavigationReportStandard/NavigationReportStandard";
import { Loader } from "../../../components/Loader/Loader";
import { Outlet } from "react-router-dom";

const ReportsStandardPage: React.FC = () => {
  const { options } = useMainDataContext();

  return (
    <div className={`${scss["reportsStandardPage-main-container"]}`}>
      <div className={scss[""]}>
        <div>
          <NavigationReportStandard />
        </div>
        <div className={scss["reportsStandardPage-outlet-container"]}>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
export default ReportsStandardPage;
