import { useState } from "react";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import scss from "./FormHomeDate.module.scss";

export const FormHomeDate: React.FC = () => {
  const [dateTimePickerDate, setDateTimePickerDate] = useState<Date | null>(
    new Date()
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className={scss["container-form"]}>
      <form className={scss["form"]} onSubmit={handleSubmit}>
        <div className={scss["container-dateTimePicker"]}>
          <label htmlFor="dateTimePicker">Label</label>
          <DateTimePicker
            dateTimePickerDate={dateTimePickerDate}
            setDateTimePickerDate={setDateTimePickerDate}
          />
        </div>
        <div className={scss["container-radio"]}>
          <label htmlFor="radio-sold">
            <p className={scss["custom-title"]}>Jakiś label</p>
          </label>
          <input
            type="radio"
            name="amount_of_penalty"
            id="radio-sold"
            className={scss["toggle-switch"]}
            // checked={formValues.sold} // Ustawienie, czy input jest zaznaczony
            // onChange={handleChange}
          />
          <label htmlFor="radio-bought">
            <p className={scss["custom-title"]}>Jakiś label</p>
          </label>
          <input
            type="radio"
            name="amount_of_penalty"
            id="radio-bought"
            // checked={formValues.bought}
            // onChange={handleChange}
            className={scss["toggle-switch"]}
          />
        </div>
        <div
          className={`${scss["container-radio"]} ${scss["container-button"]}`}
        >
          <button type="submit">Przycisk</button>
        </div>
      </form>
    </div>
  );
};
