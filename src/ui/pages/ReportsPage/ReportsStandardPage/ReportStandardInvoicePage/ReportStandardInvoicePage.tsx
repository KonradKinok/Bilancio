import { useState } from "react";
import { useMainDataContext } from "../../../../components/Context/useMainDataContext";
import { ReportFormCriteria } from "../../../../components/ReportFormCriteria/ReportFormCriteria";
import * as DataBaseTables from "../../../../../electron/dataBase/enum";
import scss from "./ReportStandardInvoicePage.module.scss";
import { useReportStandardInvoices } from "../../../../hooks/useReportStandardInvoices";
import { STATUS } from "../../../../../electron/sharedTypes/status";
import { displayErrorMessage } from "../../../../components/GlobalFunctions/GlobalFunctions";
import toast from "react-hot-toast";

const reportCriteriaArray: ReportCriteria[] = [
  {
    id: DataBaseTables.InvoicesTable.ReceiptDate,
    description: "Data wystawienia faktury",
    checkbox: { checked: true, name: "receiptDateCheckbox" },
    firstDtp: {
      dtpDate: new Date(Date.UTC(new Date().getFullYear(), 0, 1)),
      dtpLabelText: "od",
      dtpName: "receiptFirstDate",
    },
    secondDtp: {
      dtpDate: new Date(Date.UTC(new Date().getFullYear(), 11, 31)),
      dtpLabelText: "do",
      dtpName: "receiptLastDate",
    },
    errorMesage: "",
  },
  {
    id: DataBaseTables.InvoicesTable.DeadlineDate,
    description: "Termin płatności",
    checkbox: { checked: true, name: "deadlineDateCheckbox" },
    firstDtp: {
      dtpDate: new Date(Date.UTC(new Date().getFullYear(), 0, 1)),
      dtpLabelText: "od",
      dtpName: "deadlineFirstDate",
    },
    secondDtp: {
      dtpDate: new Date(Date.UTC(new Date().getFullYear(), 11, 31)),
      dtpLabelText: "do",
      dtpName: "deadlineLastDate",
    },
    errorMesage: "",
  },
  {
    id: DataBaseTables.InvoicesTable.PaymentDate,
    description: "Data płatności",
    checkbox: { checked: true, name: "paymentDateCheckbox" },
    firstDtp: {
      dtpDate: new Date(Date.UTC(new Date().getFullYear(), 0, 1)),
      dtpLabelText: "od",
      dtpName: "paymentFirstDate",
    },
    secondDtp: {
      dtpDate: new Date(Date.UTC(new Date().getFullYear(), 11, 31)),
      dtpLabelText: "do",
      dtpName: "paymentLastDate",
    },
    errorMesage: "",
  },
];

const ReportStandardInvoicePage: React.FC = () => {
  const { options } = useMainDataContext();
  const [reportCriteria, setReportCriteria] = useState(reportCriteriaArray);
  const [reportCriteriaToDb, setreportCriteriaToDb] = useState<
    ReportCriteriaToDb[]
  >([]);

  const { data, loading, error, getReportStandardInvoices } =
    useReportStandardInvoices();

  //Wygenerowanie raportu
  const handleButtonClick = async () => {
    const filteredCriteria: ReportCriteriaToDb[] = reportCriteria
      .filter(
        (criteria) =>
          criteria.checkbox.checked &&
          criteria.firstDtp.dtpDate !== null &&
          criteria.secondDtp.dtpDate !== null
      )
      .map((criteria) => ({
        name: criteria.id,
        firstDate: criteria.firstDtp.dtpDate as Date,
        secondDate: criteria.secondDtp.dtpDate as Date,
      }));
    setreportCriteriaToDb(filteredCriteria);
    const successText = `Raport został pomyślnie wygenerowany.`;
    const errorText = `Nie udało się wygenerować raportu.`;

    try {
      const result = await getReportStandardInvoices(filteredCriteria);
      if (result.status === STATUS.Success) {
        toast.success(`${successText} (${result.data.length} rekordów)`);
      } else {
        displayErrorMessage(
          "ReportStandardInvoicePage",
          "handleButtonClick",
          `${errorText} ${result.message}`
        );
      }
    } catch (err) {
      displayErrorMessage(
        "ReportStandardInvoicePage",
        "handleButtonClick",
        err
      );
    }
  };
  return (
    <div className={`${scss["reportStandardInvoicePage-main-container"]}`}>
      <div
        className={`${scss["container"]} ${
          scss[`${options.fontSize.en}-font`]
        }`}
      >
        <div className={scss["report-criteria-container"]}>
          <ReportFormCriteria
            reportCriteria={reportCriteria}
            setReportCriteria={setReportCriteria}
            handleButtonClick={handleButtonClick}
          />
        </div>
      </div>
      <div>{JSON.stringify(reportCriteria)}</div>
      <div>
        <p>{JSON.stringify(reportCriteriaToDb)}</p>
      </div>
    </div>
  );
};
export default ReportStandardInvoicePage;
