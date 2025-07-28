import { useState } from "react";
import { MainTable } from "../../components/MainTable/MainTable";
import { FormHomeDate } from "../../components/FormHomeDate/FormHomeDate";
import scss from "./HomePage.module.scss";
import { useAllInvoices } from "../../hooks/useAllInvoices";

const HomePage: React.FC = () => {
  const [formValuesHomePage, setFormValuesHomePage] =
    useState<FormValuesHomePage>({
      // firstDate: new Date(Date.UTC(new Date().getFullYear(), 0, 1)),
      firstDate: new Date(Date.UTC(2010, 0, 1)),
      secondDate: new Date(Date.UTC(new Date().getFullYear(), 11, 31)),
      isDeleted: 0,
    });
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
