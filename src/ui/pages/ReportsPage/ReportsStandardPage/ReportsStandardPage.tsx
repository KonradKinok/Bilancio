import { useState } from "react";
import { useMainDataContext } from "../../../components/Context/useMainDataContext";
import scss from "./ReportsStandardPage.module.scss";

const ReportsStandardPage: React.FC = () => {
  const { options } = useMainDataContext();

  return (
    <div className={scss["reportsStandardPage-main-container"]}>
      <p>ReportsStandardPage</p>
    </div>
  );
};
export default ReportsStandardPage;
