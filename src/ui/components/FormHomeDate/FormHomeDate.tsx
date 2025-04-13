import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import scss from "./FormHomeDate.module.scss";
// import { type FormValuesHomePage } from "../Context/ElectronProvider";
import { useMainDataContext } from "../Context/useOptionsImage";
import { CheckboxSlider } from "../CheckboxSlider/CheckboxSlider";
import { Tooltip } from "react-tooltip";

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
  const [radioButtonIsDeleted, setRadioButtonIsDeleted] = useState<0 | 1>(0);
  const { options, setOptions } = useMainDataContext();
  const { formValuesHomePage, setFormValuesHomePage } = useMainDataContext();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormValuesHomePage((prevData) => ({
      ...prevData,
      firstDate: dateTimePickerFirstDate,
      secondDate: dateTimePickerLastDate,
      isDeleted: radioButtonIsDeleted,
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
    setRadioButtonIsDeleted(formValuesHomePage.isDeleted || 0);
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
              inputType={"checkbox"}
              inputName={"checkbox-homepage"}
              inputId={"checkbox-homepage"}
              classLabel={scss["temp"]}
              radioButtonIsDeleted={radioButtonIsDeleted}
              setRadioButtonIsDeleted={setRadioButtonIsDeleted}
            />
          </div>
          <div className={scss["container-button"]}>
            <button className={scss["button"]} type="submit">
              Pokaż
            </button>
          </div>
        </div>
        <div
          className={scss["container-icon"]}
          data-tooltip-id="tooltip-formHomeDate"
          data-tooltip-content="Hello world!"
        >
          <FaInfoCircle className={scss["icon"]} />
        </div>
      </form>
      <Tooltip
        id="tooltip-formHomeDate"
        className={scss["tooltip-custom"]}
        offset={5}
      />
    </div>
  );
};
