import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAllInvoices } from "../../hooks/useAllInvoices";

const ReportDataPage: React.FC = () => {
  const location = useLocation();

  // Sprawdzenie, czy strona jest załadowana z innej strony
  useEffect(() => {
    console.log("ReportDataPage location.pathname:", location.pathname);
    console.log("ReportDataPage location:", { location });
  }, [location]);
  // const { data: dataAllInvoices } = useAllInvoices();
  // console.log("ReportDataPage data", dataAllInvoices);
  return (
    <div>
      <h1>ReportDataPage</h1>

      {/* <Toaster position="top-right" reverseOrder={false} /> */}
    </div>
  );
};

export default ReportDataPage;
