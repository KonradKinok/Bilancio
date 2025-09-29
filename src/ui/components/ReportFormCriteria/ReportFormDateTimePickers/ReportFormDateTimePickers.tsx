import scss from "./ReportFormDateTimePickers.module.scss";
import { DateTimePicker } from "../../DateTimePicker/DateTimePicker";
import { useEffect, useState } from "react";
import { CheckboxRegular } from "../../CheckboxRegular/CheckboxRegular";
import { Tooltip } from "react-tooltip";

interface ReportFormDateTimePickersProps {
  reportCriteria: ReportCriteria;
  setReportCriteria: React.Dispatch<React.SetStateAction<ReportCriteria[]>>;
}

export const ReportFormDateTimePickers: React.FC<
  ReportFormDateTimePickersProps
> = ({ reportCriteria, setReportCriteria }) => {
  // Destrukturyzacja obiektu reportCriteria w celu uzyskania indywidualnych kryteriów
  const { id, checkbox, firstDtp, secondDtp, description, errorMessage } =
    reportCriteria;

  // Lokalne stany dla komponentów DateTimePicker
  const [dateTimePickerFirstDate, setDateTimePickerFirstDate] =
    useState<Date | null>(firstDtp.dtpDate);
  const [dateTimePickerLastDate, setDateTimePickerLastDate] =
    useState<Date | null>(secondDtp.dtpDate);
  const [checked, setChecked] = useState(checkbox.checked);

  useEffect(() => {
    // if (!dateTimePickerFirstDate || !dateTimePickerLastDate) return;
    let errorMessage = "";
    if (
      dateTimePickerFirstDate &&
      dateTimePickerLastDate &&
      dateTimePickerFirstDate > dateTimePickerLastDate &&
      checked
    ) {
      errorMessage =
        "Data początkowa nie może być późniejsza niż data końcowa.";
    } else if (!dateTimePickerFirstDate && dateTimePickerLastDate && checked) {
      errorMessage =
        "Data początkowa nie może być pusta jeżeli data końcowa nie jest pusta.";
    } else {
      errorMessage = "";
    }

    setReportCriteria((prev) =>
      prev.map((criteria) =>
        criteria.id === reportCriteria.id
          ? {
              ...criteria,
              firstDtp: {
                ...criteria.firstDtp,
                dtpDate: dateTimePickerFirstDate,
              },
              secondDtp: {
                ...criteria.secondDtp,
                dtpDate: dateTimePickerLastDate,
              },
              checkbox: { ...criteria.checkbox, checked: checked },
              errorMessage: errorMessage,
            }
          : criteria
      )
    );
  }, [
    dateTimePickerFirstDate,
    dateTimePickerLastDate,
    reportCriteria.id,
    checked,
    setReportCriteria,
  ]);

  useEffect(() => {
    if (!dateTimePickerFirstDate) {
      setDateTimePickerLastDate(dateTimePickerFirstDate);
    }
  }, [dateTimePickerFirstDate]);

  return (
    <div className={`${scss["reportFormDateTimePickers-main-container"]}`}>
      <div className={scss["checkbox-container"]}>
        <CheckboxRegular
          checked={checked}
          setChecked={setChecked}
          name={checkbox.name}
        />
      </div>
      <div
        className={`${scss["reportFormDateTimePickers-container"]} 
      ${checked ? "" : scss["inactive-component"]} `}
        data-tooltip-id={
          errorMessage
            ? "reportFormDateTimePickers-tooltip-error-date"
            : undefined
        }
        data-tooltip-content={errorMessage}
      >
        <div className={scss["description-container"]}>
          <p>{description}:</p>
        </div>

        <div className={scss["dateTimePicker-container"]}>
          <label
            htmlFor={firstDtp.dtpName}
            className={scss["dateTimePicker-label"]}
          >
            {firstDtp.dtpLabelText}:
          </label>
          <DateTimePicker
            dateTimePickerDate={dateTimePickerFirstDate}
            setDateTimePickerDate={setDateTimePickerFirstDate}
            id={firstDtp.dtpName}
            name={firstDtp.dtpName}
          />
        </div>
        <div className={scss["dateTimePicker-container"]}>
          <label
            htmlFor={secondDtp.dtpName}
            className={scss["dateTimePicker-label"]}
          >
            {secondDtp.dtpLabelText}:
          </label>
          <DateTimePicker
            dateTimePickerDate={dateTimePickerLastDate}
            setDateTimePickerDate={setDateTimePickerLastDate}
            isClearable={true}
            name={secondDtp.dtpName}
          />
        </div>
      </div>
      <Tooltip
        id="reportFormDateTimePickers-tooltip-error-date"
        className={`${scss["tooltip"]} ${scss["tooltip-error"]}`}
        isOpen={errorMessage && checked ? true : false}
      />
    </div>
  );
};
