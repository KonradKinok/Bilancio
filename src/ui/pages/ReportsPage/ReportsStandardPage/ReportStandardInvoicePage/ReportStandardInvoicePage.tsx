import { useEffect, useState } from "react";
import { useMainDataContext } from "../../../../components/Context/useMainDataContext";
import { ReportFormCriteria } from "../../../../components/ReportFormCriteria/ReportFormCriteria";
import * as DataBaseTables from "../../../../../electron/dataBase/enum";
import scss from "./ReportStandardInvoicePage.module.scss";
import { useReportStandardInvoices } from "../../../../hooks/useReportStandardInvoices";
import { STATUS } from "../../../../../electron/sharedTypes/status";
import {
  displayErrorMessage,
  formatDocumentDetailsFunction,
  pluralizePozycja,
} from "../../../../components/GlobalFunctions/GlobalFunctions";
import toast from "react-hot-toast";
import { useAllDocumentsName } from "../../../../hooks/useAllDocumentName";
import { TableReportStandardInvoice } from "../../../../components/TableReportStandardInvoice/TableReportStandardInvoice";
import { Loader } from "../../../../components/Loader/Loader";
import { ReportConditionsFulfilled } from "../../../../components/ReportConditionsFulfilled/ReportConditionsFulfilled";
import { ButtonsExportData } from "../../../../components/ButtonsExportData/ButtonsExportData";
import { useExportStandardInvoiceReportToPDF } from "../../../../hooks/hooksReports/useExportStandardInvoiceReportToPDF";
import { useExportStandardInvoiceReportToXLSX } from "../../../../hooks/hooksReports/useExportStandardInvoiceReportToXLSX";

const reportCriteriaArray: ReportCriteria[] = [
  {
    id: DataBaseTables.InvoicesTable.ReceiptDate,
    description: "Data wystawienia faktury",
    checkbox: { checked: true, name: "receiptDateCheckbox" },
    firstDtp: {
      // dtpDate: new Date(Date.UTC(new Date().getFullYear(), 0, 1)),
      dtpDate: new Date(Date.UTC(new Date().getFullYear(), 8, 18)),
      dtpLabelText: "od",
      dtpName: "receiptFirstDate",
    },
    secondDtp: {
      // dtpDate: new Date(Date.UTC(new Date().getFullYear(), 11, 31)),
      dtpDate: new Date(Date.UTC(new Date().getFullYear(), 8, 18)),
      dtpLabelText: "do",
      dtpName: "receiptLastDate",
    },
    errorMesage: "",
  },
  {
    id: DataBaseTables.InvoicesTable.DeadlineDate,
    description: "Termin płatności",
    checkbox: { checked: false, name: "deadlineDateCheckbox" },
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
    checkbox: { checked: false, name: "paymentDateCheckbox" },
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
  const [reportCriteria, setReportCriteria] = useState(
    () => reportCriteriaArray
  );
  const [reportCriteriaToDb, setReportCriteriaToDb] = useState<
    ReportCriteriaToDb[]
  >([]);
  const [isRaportGenerating, setIsRaportGenerating] = useState(false);
  const {
    data: dataReportStandardInvoices,
    loading: loadingReportStandardInvoices,
    error: errorReportStandardInvoices,
    clearReport,
    getReportStandardInvoices,
  } = useReportStandardInvoices();

  //Hook do exportu raportu do PDF
  const {
    data: dataExportPdfReportStandardInvoices,
    loading: loadingExportPdfReportStandardInvoices,
    error: errorExportPdfReportStandardInvoices,
    exportPdfReportStandardInvoices,
  } = useExportStandardInvoiceReportToPDF();
  const {
    data: dataExportStandardInvoiceReportToXLSX,
    loading: loadingExportStandardInvoiceReportToXLSX,
    error: errorExportStandardInvoiceReportToXLSX,
    exportStandardInvoiceReportToXLSX,
  } = useExportStandardInvoiceReportToXLSX();
  //Wygenerowanie danych do raportu
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
        description: criteria.description,
        firstDate: criteria.firstDtp.dtpDate as Date,
        secondDate: criteria.secondDtp.dtpDate as Date,
      }));
    setReportCriteriaToDb(filteredCriteria);
    const successText = `Raport został pomyślnie wygenerowany.`;
    const errorText = `Nie udało się wygenerować raportu.`;

    try {
      setIsRaportGenerating(true);
      const result = await getReportStandardInvoices(filteredCriteria);
      if (result.status === STATUS.Success) {
        toast.success(
          `${successText} (${pluralizePozycja(result.data.length)})`
        );

        console.log("result", result);
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
    } finally {
      setIsRaportGenerating(false);
    }
  };

  //Wygenerowanie raportu
  const handleExportButtonClick = async () => {
    if (!dataReportStandardInvoices) {
      return;
    }
    const successText = `Eksport do PDF został pomyślnie wykonany.`;
    const errorText = `Nie udało się wykonać eksportu do PDF.`;
    try {
      setIsRaportGenerating(true);
      const result = await exportStandardInvoiceReportToXLSX(
        reportCriteriaToDb,
        dataReportStandardInvoices
      );
      if (result.status === 0) {
        toast.success(`${successText} `);

        console.log("result", result);
      } else {
        displayErrorMessage(
          "ReportStandardInvoicePage",
          "handleExportButtonClick",
          `${errorText} ${result.message}`
        );
      }
    } catch (err) {
      displayErrorMessage(
        "ReportStandardInvoicePage",
        "handleExportButtonClick",
        err
      );
    } finally {
      setIsRaportGenerating(false);
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
            isRaportGenerating={isRaportGenerating}
          />
        </div>
      </div>

      {loadingReportStandardInvoices && isRaportGenerating ? (
        <Loader />
      ) : (
        <>
          {dataReportStandardInvoices &&
            dataReportStandardInvoices.length > 0 && (
              <ButtonsExportData
                handleExportButtonClick={handleExportButtonClick}
              />
            )}
          <ReportConditionsFulfilled reportCriteriaToDb={reportCriteriaToDb} />
          <TableReportStandardInvoice
            dataReportStandardInvoices={dataReportStandardInvoices}
          />
        </>
      )}
    </div>
  );
};
export default ReportStandardInvoicePage;
