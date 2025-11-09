import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { NavigationReports } from "../../components/NavigationReports/NavigationReports";
import { Loader } from "../../components/Loader/Loader";
import scss from "./ReportsPage.module.scss";

/**
 * Strona raportów — główny kontener dla sekcji raportowych.
 * Wyświetla nawigację raportów i wczytuje dynamicznie ich zawartość przez React Router (Outlet).
 */
const ReportsPage: React.FC = () => {
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

export default ReportsPage;
