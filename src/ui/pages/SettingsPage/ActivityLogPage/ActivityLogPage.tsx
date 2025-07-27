import { Suspense, useEffect, useState } from "react";
import { useAllDocumentsName } from "../../../hooks/useAllDocumentName";
import { createActivitiesObject } from "../../../components/GlobalFunctions/GlobalFunctions";
import { useStateManager } from "react-select";
import { useFormState } from "react-dom";
import scss from "./ActivityLog.module.scss";
import Pagination from "../../../components/Pagination/Pagination";
import { useAllActivityLog } from "../../../hooks/useAllActivityLog";
import { SeparateActivityLog } from "./SeparateActivityLog/SeparateActivityLog";
enum ActivityType {
  addInvoice = "dodanie faktury",
  editInvoice = "edycja faktury",
  deleteInvoice = "usunięcie faktury",
}

type UserActivitiesType = {
  date: string;
  userName: string;
  activityType: ActivityType;
  activityData: string;
};
type FormattedDetail = {
  documentName: string;
  mainTypeName: string;
  typeName: string;
  subtypeName: string;
  quantity: number;
  price: string;
  total: string;
};
const UserActivities: UserActivitiesType = {
  date: "2025-07-22T11:30",
  userName: "Konrad",
  activityType: ActivityType.addInvoice,
  activityData: "",
};
const addedInvoice = {
  InvoiceName: "FV/0713",
  ReceiptDate: "2025-07-14",
  DeadlineDate: null,
  PaymentDate: null,
  IsDeleted: 0,
} as InvoiceTable;

const invoiceDetails = [
  {
    DocumentId: 3,
    MainTypeId: 1,
    TypeId: 1,
    SubtypeId: 1,
    Quantity: 1,
    Price: 3111,
    isMainTypeRequired: true,
    isTypeRequired: true,
    isSubtypeRequired: true,
  },
  {
    DocumentId: 1,
    MainTypeId: null,
    TypeId: null,
    SubtypeId: null,
    Quantity: 2,
    Price: 10,
    isMainTypeRequired: false,
    isTypeRequired: false,
    isSubtypeRequired: false,
  },
  {
    DocumentId: 4,
    MainTypeId: null,
    TypeId: null,
    SubtypeId: null,
    Quantity: 3,
    Price: 40,
    isMainTypeRequired: false,
    isTypeRequired: false,
    isSubtypeRequired: false,
  },
];
export const ActivityLogPage: React.FC = () => {
  const {
    data: dataAllActivityLog,
    totalCount,
    loading,
    error,
    getAllActivityLog,
  } = useAllActivityLog();

  const allDocumentsData = useAllDocumentsName();
  const {
    data: dataAllDocumentsName,
    loading: loadingAllDocumentsName,
    error: errorAllDocumentsName,
  } = allDocumentsData;
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<PageState>({
    paginationPage: 1,
    firstPage: 1,
    lastPage: 2,
  });
  useEffect(() => {
    try {
      const activitiesObjectData = createActivitiesObject(
        dataAllDocumentsName,
        "Konrad",
        ActivityType.addInvoice,
        addedInvoice,
        invoiceDetails
      );
      console.log({ activitiesObjectData });
    } catch (error) {
      console.error("Error creating activities object:", error);
    }
  }, [dataAllDocumentsName]);

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage((prev) => ({ ...prev, paginationPage: 1 })); // Resetuj stronę do 1 po zmianie liczby wierszy
  };

  // Obsługa zmiany strony
  const onPageChange = (newPage: number) => {
    setPage((prev) => ({
      ...prev,
      paginationPage: newPage,
      firstPage: 2 * newPage - 1,
      lastPage: 2 * newPage,
    }));
  };
  // Obliczanie liczby stron
  const totalPages = Math.ceil(totalCount / rowsPerPage);
  // console.log("ReportDataPage data", dataAllInvoices);
  return (
    <div className={scss["activities-log-page-main-container"]}>
      <div>
        <table className={scss["table"]}>
          <thead>
            <tr>
              <th>Lp.</th>
              <th>Data</th>
              <th>Użytkownik</th>
              <th>Typ zmiany</th>
              <th>Czynności</th>
            </tr>
          </thead>
          <tbody>
            {dataAllActivityLog &&
              dataAllActivityLog.length > 0 &&
              dataAllActivityLog.map((activity, index) => {
                return (
                  <SeparateActivityLog
                    key={activity.ActivityLogId}
                    index={index}
                    activity={activity}
                  />
                );
              })}
          </tbody>
        </table>
        <div className={scss["maintable-footer-container"]}>
          <div className={scss["maintable-controls-container"]}>
            <div className={scss["controls"]}>
              <label className={scss["label"]} htmlFor="rowsPerPage">
                Wiersze na stronę:{" "}
              </label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className={scss["select"]}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className={scss["total-invoices"]}>
              <p>Liczba aktywności: {totalCount}</p>
            </div>
          </div>

          <Pagination
            className={scss.pagination}
            currentPage={page.paginationPage}
            totalCount={totalPages}
            onPageChange={(page) => onPageChange(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLogPage;
