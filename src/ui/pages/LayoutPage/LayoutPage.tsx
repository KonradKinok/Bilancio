import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Navigation } from "../../components/Navigation/Navigation";
import { Loader } from "../../components/Loader/Loader";
import { Footer } from "../../components/Footer/Footer";
import scss from "./LayoutPage.module.scss";

export const LayoutPage: React.FC = () => {
  console.log("Rendering LayoutPage");
  return (
    <div className={scss["layoutpage-main-container"]}>
      <header className={scss["header-main-container"]}>
        <Navigation />
      </header>
      <main className={scss["main-main-container"]}>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: { duration: 4000 },
          error: { duration: 6000 },
          loading: { duration: 3000 }, //Infinity- Nie znika, dopóki nie zakończy się ładowanie
        }}
      />
    </div>
  );
};
