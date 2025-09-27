import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useMainDataContext } from "../../../../components/Context/useMainDataContext";
import { useReportStandardInvoices } from "../../../../hooks/useReportStandardInvoices";
import { useExportStandardInvoiceReportToXLSX } from "../../../../hooks/hooksReports/useExportStandardInvoiceReportToXLSX";
import { STATUS } from "../../../../../electron/sharedTypes/status";
import * as DataBaseTables from "../../../../../electron/dataBase/enum";
import {
  copyTableToClipboard,
  displayErrorMessage,
  pluralizePozycja,
} from "../../../../components/GlobalFunctions/GlobalFunctions";
import { Loader } from "../../../../components/Loader/Loader";
import { ReportFormCriteria } from "../../../../components/ReportFormCriteria/ReportFormCriteria";
import { TableReportStandardInvoice } from "../../../../components/TableReportStandardInvoice/TableReportStandardInvoice";
import { ReportConditionsFulfilled } from "../../../../components/ReportConditionsFulfilled/ReportConditionsFulfilled";
import { ButtonsExportData } from "../../../../components/ButtonsExportData/ButtonsExportData";
import scss from "./ReportStandardDocumentsPage.module.scss";

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

const ReportStandardDocumentsPage: React.FC = () => {
  const tableRef = useRef<HTMLTableElement>(null);
  const { options } = useMainDataContext();
  const [totalPriceAllInvoices, setTotalPriceAllInvoices] = useState(0);
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

  //Hook do exportu raportu do XLSX
  const {
    data: dataExportStandardInvoiceReportToXLSX,
    loading: loadingExportStandardInvoiceReportToXLSX,
    error: errorExportStandardInvoiceReportToXLSX,
    exportStandardInvoiceReportToXLSX,
  } = useExportStandardInvoiceReportToXLSX();

  useEffect(() => {
    if (dataReportStandardInvoices) {
      const totalAmount = dataReportStandardInvoices.reduce(
        (sum, doc) => sum + parseFloat(doc.TotalAmount.toString()),
        0
      );
      setTotalPriceAllInvoices(totalAmount);
    }
  }, [dataReportStandardInvoices]);

  useEffect(() => {
    clearReport();
    setReportCriteriaToDb([]);
  }, [clearReport, reportCriteria]);

  //Wygenerowanie danych do raportu
  const handleGenerateReportButtonClick = async () => {
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

  //Exportowanie raportu do schowka i do pliku XLSX
  const handleExportButtonClick = async (btnName: string) => {
    if (!dataReportStandardInvoices) {
      return;
    }
    if (btnName === "exportToSystemStorage" && tableRef.current) {
      copyTableToClipboard(tableRef);
      return;
    }
    if (btnName === "exportToXls") {
      const successText = `Eksport do XLSX został pomyślnie wykonany.`;
      const errorText = `Nie udało się wykonać eksportu do XLSX.`;
      try {
        setIsRaportGenerating(true);
        const result = await exportStandardInvoiceReportToXLSX(
          reportCriteriaToDb,
          dataReportStandardInvoices
        );
        if (result.status === 0) {
          toast.success(`${successText} `);
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
    }
  };

  return (
    <div className={`${scss["reportStandardDocumentsPage-main-container"]}`}>
      <div
        className={`${scss["container"]} ${
          scss[`${options.fontSize.en}-font`]
        }`}
      >
        <div className={scss["report-criteria-container"]}>
          <ReportFormCriteria
            reportCriteria={reportCriteria}
            setReportCriteria={setReportCriteria}
            handleButtonClick={handleGenerateReportButtonClick}
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
            ref={tableRef}
            dataReportStandardInvoices={dataReportStandardInvoices}
            totalPriceAllInvoices={totalPriceAllInvoices}
          />
        </>
      )}
    </div>
  );
};
export default ReportStandardDocumentsPage;
