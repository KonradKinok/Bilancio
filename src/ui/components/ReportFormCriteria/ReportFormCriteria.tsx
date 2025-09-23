import { ReportFormDateTimePickers } from "./ReportFormDateTimePickers/ReportFormDateTimePickers";
import scss from "./ReportFormCriteria.module.scss";
import { use, useEffect, useState } from "react";
import { ReportFormButtonGenerateRaport } from "./ReportFormButtonGenerateRaport/ReportFormButtonGenerateRaport";

interface ReportFormCriteriaProps {
  reportCriteria: ReportCriteria[];
  setReportCriteria: React.Dispatch<React.SetStateAction<ReportCriteria[]>>;
  handleButtonClick: () => void;
  isRaportGenerating: boolean;
}

export const ReportFormCriteria: React.FC<ReportFormCriteriaProps> = ({
  reportCriteria,
  setReportCriteria,
  handleButtonClick,
  isRaportGenerating,
}) => {
  const onButtonClick = () => {
    handleButtonClick();
  };

  return (
    <form
      action=""
      className={`${scss["reportFormCriteria-main-container"]} ${
        isRaportGenerating ? scss["form-disabled"] : ""
      }`}
    >
      <div className={`${scss["reportFormCriteria-container"]} `}>
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
      <ReportFormButtonGenerateRaport
        reportCriteria={reportCriteria}
        handleButtonClick={onButtonClick}
      />
    </form>
  );
};
