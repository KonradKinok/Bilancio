import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { NavigationSettings } from "../../components/NavigationSettings/NavigationSettings";
import { Loader } from "../../components/Loader/Loader";
import scss from "./SettingsPage.module.scss";

const SettingsPage: React.FC = () => {
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
    </div>
  );
};

export default SettingsPage;
