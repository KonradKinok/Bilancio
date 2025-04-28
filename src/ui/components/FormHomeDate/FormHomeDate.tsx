import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import scss from "./FormHomeDate.module.scss";
import { useToggle } from "../../hooks/useToggle";
import { useMainDataContext } from "../Context/useOptionsImage";
import { ModalAddInvoice } from "../ModalAddInvoice/ModalAddInvoice";
import { CheckboxSlider } from "../CheckboxSlider/CheckboxSlider";
import { Tooltip } from "react-tooltip";

interface FormHomeDate {
  formValuesHomePage: FormValuesHomePage;
  setFormValuesHomePage: React.Dispatch<
    React.SetStateAction<FormValuesHomePage>
  >;
}

export const FormHomeDate: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const {
    isOpenModal: isModalAddInvoiceOpen,
    openModal: openModalAddInvoice,
    closeModal: closeModalAddInvoice,
  } = useToggle();
  const [dateTimePickerFirstDate, setDateTimePickerFirstDate] =
    useState<Date | null>(new Date(new Date().getFullYear(), 0, 1));
  const [dateTimePickerLastDate, setDateTimePickerLastDate] =
    useState<Date | null>(new Date(new Date().getFullYear(), 11, 31));
  const [radioButtonIsDeleted, setRadioButtonIsDeleted] = useState<0 | 1>(0);
  const { options, setOptions } = useMainDataContext();
  const { formValuesHomePage, setFormValuesHomePage } = useMainDataContext();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      dateTimePickerFirstDate &&
      dateTimePickerLastDate &&
      dateTimePickerFirstDate > dateTimePickerLastDate
    ) {
      return;
    }
    setFormValuesHomePage((prevData) => ({
      ...prevData,
      firstDate: dateTimePickerFirstDate,
      secondDate: dateTimePickerLastDate,
      isDeleted: radioButtonIsDeleted,
    }));
  };

  useEffect(() => {
    setDateTimePickerFirstDate(formValuesHomePage.firstDate);
    setDateTimePickerLastDate(formValuesHomePage.secondDate);
    setRadioButtonIsDeleted(formValuesHomePage.isDeleted || 0);
  }, [formValuesHomePage]);

  useEffect(() => {
    if (
      dateTimePickerFirstDate &&
      dateTimePickerLastDate &&
      dateTimePickerFirstDate > dateTimePickerLastDate
    ) {
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  }, [dateTimePickerFirstDate, dateTimePickerLastDate]);

  return (
    <div className={scss["formhomedate-main-container"]}>
      <form className={scss["form"]} onSubmit={handleSubmit}>
        <div className={scss["dateTimePicker-main-container"]}>
          <div className={scss["dateTimePicker-container"]}>
            <label htmlFor="dateTimePicker">Data początkowa:</label>
            <DateTimePicker
              dateTimePickerDate={dateTimePickerFirstDate}
              setDateTimePickerDate={setDateTimePickerFirstDate}
              isClearable={false}
            />
          </div>
          <div className={scss["dateTimePicker-container"]}>
            <label htmlFor="dateTimePicker">Data końcowa:</label>
            <DateTimePicker
              dateTimePickerDate={dateTimePickerLastDate}
              setDateTimePickerDate={setDateTimePickerLastDate}
              isClearable={false}
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
            <button
              className={scss["button"]}
              type="submit"
              data-tooltip-id={showTooltip ? "tooltip-error-date" : undefined}
              data-tooltip-content={
                showTooltip ? tooltipErrorDateFormHomeDateTekst() : undefined
              }
            >
              Pokaż
            </button>
          </div>
          <div className={scss["vertical-line"]}></div>
          <div className={scss["container-button"]}>
            <button
              className={scss["button"]}
              type="button"
              onClick={openModalAddInvoice}
            >
              Dodaj fakturę
            </button>
          </div>
        </div>
        <div
          className={scss["container-icon"]}
          data-tooltip-id="tooltip-formHomeDate"
          data-tooltip-html={tooltipInfoFormHomeDateTekst()}
        >
          <FaInfoCircle className={scss["icon"]} />
        </div>
      </form>
      <Tooltip id="tooltip-formHomeDate" className={scss["tooltip"]} />
      <Tooltip
        id="tooltip-error-date"
        className={`${scss["tooltip"]} ${scss["tooltip-error"]}`}
      />
      <ModalAddInvoice
        closeModalAddInvoice={closeModalAddInvoice}
        isModalAddInvoiceOpen={isModalAddInvoiceOpen}
      />
    </div>
  );
};

function tooltipInfoFormHomeDateTekst() {
  const text = `Formularz wyboru daty.
  Umożliwia wybór początkowej i końcowej daty wpływu faktury oraz opcjonalne wyświetlenie usuniętych elementów.
  Wybierz daty, kliknij przycisk "Pokaż", aby zastosować zmiany.
  Uwaga! Data początkowa nie może być późniejsza niż data końcowa.
  Przycisk "Dodaj fakturę" służy do otwarcia okna, w którym można dodać fakturę.`;
  return text.replace(/\n/g, "<br/>");
}

function tooltipErrorDateFormHomeDateTekst() {
  const text = `Data początkowa nie może być późniejsza niż data końcowa.`;
  return text.replace(/\n/g, "<br/>");
}
