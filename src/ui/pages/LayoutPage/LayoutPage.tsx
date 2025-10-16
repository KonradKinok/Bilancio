import { Suspense, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Navigation } from "../../components/Navigation/Navigation";
import { Loader } from "../../components/Loader/Loader";
import { Footer } from "../../components/Footer/Footer";
import scss from "./LayoutPage.module.scss";
import { ButtonUp } from "../../components/ButtonUp/ButtonUp";
import { displayErrorMessage } from "../../components/GlobalFunctions/GlobalFunctions";

export const LayoutPage: React.FC = () => {
  // Ref do przechowywania ID toasta "loading"
  const loadingToastId = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = window.electron.onGeneratingDocumentStatus(
      ({ status, message }) => {
        switch (status) {
          case 0:
            // Tworzenie toast i zapisanie jego ID
            loadingToastId.current = toast.loading(message);
            break;
          case 1:
            // Aktualizacja istniejącego toast jako sukces
            if (loadingToastId.current) {
              toast.success(message, { id: loadingToastId.current });
              loadingToastId.current = null; // reset ID
            } else {
              toast.success(message);
            }
            break;
          case 2:
            // Aktualizacja istniejącego toast jako błąd
            if (loadingToastId.current) {
              toast.error(message, { id: loadingToastId.current });
              loadingToastId.current = null; // reset ID
              displayErrorMessage(
                "ReportStandardInvoicePage",
                "handleButtonClick",
                `${message}`,
                false
              );
            } else {
              displayErrorMessage(
                "ReportStandardInvoicePage",
                "handleButtonClick",
                `${message}`
              );
            }
            break;
          default:
            break;
        }
      }
    );

    return () => unsubscribe?.();
  }, []);

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
          loading: { duration: 3000 },
        }}
      />
      <ButtonUp />
    </div>
  );
};
