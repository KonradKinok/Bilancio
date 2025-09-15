import scss from "./ReportFormDateTimePickers.module.scss";
import { DateTimePicker } from "../../DateTimePicker/DateTimePicker";
import { use, useEffect, useState } from "react";
import { CheckboxRegular } from "../../CheckboxRegular/CheckboxRegular";

interface ReportFormDateTimePickersProps {
  reportCriteria: ReportCriteria;
  setReportCriteria: React.Dispatch<React.SetStateAction<ReportCriteria[]>>;
}

export const ReportFormDateTimePickers: React.FC<
  ReportFormDateTimePickersProps
> = ({ reportCriteria, setReportCriteria }) => {
  // Destrukturyzacja obiektu reportCriteria w celu uzyskania indywidualnych kryteriów
  const { id, checkbox, firstDtp, secondDtp, description, errorMesage } =
    reportCriteria;

  // Lokalne stany dla komponentów DateTimePicker
  const [dateTimePickerFirstDate, setDateTimePickerFirstDate] =
    useState<Date | null>(firstDtp.dtpDate);
  const [dateTimePickerLastDate, setDateTimePickerLastDate] =
    useState<Date | null>(secondDtp.dtpDate);
  const [checked, setChecked] = useState(checkbox.checked);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, type, checked, value } = event.target;
  //   const currentName = event.target.name;
  //   let errorTextInput = "";

  //   if (type === "checkbox") {
  //     if (name === checkbox.name) {
  //       setReportCriteria((prev) =>
  //         prev.map((criteria) =>
  //           criteria.checkbox.name === name
  //             ? { ...criteria, checkbox: { ...criteria.checkbox, checked } }
  //             : criteria
  //         )
  //       );
  //     }
  //   } else {
  //     // zwykły input/text
  //     console.log(`Input ${name} -> ${value}`);
  //     if (!value) {
  //       errorTextInput = "Musisz wypełnić to pole";
  //     }
  //   }
  // };
  // const handleDateChange = (date: Date | null, name: string) => {
  //   if (!date) return; // ignoruj null
  //   setReportCriteria((prev) =>
  //     prev.map((criteria) =>
  //       criteria.firstDtp.dtpName === name
  //         ? { ...criteria, firstDtp: { ...criteria.firstDtp, dtpDate: date } }
  //         : criteria.secondDtp.dtpName === name
  //         ? { ...criteria, secondDtp: { ...criteria.secondDtp, dtpDate: date } }
  //         : criteria
  //     )
  //   );
  // };
  useEffect(() => {
    if (!dateTimePickerFirstDate || !dateTimePickerLastDate) return;
    let errorMesage = "";
    if (dateTimePickerFirstDate > dateTimePickerLastDate) {
      errorMesage = "Data początkowa nie może być późniejsza niż data końcowa.";
    } else {
      errorMesage = "";
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
              errorMesage: errorMesage,
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

  return (
    <div className={scss["reportFormDateTimePickers-main-container"]}>
      <div className={scss["checkbox-container"]}>
        <CheckboxRegular
          checked={checked}
          // handleChange={handleChange}
          setChecked={setChecked}
          name={checkbox.name}
        />
      </div>

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
          isClearable={false}
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
          isClearable={false}
          name={secondDtp.dtpName}
        />
      </div>
    </div>
  );
};
