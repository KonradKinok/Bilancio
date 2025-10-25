import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useMainDataContext } from "../Context/useMainDataContext";
import { useToggle } from "../../hooks/useToggle";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import { ModalAddInvoice } from "../ModalAddInvoice/ModalAddInvoice";
import { CheckboxSlider } from "../CheckboxSlider/CheckboxSlider";
import { IconInfo } from "../IconInfo/IconInfo";
import scss from "./FormHomeDate.module.scss";

interface FormHomeDateProps {
  formValuesHomePage: FormValuesHomePage;
  setFormValuesHomePage: React.Dispatch<
    React.SetStateAction<FormValuesHomePage>
  >;
  refetchAllInvoices: () => void;
}

export const FormHomeDate: React.FC<FormHomeDateProps> = ({
  formValuesHomePage,
  setFormValuesHomePage,
  refetchAllInvoices,
}) => {
  const { setPage } = useMainDataContext();
  const [showTooltip, setShowTooltip] = useState(false);
  const {
    isOpenModal: isModalAddInvoiceOpen,
    openModal: openModalAddInvoice,
    closeModal: closeModalAddInvoice,
  } = useToggle();
  const [dateTimePickerFirstDate, setDateTimePickerFirstDate] =
    useState<Date | null>(formValuesHomePage.firstDate);
  const [dateTimePickerLastDate, setDateTimePickerLastDate] =
    useState<Date | null>(formValuesHomePage.secondDate);
  const [radioButtonIsDeleted, setRadioButtonIsDeleted] = useState<0 | 1>(
    formValuesHomePage.isDeleted || 0
  );

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
    setPage(1); // Resetowanie strony do 1 przy form submitcie
  };

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
        <IconInfo
          tooltipId="tooltip-formHomeDate"
          tooltipInfoTextHtml={tooltipInfoFormHomeDateTekst()}
        />
      </form>
      <Tooltip
        id="tooltip-error-date"
        className={`${scss["tooltip"]} ${scss["tooltip-error"]}`}
      />
      <ModalAddInvoice
        closeModalAddInvoice={closeModalAddInvoice}
        isModalAddInvoiceOpen={isModalAddInvoiceOpen}
        refetchAllInvoices={refetchAllInvoices}
        selectedInvoice={emptyInvoiceData()} // Przekazanie danych faktury
      />
    </div>
  );
};

function tooltipInfoFormHomeDateTekst() {
  const text = `📆 Formularz wyboru daty.
  Umożliwia wybór początkowej i końcowej daty wpływu faktury oraz opcjonalne wyświetlenie usuniętych elementów.
  Wybierz daty, kliknij przycisk "Pokaż", aby zastosować zmiany.
  ⚠️ Data początkowa nie może być późniejsza niż data końcowa.
  Przycisk "Dodaj fakturę" służy do otwarcia okna, w którym można dodać fakturę.`;
  return text.replace(/\n/g, "<br/>");
}

function tooltipErrorDateFormHomeDateTekst() {
  const text = `Data początkowa nie może być późniejsza niż data końcowa.`;
  return text.replace(/\n/g, "<br/>");
}

const emptyInvoiceData = (): InvoiceSave => {
  const invoiceData: InvoiceSave = {
    invoice: {
      InvoiceName: "",
      ReceiptDate: "",
      DeadlineDate: null,
      PaymentDate: null,
      IsDeleted: 0,
    },
    details: [
      {
        DocumentId: 0,
        MainTypeId: null,
        TypeId: null,
        SubtypeId: null,
        Quantity: 0,
        Price: 0,
        isMainTypeRequired: false,
        isTypeRequired: false,
        isSubtypeRequired: false,
      },
    ],
  };
  return invoiceData;
};
