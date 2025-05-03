import { useState } from "react";
import { nanoid } from "nanoid";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import { FormAddInvoiceDocuments } from "../FormAddInvoiceDocuments/FormAddInvoiceDocuments";
import { TextInput } from "../TextInput/TextInput";
import scss from "./FormAddInvoice.module.scss";
import { Tooltip } from "react-tooltip";
import { FaInfoCircle } from "react-icons/fa";

interface FormAddInvoiceProps {
  addInvoiceData: InvoiceSave;
  setAddInvoiceData: React.Dispatch<React.SetStateAction<InvoiceSave>>;
}

export const FormAddInvoice: React.FC<FormAddInvoiceProps> = ({
  addInvoiceData,
  setAddInvoiceData,
}) => {
  const [inputInvoiceName, setInputInvoiceName] = useState<string>("");
  const [inputInvoiceNameError, setInputInvoiceNameError] =
    useState<string>("");
  const [dateTimePickerReceiptDate, setDateTimePickerReceiptDate] =
    useState<Date | null>(null);
  const [dateTimePickerDeadlineDate, setDateTimePickerDeadlineDate] =
    useState<Date | null>(null);
  const [dateTimePickerPaymentDate, setDateTimePickerPaymentDate] =
    useState<Date | null>(null);
  const [documentComponents, setDocumentComponents] = useState<string[]>([
    nanoid(),
  ]);

  const handleSingleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentValue = event.target.value;
    const currentName = event.target.name;
    let errorTextInput = "";

    if (currentName === "invoiceName") {
      setInputInvoiceName(currentValue);
      setAddInvoiceData((prev) => ({
        ...prev,
        invoice: { ...prev.invoice, InvoiceName: currentValue },
      }));
      if (!currentValue) {
        errorTextInput = "Musisz wypełnić te pole";
      }
      setInputInvoiceNameError(errorTextInput);
    }
  };

  const handleAddDocument = () => {
    const newId = nanoid();
    setDocumentComponents((prev) => [...prev, newId]);
    setAddInvoiceData((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        {
          InvoiceId: undefined,
          DocumentId: 0,
          MainTypeId: null,
          TypeId: null,
          SubtypeId: null,
          Quantity: 0,
          Price: 0,
        },
      ],
    }));
  };

  const handleRemoveDocument = (id: string) => {
    if (documentComponents.length <= 1) {
      return; // Blokuj usuwanie, jeśli jest tylko jeden komponent
    }
    setDocumentComponents((prev) =>
      prev.filter((componentId) => componentId !== id)
    );
    setAddInvoiceData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => documentComponents[i] !== id),
    }));
  };

  return (
    <form action="" className={scss["form-add-invoice"]}>
      <div className={scss["form-add-invoice-container"]}>
        <div className={scss["form-add-invoice-title-container"]}>
          <h3 className={scss["form-add-invoice-title"]}>
            Dodaj nową fakturę:
          </h3>
          <div
            className={scss["container-icon"]}
            data-tooltip-id="tooltip-formAddInvoice"
            data-tooltip-html={tooltipInfoFormAddInvoice()}
          >
            <FaInfoCircle className={scss["icon"]} />
          </div>
        </div>
        <div className={scss["form-invoice-data"]}>
          <div className={scss[""]}>
            <TextInput
              inputName="invoiceName"
              singleInputValue={inputInvoiceName}
              handleSingleInputChange={handleSingleInputChange}
              inputPlaceholder="Wprowadź nazwę faktury ..."
              inputLabelText="Nazwa faktury:"
              singleInputError={inputInvoiceNameError}
              required={false}
              classNameInputContainer={scss["custom-input-container"]}
            />
          </div>
          <div className={scss["dateTimePicker-container"]}>
            <label htmlFor="dateTimePicker">Data wpływu:</label>
            <DateTimePicker
              dateTimePickerDate={dateTimePickerReceiptDate}
              setDateTimePickerDate={setDateTimePickerReceiptDate}
              isClearable={false}
            />
          </div>
          <div className={scss["dateTimePicker-container"]}>
            <label htmlFor="dateTimePicker">Termin płatności:</label>
            <DateTimePicker
              dateTimePickerDate={dateTimePickerDeadlineDate}
              setDateTimePickerDate={setDateTimePickerDeadlineDate}
            />
          </div>
          <div className={scss["dateTimePicker-container"]}>
            <label htmlFor="dateTimePicker">Data płatności:</label>
            <DateTimePicker
              dateTimePickerDate={dateTimePickerPaymentDate}
              setDateTimePickerDate={setDateTimePickerPaymentDate}
            />
          </div>
          <div>
            <h3 className={scss["form-add-invoice-title"]}>Dodaj dokumenty:</h3>
            {documentComponents.map((id, index) => (
              <FormAddInvoiceDocuments
                key={id}
                addInvoiceData={addInvoiceData}
                setAddInvoiceData={setAddInvoiceData}
                onAddDocument={handleAddDocument}
                onRemoveDocument={() => handleRemoveDocument(id)}
                isLast={index === documentComponents.length - 1}
                isOnly={documentComponents.length === 1}
                index={index}
              />
            ))}
          </div>
        </div>
        <div>
          <p>Faktura: 1234,00 zł</p>
        </div>
      </div>
      <Tooltip id="tooltip-formAddInvoice" className={scss["tooltip"]} />
    </form>
  );
};

function tooltipInfoFormAddInvoice() {
  const text = `Formularz wyboru daty.
  Umożliwia wybór początkowej i końcowej daty wpływu faktury oraz opcjonalne wyświetlenie usuniętych elementów.
  Wybierz daty, kliknij przycisk "Pokaż", aby zastosować zmiany.
  Uwaga! Data początkowa nie może być późniejsza niż data końcowa.
  Przycisk "Dodaj fakturę" służy do otwarcia okna, w którym można dodać fakturę.`;
  return text.replace(/\n/g, "<br/>");
}
