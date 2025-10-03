import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useMainDataContext } from "../../../../components/Context/useMainDataContext";
import { useReportStandardInvoices } from "../../../../hooks/hooksReports/useReportStandardInvoices";
import { useExportStandardInvoiceReportToXLSX } from "../../../../hooks/hooksReports/useExportStandardInvoiceReportToXLSX";
import { STATUS } from "../../../../../electron/sharedTypes/status";
import * as DataBaseTables from "../../../../../electron/dataBase/enum";
import {
  copyTableToClipboard,
  displayErrorMessage,
  pluralizePozycja,
} from "../../../../components/GlobalFunctions/GlobalFunctions";
import { Loader } from "../../../../components/Loader/Loader";
import { IconInfo } from "../../../../components/IconInfo/IconInfo";
import { ReportFormCriteria } from "../../../../components/ReportFormCriteria/ReportFormCriteria";
import { TableReportStandardInvoice } from "../../../../components/TableReportStandardInvoice/TableReportStandardInvoice";
import { ReportConditionsFulfilled } from "../../../../components/ReportConditionsFulfilled/ReportConditionsFulfilled";
import { ButtonsExportData } from "../../../../components/ButtonsExportData/ButtonsExportData";
import scss from "./ReportStandardDocumentsPage.module.scss";
import { useAllDocumentsName } from "../../../../hooks/useAllDocumentName";

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
    errorMessage: "",
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
    errorMessage: "",
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
    errorMessage: "",
  },
];

const ReportStandardDocumentsPage: React.FC = () => {
  const tableRef = useRef<HTMLTableElement>(null);
  const { options } = useMainDataContext();
  const [reportCriteria, setReportCriteria] = useState(
    () => reportCriteriaArray
  );
  const [reportDocumentsCriteria, setReportDocumentsCriteria] = useState<
    ReportCriteriaAllDocuments[] | undefined
  >(undefined);
  const [reportCriteriaToDb, setReportCriteriaToDb] = useState<
    ReportCriteriaToDb[]
  >([]);
  const [isReportGenerating, setIsReportGenerating] = useState(false);

  const {
    data: dataAllDocumentsName,
    loading: loadingDataAllDocumentsName,
    getAllDocuments,
  } = useAllDocumentsName();

  //Hook do generowania raportu
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

  //Kryteria dokumentów
  // const documentsNameCriteria = useMemo(() => {
  //   if (dataAllDocumentsName)
  //     return transformationAllDocumentsName(dataAllDocumentsName);
  // }, [dataAllDocumentsName]);

  useEffect(() => {
    if (dataAllDocumentsName) {
      const data = transformationAllDocumentsName(dataAllDocumentsName);
      setReportDocumentsCriteria(data);
    }
  }, [dataAllDocumentsName]);

  //Obliczanie sumy kwoty wszystkich faktur z raportu
  const totalPriceAllInvoices = useMemo(() => {
    if (!dataReportStandardInvoices) return 0;
    return dataReportStandardInvoices.reduce((sum, doc) => {
      const total = parseFloat(doc.TotalAmount?.toString() || "0");
      return sum + total;
    }, 0);
  }, [dataReportStandardInvoices]);

  useEffect(() => {
    clearReport();
    setReportCriteriaToDb([]);
  }, [clearReport, reportCriteria]);

  //Wygenerowanie danych do raportu
  const handleGenerateReportButtonClick = async () => {
    const filteredCriteria: ReportCriteriaToDb[] = reportCriteria
      .filter((criteria) => criteria.checkbox.checked)
      .map((criteria) => ({
        name: criteria.id,
        description: criteria.description,
        firstDate: criteria.firstDtp.dtpDate,
        secondDate: criteria.secondDtp.dtpDate,
      }));
    setReportCriteriaToDb(filteredCriteria);
    const successText = `Raport został pomyślnie wygenerowany.`;
    const errorText = `Nie udało się wygenerować raportu.`;

    try {
      setIsReportGenerating(true);
      const result = await getReportStandardInvoices(filteredCriteria);
      if (result.status === STATUS.Success) {
        toast.success(
          `${successText} (${pluralizePozycja(result.data.length)})`
        );
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
      setIsReportGenerating(false);
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
        setIsReportGenerating(true);
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
        setIsReportGenerating(false);
      }
    }
  };

  return (
    <div className={`${scss["reportStandardDocumentsPage-main-container"]}`}>
      <IconInfo
        tooltipId="tooltip-formAddInvoice"
        tooltipInfoTextHtml={tooltipReportStandardInvoicePage()}
      />
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
            isRaportGenerating={isReportGenerating}
            documentsNameCriteria={reportDocumentsCriteria}
          />
        </div>
        <div>
          <pre>{JSON.stringify(reportDocumentsCriteria, null, 2)}</pre>
        </div>
      </div>

      {loadingReportStandardInvoices && isReportGenerating ? (
        <Loader />
      ) : (
        <>
          {dataReportStandardInvoices &&
            dataReportStandardInvoices.length > 0 && (
              <ButtonsExportData
                handleExportButtonClick={handleExportButtonClick}
                isRaportGenerating={isReportGenerating}
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

function tooltipReportStandardInvoicePage() {
  const text = `📈 Formularz raportu.
  Pole wyboru (checkbox) umożliwia włączenie lub wyłączenie danego kryterium.
  Jeżeli pole wyboru nie jest zaznaczone, pola dat pozostają nieaktywne i nie są brane pod uwagę w raporcie.
  Pole "Data wystawienia faktury" umożliwia wybranie daty wystawienia faktury.
  Pole "Termin płatności" umożliwia wybranie daty terminu płatności za fakturę
  Pole "Data płatności" umożliwiają wybór daty płatności za fakturę.
  Pole kalendarza daty początkowej umożliwia wybranie daty rozpoczęcia zakresu.
  Pole kalendarza daty końcowej umożliwia wybranie daty zakończenia zakresu.
  W przypadku usunięcia daty w którymkolwiek z pól, jako kryterium zostanie uznany brak daty w tym polu.
  ⛔ Data początkowa nie może być późniejsza niż data końcowa.
  ⚠️ Jeżeli w jednym z pól kalendarza zostanie usunięta data, w drugim polu również musi zostać usunięta.`;
  return text.replace(/\n/g, "<br/>");
}

function transformationAllDocumentsName(
  dataAllDocumentsName: AllDocumentsName[]
) {
  const grouped = new Map<string, ReportCriteriaAllDocuments>();
  // Tworzymy tylko jeden root "Dokumenty"
  grouped.set("Dokumenty", {
    id: "0",
    name: "Dokumenty",
    checkbox: { checked: true, name: "0" },
    documents: [],
  });

  const root = grouped.get("Dokumenty")!;

  for (const document of dataAllDocumentsName) {
    //IDs
    const documentId = `${document.DocumentId}`;
    const mainTypeId = `${documentId}-${document.MainTypeId ?? ""}`;
    const typeId = `${mainTypeId}-${document.TypeId ?? ""}`;
    const subtypeId = `${typeId}-${document.SubtypeId ?? ""}`;
    // --- Level 1: DocumentName
    // Szukamy dokumentu w root.document (czy już istnieje)
    let documentGroup = root.documents.find((d) => d.documentId === documentId);
    if (!documentGroup) {
      documentGroup = {
        documentId: document.DocumentId.toString(),
        documentName: document.DocumentName,
        checkbox: { checked: true, name: document.DocumentId.toString() },
        mainTypes: [],
      };
      root.documents.push(documentGroup);
    }

    // --- Level 2: MainTypeName
    if (document.MainTypeName) {
      let mainType = documentGroup.mainTypes.find(
        (mt) => mt.mainTypeName === document.MainTypeName
      );
      if (!mainType) {
        mainType = {
          mainTypeId: mainTypeId,
          mainTypeName: document.MainTypeName,
          checkbox: { checked: true, name: mainTypeId },
          types: [],
        };
        documentGroup.mainTypes.push(mainType);
      }

      // --- Level 3: TypeName
      if (document.TypeName) {
        let type = mainType.types.find((t) => t.typeName === document.TypeName);
        if (!type) {
          type = {
            typeId: typeId,
            typeName: document.TypeName,
            checkbox: { checked: true, name: typeId },
            subtypes: [],
          };
          mainType.types.push(type);
        }

        // --- Level 4: SubtypeName
        if (document.SubtypeName) {
          if (
            !type.subtypes.find((s) => s.subtypeName === document.SubtypeName)
          ) {
            type.subtypes.push({
              subtypeId: subtypeId,
              subtypeName: document.SubtypeName,
              checkbox: { checked: false, name: subtypeId },
            });
          }
        }
      }
    }
  }
  console.log("transformationAllDocumentsName", [...grouped.values()]);
  return [...grouped.values()];
}
