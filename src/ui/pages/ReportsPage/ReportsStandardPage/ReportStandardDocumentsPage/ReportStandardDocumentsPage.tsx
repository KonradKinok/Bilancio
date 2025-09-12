import { useState } from "react";
import { useMainDataContext } from "../../../../components/Context/useMainDataContext";
import scss from "./ReportStandardDocumentsPage.module.scss";

const ReportStandardDocumentsPage: React.FC = () => {
  const { options } = useMainDataContext();

  return (
    <div className={scss["reportStandardDocumentsPage-main-container"]}>
      <p>ReportStandardDocumentsPage</p>
    </div>
  );
};
export default ReportStandardDocumentsPage;
