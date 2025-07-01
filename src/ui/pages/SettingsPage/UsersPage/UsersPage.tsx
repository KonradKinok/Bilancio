import { Suspense } from "react";
import { NavLink, Outlet } from "react-router-dom";
import scss from "./UsersPage.module.scss";

const UsersPage: React.FC = () => {
  // const { data: dataAllInvoices } = useAllInvoices();
  // console.log("ReportDataPage data", dataAllInvoices);
  return (
    <div className={scss[""]}>
      UsersPage
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
    </div>
  );
};

export default UsersPage;
