import { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAllInvoices } from "../../hooks/useAllInvoices";
import { useMainDataContext } from "../../components/Context/useMainDataContext";
import scss from "./NotLoggedInPage.module.scss";
import { Footer } from "../../components/Footer/Footer";
const NotLoggedInPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Użyj hooka useNavigate
  const { auth } = useMainDataContext();
  const handleRefresh = () => {
    // Wysyła sygnał do głównego procesu Electron, aby odświeżyć okno
    window.electron.reloadWindow();
  };
  const handleRestart = () => {
    // Wysyła sygnał do głównego procesu Electron, aby zrestartować aplikację
    window.electron.restartApp();
  };
  // Sprawdzenie, czy strona jest załadowana z innej strony
  useEffect(() => {
    console.log("NotLoggedInPage location.pathname:", location.pathname);
    console.log("NotLoggedInPage location:", { location });
  }, [location]);

  // const { data: dataAllInvoices } = useAllInvoices();
  // console.log("ReportDataPage data", dataAllInvoices);
  return (
    <div className={scss["notLoggedInPage-main-container"]}>
      <div className={scss["notLoggedInPage-header"]}>
        <div className={scss["container-gold-text"]}>
          <p className={scss["gold-text"]}>Bilancio</p>
        </div>
      </div>
      <div className={scss["notLoggedInPage-container"]}>
        <div className={scss["notLoggedInPage-text-content"]}>
          <p>Nie jesteś zalogowany.</p>
          <p>Zamknij program</p>
          <p>i skontaktuj się z administratorem.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotLoggedInPage;
