import { useMainDataContext } from "../../../../components/Context/useMainDataContext";
import scss from "./ReportStandardInvoicePage.module.scss";

const ReportStandardInvoicePage: React.FC = () => {
  const { options } = useMainDataContext();

  return (
    <div className={`${scss["reportStandardInvoicePage-main-container"]}`}>
      <p>ReportStandardInvoicePage</p>
      <div className={scss["path-container"]}>
        <p className={`${scss["path"]} `}>config.dbPath</p>
      </div>
    </div>
  );
};
export default ReportStandardInvoicePage;
