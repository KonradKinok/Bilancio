import { Suspense } from "react";
import { NavLink, Outlet } from "react-router-dom";
import scss from "./DocumentsPage.module.scss";

const DocumentsPage: React.FC = () => {
  // const { data: dataAllInvoices } = useAllInvoices();
  // console.log("ReportDataPage data", dataAllInvoices);
  return (
    <div className={scss[""]}>
      DocumentsPage
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
    </div>
  );
};

export default DocumentsPage;
