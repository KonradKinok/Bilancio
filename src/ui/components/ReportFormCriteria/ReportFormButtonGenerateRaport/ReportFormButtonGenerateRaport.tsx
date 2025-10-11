import { useMemo } from "react";
import scss from "./ReportFormButtonGenerateRaport.module.scss";

interface ReportFormButtonGenerateRaportProps {
  reportCriteria: ReportCriteria[];
  handleButtonClick: () => void;
  reportDocumentsCriteria?: ReportCriteriaAllDocuments[] | undefined;
}

export const ReportFormButtonGenerateRaport = ({
  reportCriteria,
  handleButtonClick,
  reportDocumentsCriteria,
}: ReportFormButtonGenerateRaportProps) => {
  //Ustawianie buttonDisabled
  const buttonDisabled = useMemo(() => {
    const hasErrors = reportCriteria.some(
      (criteria) => criteria.errorMessage !== ""
    );
    const allCheckboxUnchecked = !reportCriteria.some(
      (criteria) => criteria.checkbox.checked
    );

    let allDocumentsUnchecked = false;
    if (reportDocumentsCriteria) {
      allDocumentsUnchecked = !reportDocumentsCriteria?.some(
        (doc) => doc.checkbox.checked
      );
    }

    return hasErrors || allCheckboxUnchecked || allDocumentsUnchecked;
  }, [reportCriteria, reportDocumentsCriteria]);

  //Handler onButtonClick
  const onButtonClick = () => {
    handleButtonClick();
  };

  return (
    <div className={scss["button-generate-raport-container"]}>
      <button
        type="button"
        className={scss["button-generate-raport"]}
        onClick={onButtonClick}
        disabled={buttonDisabled}
      >
        Generuj raport
      </button>
    </div>
  );
};
