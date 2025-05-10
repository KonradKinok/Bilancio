import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "../../components/Navigation/Navigation";
import scss from "./LayoutPage.module.scss";
import { Toaster } from "react-hot-toast";

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

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: { duration: 4000 },
          error: { duration: 6000 },
          loading: { duration: Infinity }, // Nie znika, dopóki nie zakończy się ładowanie
        }}
      />
    </div>
  );
};
