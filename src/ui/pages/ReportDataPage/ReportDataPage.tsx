import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { useAllInvoices } from "../../hooks/useAllInvoices";

const ReportDataPage: React.FC = () => {
  const { data: dataAllInvoices } = useAllInvoices();
  console.log("ReportDataPage data", dataAllInvoices);
  return (
    <div>
      <h1>ReportDataPage</h1>

      {/* <Toaster position="top-right" reverseOrder={false} /> */}
    </div>
  );
};

export default ReportDataPage;
