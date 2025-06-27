import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { format } from "date-fns";
import { useMainDataContext } from "../../components/Context/useOptionsImage";
import { MainTable } from "../../components/MainTable/MainTable";
import { DateTimePicker } from "../../components/DateTimePicker/DateTimePicker";
import { FormHomeDate } from "../../components/FormHomeDate/FormHomeDate";
import scss from "./HomePage.module.scss";
import { useAllInvoices } from "../../hooks/useAllInvoices";

const HomePage: React.FC = () => {
  const { formValuesHomePage, setFormValuesHomePage } = useMainDataContext();
  const { data: dataAllInvoices, refetch: refetchAllInvoices } =
    useAllInvoices(formValuesHomePage);
  return (
    <div className={scss["homepage-main-container"]}>
      <FormHomeDate
        formValuesHomePage={formValuesHomePage}
        setFormValuesHomePage={setFormValuesHomePage}
        dataAllInvoices={dataAllInvoices}
        refetchAllInvoices={refetchAllInvoices}
      />
      <MainTable
        formValuesHomePage={formValuesHomePage}
        setFormValuesHomePage={setFormValuesHomePage}
        dataAllInvoices={dataAllInvoices}
        refetchAllInvoices={refetchAllInvoices}
      />
    </div>
  );
};

export default HomePage;
