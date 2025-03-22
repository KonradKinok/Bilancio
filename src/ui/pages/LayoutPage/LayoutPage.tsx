import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "../../components/Navigation/Navigation";
import scss from "./LayoutPage.module.scss";

export const LayoutPage: React.FC = () => {
  return (
    <div className={scss["layoutpage-main-container"]}>
      <header className={scss["header-main-container"]}>
        <Navigation />
      </header>
      <main className={scss["main-main-container"]}>
        <Suspense fallback={"LOADING..."}>
          <Outlet />
        </Suspense>
      </main>

      {/* <Toaster position="top-right" reverseOrder={false} /> */}
    </div>
  );
};
