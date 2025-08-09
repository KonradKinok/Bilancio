import { useAllInvoices } from "../../hooks/useAllInvoices";
import { useMainDataContext } from "../../components/Context/useMainDataContext";
import { MainTable } from "../../components/MainTable/MainTable";
import { FormHomeDate } from "../../components/FormHomeDate/FormHomeDate";
import { ConditionalWrapper } from "../../components/ConditionalWrapper/ConditionalWrapper";
import scss from "./HomePage.module.scss";

const HomePage: React.FC = () => {
  const {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    formValuesHomePage,
    setFormValuesHomePage,
  } = useMainDataContext();

  // Hooka useAllInvoices z paginacją
  const {
    data: dataAllInvoices,
    loading: loadingDataAllInvoices,
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
      <ConditionalWrapper isLoading={loadingDataAllInvoices}>
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
      </ConditionalWrapper>
    </div>
  );
};

export default HomePage;
