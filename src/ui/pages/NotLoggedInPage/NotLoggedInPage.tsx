import { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAllInvoices } from "../../hooks/useAllInvoices";
import { useMainDataContext } from "../../components/Context/useMainDataContext";

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
    <div>
      <h1>NotLoggedInPage</h1>
      <button onClick={handleRefresh}>Refresh page</button>
      <button onClick={handleRestart}>Restart app</button>
    </div>
  );
};

export default NotLoggedInPage;
