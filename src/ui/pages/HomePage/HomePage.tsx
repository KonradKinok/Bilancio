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
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<PageState>({
    paginationPage: 1,
    firstPage: 1,
    lastPage: 2,
  });
  // Używamy hooka useAllInvoices z paginacją
  const {
    data: dataAllInvoices,
    totalCount,
    loading,
    error,
    refetch: refetchAllInvoices,
  } = useAllInvoices(formValuesHomePage, page.paginationPage, rowsPerPage);
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
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        page={page}
        setPage={setPage}
        totalCount={totalCount}
      />
    </div>
  );
};

export default HomePage;
