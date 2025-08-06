import { useEffect, useState } from "react";
import { useAllInvoices } from "../../hooks/useAllInvoices";
import { MainTable } from "../../components/MainTable/MainTable";
import { FormHomeDate } from "../../components/FormHomeDate/FormHomeDate";
import scss from "./HomePage.module.scss";
import { useMainDataContext } from "../../components/Context/useMainDataContext";

const HomePage: React.FC = () => {
  const { page, setPage, formValuesHomePage, setFormValuesHomePage } =
    useMainDataContext();
  // useState<FormValuesHomePage>({
  //   // firstDate: new Date(Date.UTC(new Date().getFullYear(), 0, 1)),
  //   firstDate: new Date(Date.UTC(2010, 0, 1)),
  //   secondDate: new Date(Date.UTC(new Date().getFullYear(), 11, 31)),
  //   isDeleted: 0,
  // });
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  // const [page, setPage] = useState<number>(1);
  useEffect(() => {
    console.log("HomePage mounted, page:");
    return () => {
      console.log("HomePage unmounted");
    };
  }, [page]);
  // Używamy hooka useAllInvoices z paginacją
  const {
    data: dataAllInvoices,
    totalCount,
    refetch: refetchAllInvoices,
  } = useAllInvoices(formValuesHomePage, page, rowsPerPage);

  return (
    <div className={scss["homepage-main-container"]}>
      <FormHomeDate
        formValuesHomePage={formValuesHomePage}
        setFormValuesHomePage={setFormValuesHomePage}
        refetchAllInvoices={refetchAllInvoices}
      />
      <MainTable
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
