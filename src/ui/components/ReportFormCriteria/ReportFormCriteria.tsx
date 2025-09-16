import { ReportFormDateTimePickers } from "./ReportFormDateTimePickers/ReportFormDateTimePickers";
import scss from "./ReportFormCriteria.module.scss";

interface ReportFormCriteriaProps {
  reportCriteria: ReportCriteria[];
  setReportCriteria: React.Dispatch<React.SetStateAction<ReportCriteria[]>>;
}

export const ReportFormCriteria: React.FC<ReportFormCriteriaProps> = ({
  reportCriteria,
  setReportCriteria,
}) => {
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
        <button className={scss["button-generate-raport"]} onClick={() => {}}>
          Generuj raport
        </button>
      </div>
    </form>
  );
};
