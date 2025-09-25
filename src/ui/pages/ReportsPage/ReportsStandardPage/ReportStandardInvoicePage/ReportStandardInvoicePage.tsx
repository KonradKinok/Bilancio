import { useEffect, useRef, useState } from "react";
import { useMainDataContext } from "../../../../components/Context/useMainDataContext";
import { ReportFormCriteria } from "../../../../components/ReportFormCriteria/ReportFormCriteria";
import * as DataBaseTables from "../../../../../electron/dataBase/enum";
import scss from "./ReportStandardInvoicePage.module.scss";
import { useReportStandardInvoices } from "../../../../hooks/useReportStandardInvoices";
import { STATUS } from "../../../../../electron/sharedTypes/status";
import {
  displayErrorMessage,
  pluralizePozycja,
} from "../../../../components/GlobalFunctions/GlobalFunctions";
import toast from "react-hot-toast";
import { TableReportStandardInvoice } from "../../../../components/TableReportStandardInvoice/TableReportStandardInvoice";
import { Loader } from "../../../../components/Loader/Loader";
import { ReportConditionsFulfilled } from "../../../../components/ReportConditionsFulfilled/ReportConditionsFulfilled";
import { ButtonsExportData } from "../../../../components/ButtonsExportData/ButtonsExportData";

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
export default ReportStandardInvoicePage;

const copyTableToClipboard = (
  tableRef: React.RefObject<HTMLTableElement | null>
) => {
  try {
    if (tableRef.current) {
      // Klonujemy tabelę
      const tableClone = tableRef.current.cloneNode(true) as HTMLTableElement;

      // Dodanie obramowań
      tableClone.style.borderCollapse = "collapse";
      tableClone.querySelectorAll("th, td").forEach((cell) => {
        (cell as HTMLElement).style.border = "1px solid black";
        (cell as HTMLElement).style.padding = "4px"; // opcjonalnie padding
      });

      const htmlClean = tableClone.outerHTML;
      const textClean = tableClone.innerText;

      window.electron.clipboard(htmlClean, textClean);
      const successTextToast =
        "Tabela została skopiowana do schowka. Użyj skrótu Ctr+V żeby wkleić tabelę do pliku Word lub Excell";
      toast.success(`${successTextToast} `);
    }
  } catch (err) {
    const errorTextToast = "Błąd podczas kopiowania tabeli do schowka:";
    displayErrorMessage(
      "ReportStandardInvoicePage",
      "handleExportButtonClick",
      ` ${errorTextToast} ${err}`
    );
  }
};
