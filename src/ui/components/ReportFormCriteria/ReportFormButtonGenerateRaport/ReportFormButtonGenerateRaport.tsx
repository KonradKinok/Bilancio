import scss from "./ReportFormButtonGenerateRaport.module.scss";
import { use, useEffect, useState } from "react";

interface ReportFormButtonGenerateRaportProps {
  reportCriteria: ReportCriteria[];
  handleButtonClick: () => void;
}

export const ReportFormButtonGenerateRaport: React.FC<
  ReportFormButtonGenerateRaportProps
> = ({ reportCriteria, handleButtonClick }) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    const hasErrors = reportCriteria.some(
      (criteria) => criteria.errorMesage !== ""
    );
    const allCheckboxUnchecked = !reportCriteria.some(
      (criteria) => criteria.checkbox.checked == true
    );
    setButtonDisabled(hasErrors || allCheckboxUnchecked);
  }, [reportCriteria]);

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
