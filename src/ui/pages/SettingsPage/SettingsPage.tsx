import { Suspense } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAllInvoices } from "../../hooks/useAllInvoices";
import scss from "./SettingsPage.module.scss";
import { NavigationSettings } from "../../components/NavigationSettings/NavigationSettings";
import { Loader } from "../../components/Loader/Loader";
const SettingsPage: React.FC = () => {
  // const { data: dataAllInvoices } = useAllInvoices();
  // console.log("ReportDataPage data", dataAllInvoices);
  return (
    <div>
      <div className={scss[""]}>
        <div>
          <NavigationSettings />
        </div>
        <div className={scss["settings-outlet-container"]}>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
    </div>
  );
};

export default SettingsPage;
