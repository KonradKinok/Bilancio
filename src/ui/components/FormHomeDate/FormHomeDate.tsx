import { useEffect, useState } from "react";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import scss from "./FormHomeDate.module.scss";
// import { type FormValuesHomePage } from "../Context/ElectronProvider";
import { useMainDataContext } from "../Context/useOptionsImage";
import { CheckboxSlider } from "../CheckboxSlider/CheckboxSlider";

interface FormHomeDate {
  formValuesHomePage: FormValuesHomePage;
  setFormValuesHomePage: React.Dispatch<
    React.SetStateAction<FormValuesHomePage>
  >;
}

export const FormHomeDate: React.FC = () => {
  const [dateTimePickerFirstDate, setDateTimePickerFirstDate] =
    useState<Date | null>(new Date(new Date().getFullYear(), 0, 1));
  const [dateTimePickerLastDate, setDateTimePickerLastDate] =
    useState<Date | null>(new Date(new Date().getFullYear(), 11, 31));
  const { options, setOptions } = useMainDataContext();
  const { formValuesHomePage, setFormValuesHomePage } = useMainDataContext();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormValuesHomePage((prevData) => ({
      ...prevData,
      firstDate: dateTimePickerFirstDate,
      secondDate: dateTimePickerLastDate,
    }));
    setOptions((prevData) => ({
      ...prevData,
      orientation: "dateTimePickerFirstDate",
      secondDate: "color",
    }));
  };

  useEffect(() => {
    setDateTimePickerFirstDate(formValuesHomePage.firstDate);
    setDateTimePickerLastDate(formValuesHomePage.secondDate);
  }, [formValuesHomePage]);
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
          <div>
            <CheckboxSlider
              textLabel={"Pokaż usunięte:"}
              type={"checkbox"}
              name={"checkbox-homepage"}
              id={"checkbox-homepage"}
              classLabel={scss["temp"]}
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
