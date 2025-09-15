import { useState } from "react";
import { useMainDataContext } from "../../../../components/Context/useMainDataContext";
import { ReportFormCriteria } from "../../../../components/ReportFormCriteria/ReportFormCriteria";
import scss from "./ReportStandardInvoicePage.module.scss";

const reportCriteriaArray: ReportCriteria[] = [
  {
    id: "receiptDate",
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
    id: "deadlineDate",
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
];

const ReportStandardInvoicePage: React.FC = () => {
  const { options } = useMainDataContext();
  const [reportCriteria, setReportCriteria] = useState(reportCriteriaArray);

  const handleSingleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentValue = event.target.value;
    const currentName = event.target.name;
    let errorTextInput = "";

    if (currentName === "invoiceName") {
      // setInputInvoiceName(currentValue);
      // setAddInvoiceData((prev) => ({
      //   ...prev,
      //   invoice: { ...prev.invoice, InvoiceName: currentValue },
      // }));
      if (!currentValue) {
        errorTextInput = "Musisz wypełnić to pole";
      }
      // setInputInvoiceNameError(errorTextInput);
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
          />
        </div>
      </div>
      <div>{JSON.stringify(reportCriteria)}</div>
    </div>
  );
};
export default ReportStandardInvoicePage;
