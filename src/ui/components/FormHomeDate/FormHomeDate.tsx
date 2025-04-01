import { useState } from "react";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import scss from "./FormHomeDate.module.scss";
import { type FormValuesHomePage } from "../../pages/HomePage/HomePage";

interface FormHomeDate {
  formValuesHomePage: FormValuesHomePage;
  setFormValuesHomePAge: React.Dispatch<
    React.SetStateAction<FormValuesHomePage>
  >;
}

export const FormHomeDate: React.FC<FormHomeDate> = () => {
  const [dateTimePickerFirstDate, setDateTimePickerFirstDate] =
    useState<Date | null>(new Date(new Date().getFullYear(), 0, 1));
  const [dateTimePickerLastDate, setDateTimePickerLastDate] =
    useState<Date | null>(new Date(new Date().getFullYear(), 11, 31));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //  setFormValues((prevData) => ({
    //    ...prevData,
    //    selectedDate: dateTimePickerDate,
    //  }));
    //  const {
    //    selectedDate,
    //    sold,
    //    bought,
    //    isNaturalPerson,
    //    isLegalPerson,
    //    detailedData,
    //  } = formValues;

    //  const calculatedDataFunction = calculator.calculationNumberOfDays(
    //    selectedDate,
    //    sold,
    //    bought,
    //    isNaturalPerson,
    //    isLegalPerson,
    //    detailedData,
    //    currentLanguage
    //  );

    //  setCalculatedData(calculatedDataFunction);
  };

  return (
    <div className={scss["formhomedate-main-container"]}>
      <form className={scss["form"]} onSubmit={handleSubmit}>
        <div className={scss["dateTimePicker-main-container"]}>
          <div className={scss["dateTimePicker-container"]}>
            <label htmlFor="dateTimePicker">Data początkowa:</label>
            <DateTimePicker
              dateTimePickerDate={dateTimePickerFirstDate}
              setDateTimePickerDate={setDateTimePickerFirstDate}
            />
          </div>
          <div className={scss["dateTimePicker-container"]}>
            <label htmlFor="dateTimePicker">Data końcowa:</label>
            <DateTimePicker
              dateTimePickerDate={dateTimePickerLastDate}
              setDateTimePickerDate={setDateTimePickerLastDate}
            />
          </div>
          <div className={scss["container-button"]}>
            <button className={scss["button"]} type="submit">
              Pokaż
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
