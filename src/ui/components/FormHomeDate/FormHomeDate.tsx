import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useMainDataContext } from "../Context/useMainDataContext";
import { useToggle } from "../../hooks/useToggle";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import { TextInput } from "../TextInput/TextInput";
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
const SEARCH_DEBOUNCE_MS = 400;
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
    formValuesHomePage.isDeleted || 0,
  );
  const [inputSearchInvoice, setInputInvoiceName] = useState<string>(
    formValuesHomePage.invoiceName ?? "",
  );
  const [inputSearchInvoiceError, setInputInvoiceNameError] =
    useState<string>("");

  const handleInputSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const currentValue = event.target.value;
    const searchValue = currentValue.trim();

    setInputInvoiceName(currentValue);

    if (searchValue.length > 0 && searchValue.length < 3) {
      setInputInvoiceNameError(
        "Do wyszukania potrzebne są przynajmniej 3 znaki.",
      );
    } else {
      setInputInvoiceNameError("");
    }
  };

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
      invoiceName: inputSearchInvoice.trim() || undefined,
    }));

    setPage(1); // Resetowanie strony do 1 przy form submitcie
  };

  const handleClickSearchInvoiceButton = () => {
    updateInvoiceNameFilter(inputSearchInvoice);
  };

  useEffect(() => {
    // Walidacja daty i wyświetlanie tooltipu
    if (
      dateTimePickerFirstDate &&
      dateTimePickerLastDate &&
      dateTimePickerFirstDate > dateTimePickerLastDate
    ) {
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  }, [dateTimePickerFirstDate, dateTimePickerLastDate, inputSearchInvoice]);

  // Debounce dla inputa wyszukiwania faktury
  useEffect(() => {
    const searchValue = inputSearchInvoice.trim();

    if (searchValue.length > 0 && searchValue.length < 3) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      updateInvoiceNameFilter(inputSearchInvoice);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputSearchInvoice]);

  // Obsługa naciśnięcia klawisza Enter w polu wyszukiwania faktury
  const handleSearchInvoiceKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      updateInvoiceNameFilter(inputSearchInvoice);
    }
  };

  // Obsługa kliknięcia przycisku "Szukaj"
  const updateInvoiceNameFilter = (value: string) => {
    const invoiceName = value.trim();

    if (invoiceName.length > 0 && invoiceName.length < 3) {
      setInputInvoiceNameError(
        "Do wyszukania potrzebne są przynajmniej 3 znaki.",
      );
      return;
    }

    setInputInvoiceNameError("");

    setFormValuesHomePage((prevData) => ({
      ...prevData,
      invoiceName: invoiceName || undefined,
    }));

    setPage(1);
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
              isClearable={false}
              classNameButton={scss["custom-date-button"]}
              classNameIcon={scss["icon-date-button"]}
            />
          </div>
          <div className={scss["dateTimePicker-container"]}>
            <label htmlFor="dateTimePicker">Data końcowa:</label>
            <DateTimePicker
              dateTimePickerDate={dateTimePickerLastDate}
              setDateTimePickerDate={setDateTimePickerLastDate}
              isClearable={false}
              classNameButton={scss["custom-date-button"]}
              classNameIcon={scss["icon-date-button"]}
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
          <div className={scss["container-search"]}>
            <div className={scss[""]}>
              <TextInput
                inputName="searchInvoiceName"
                singleInputValue={inputSearchInvoice}
                handleSingleInputChange={handleInputSearchChange}
                handleKeyDown={handleSearchInvoiceKeyDown}
                inputPlaceholder="Wprowadź szukaną nazwę faktury ..."
                inputLabelText="Pole wyszukiwania:"
                singleInputError={inputSearchInvoiceError}
                required={false}
                classNameInputContainer={scss["custom-input-container"]}
              />
            </div>
            <div className={scss["container-button"]}>
              <button
                name="button-search"
                className={scss["button"]}
                type="button"
                onClick={handleClickSearchInvoiceButton}
                disabled={!!inputSearchInvoiceError}
                data-tooltip-id={
                  inputSearchInvoiceError ? "tooltip-error-date" : undefined
                }
                data-tooltip-content={inputSearchInvoiceError || undefined}
              >
                Szukaj
              </button>
            </div>
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
