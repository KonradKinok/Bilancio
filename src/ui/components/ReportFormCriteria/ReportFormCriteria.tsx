import { ReportFormDateTimePickers } from "./ReportFormDateTimePickers/ReportFormDateTimePickers";
import scss from "./ReportFormCriteria.module.scss";
import { use, useEffect, useState } from "react";

interface ReportFormCriteriaProps {
  reportCriteria: ReportCriteria[];
  setReportCriteria: React.Dispatch<React.SetStateAction<ReportCriteria[]>>;
  handleButtonClick: () => void;
}

export const ReportFormCriteria: React.FC<ReportFormCriteriaProps> = ({
  reportCriteria,
  setReportCriteria,
  handleButtonClick,
}) => {
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
    <form action="" className={scss["reportFormCriteria-main-container"]}>
      <div className={scss["reportFormCriteria-container"]}>
        {reportCriteria &&
          reportCriteria.length > 0 &&
          reportCriteria.map((item) => (
            <ReportFormDateTimePickers
              key={item.id}
              reportCriteria={item}
              setReportCriteria={setReportCriteria}
            />
          ))}
      </div>
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
    </form>
  );
};
