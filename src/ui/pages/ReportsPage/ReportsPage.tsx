import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAllInvoices } from "../../hooks/useAllInvoices";
import { useMainDataContext } from "../../components/Context/useMainDataContext";
import scss from "./ReportsPage.module.scss";
import { NavigationReports } from "../../components/NavigationReports/NavigationReports";
import { Loader } from "../../components/Loader/Loader";

const ReportDataPage: React.FC = () => {
  const { options } = useMainDataContext();

  return (
    <div className={`${scss[""]}`}>
      <div className={scss[""]}>
        <div>
          <NavigationReports />
        </div>
        <div className={scss[""]}>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ReportDataPage;
