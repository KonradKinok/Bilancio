import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import { FormAddInvoiceDocuments } from "../FormAddInvoiceDocuments/FormAddInvoiceDocuments";
import { TextInput } from "../TextInput/TextInput";
import scss from "./FormAddInvoice.module.scss";
import { Tooltip } from "react-tooltip";
import { FaInfoCircle } from "react-icons/fa";
import { ButtonCancel } from "../ButtonCancel/ButtonCancel";
import { calculateTotalAmount } from "../GlobalFunctions/GlobalFunctions";
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
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] =
    useState<boolean>(false);

  // Przygotowanie tablic quantities i prices dla calculateTotalAmount
  const quantities = addInvoiceData.details.map((detail) =>
    detail.Quantity.toString()
  );
  const prices = addInvoiceData.details.map((detail) =>
    detail.Price.toString()
  );
  const totalAmount = calculateTotalAmount(quantities, prices);

  // Formatowanie daty do YYYY-MM-DD
  const formatDate = (date: Date | null): string | null => {
    if (!date) return null;
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  // Aktualizacja dat w addInvoiceData
  useEffect(() => {
    setAddInvoiceData((prev) => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        ReceiptDate: formatDate(dateTimePickerReceiptDate) || "",
        DeadlineDate: formatDate(dateTimePickerDeadlineDate),
        PaymentDate: formatDate(dateTimePickerPaymentDate) || null,
      },
    }));
  }, [
    dateTimePickerReceiptDate,
    dateTimePickerDeadlineDate,
    dateTimePickerPaymentDate,
    setAddInvoiceData,
  ]);
  // Walidacja pól i unikalności dokumentów
  const validateForm = (): boolean => {
    // Sprawdzenie invoiceName
    const isInvoiceNameValid = inputInvoiceName.trim() !== "";

    // Sprawdzenie ReceiptDate
    const isReceiptDateValid = !!dateTimePickerReceiptDate;

    // Sprawdzenie dokumentów
    const areDetailsValid = addInvoiceData.details.every((detail) => {
      return (
        detail.DocumentId !== 0 &&
        detail.Quantity > 0 &&
        detail.Price >= 0 &&
        (!detail.MainTypeId || detail.MainTypeId > 0) &&
        (!detail.TypeId || detail.TypeId > 0) &&
        (!detail.SubtypeId || detail.SubtypeId > 0)
      );
    });

    // Sprawdzenie unikalności dokumentów
    const documentKeys = addInvoiceData.details.map(
      (detail) =>
        `${detail.DocumentId}-${detail.MainTypeId ?? "null"}-${
          detail.TypeId ?? "null"
        }-${detail.SubtypeId ?? "null"}`
    );
    const uniqueDocuments = new Set(documentKeys).size === documentKeys.length;

    return (
      isInvoiceNameValid &&
      isReceiptDateValid &&
      areDetailsValid &&
      uniqueDocuments
    );
  };
  // Aktualizacja stanu przycisku Zapisz
  useEffect(() => {
    setIsSaveButtonEnabled(validateForm());
  }, [inputInvoiceName, dateTimePickerReceiptDate, addInvoiceData.details]);

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
    const indexToRemove = documentComponents.indexOf(id);
    if (indexToRemove === -1) return; // Zabezpieczenie przed błędnym ID
    setDocumentComponents((prev) =>
      prev.filter((componentId) => componentId !== id)
    );
    setAddInvoiceData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== indexToRemove),
    }));
  };
  // const handleRemoveDocument = (id: string) => {
  //   if (documentComponents.length <= 1) {
  //     return; // Blokuj usuwanie, jeśli jest tylko jeden komponent
  //   }
  //   setDocumentComponents((prev) =>
  //     prev.filter((componentId) => componentId !== id)
  //   );
  //   setAddInvoiceData((prev) => ({
  //     ...prev,
  //     details: prev.details.filter((_, i) => documentComponents[i] !== id),
  //   }));
  // };
  const handleSaveInvoice = async () => {
    if (!isSaveButtonEnabled) return;

    try {
      const invoice: InvoiceTable = {
        InvoiceName: addInvoiceData.invoice.InvoiceName,
        ReceiptDate: addInvoiceData.invoice.ReceiptDate,
        DeadlineDate: addInvoiceData.invoice.DeadlineDate,
        PaymentDate: addInvoiceData.invoice.PaymentDate,
        IsDeleted: 0,
      };

      const invoiceDetails: InvoiceDetailsTable[] = addInvoiceData.details.map(
        (detail) => ({
          DocumentId: detail.DocumentId,
          MainTypeId: detail.MainTypeId,
          TypeId: detail.TypeId,
          SubtypeId: detail.SubtypeId,
          Quantity: detail.Quantity,
          Price: detail.Price,
        })
      );

      const result = await window.electron.addInvoiceDetails(
        invoice,
        invoiceDetails
      );
      if (result.changes && result.lastID) {
        alert(`Faktura zapisana pomyślnie! ID: ${result.lastID}`);
        // Reset formularza po zapisie
        setInputInvoiceName("");
        setDateTimePickerReceiptDate(null);
        setDateTimePickerDeadlineDate(null);
        setDateTimePickerPaymentDate(null);
        setDocumentComponents([nanoid()]);
        setAddInvoiceData({
          invoice: {
            InvoiceId: undefined,
            InvoiceName: "",
            ReceiptDate: "",
            DeadlineDate: null,
            PaymentDate: null,
            IsDeleted: 0,
          },
          details: [
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
        });
      } else {
        throw new Error("Nie udało się dodać faktury.");
      }
    } catch (error) {
      console.error("Błąd podczas zapisywania faktury:", error);
      alert(
        `Wystąpił błąd podczas zapisywania faktury: ${(error as Error).message}`
      );
    }
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
        </div>
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

        <div>
          <p>
            Faktura {inputInvoiceName}: {totalAmount}
          </p>
          <ButtonCancel
            buttonName="saveInvoice"
            buttonText="Zapisz fakturę"
            buttonClick={handleSaveInvoice}
            buttonDisabled={!isSaveButtonEnabled}
          />
        </div>
      </div>
      <Tooltip id="tooltip-formAddInvoice" className={scss["tooltip"]} />
    </form>
  );
};

function tooltipInfoFormAddInvoice() {
  const text = `Formularz dodania nowej faktury.
  Pole "Nazwa faktury" (wymagane) umożliwia wpisanie nazwy faktury.
  Pole "Data wpływu" (wymagane) umożliwia wybranie daty wpływu faktury.
  Pole "Termin płatności" (Opcjonalne) umożliwia wybranie końcowej daty płatności za fakturę
   i "Data płatności" umożliwiają wybór daty.
  Wybór daty odbywa się poprzez kliknięcie w pole, co otworzy kalendarz.
  Wybór daty można również wykonać ręcznie, wpisując datę w formacie YYYY-MM-DD.
  Uwaga! Data początkowa nie może być późniejsza niż data końcowa.
  Przycisk "Dodaj fakturę" służy do otwarcia okna, w którym można dodać fakturę.`;
  return text.replace(/\n/g, "<br/>");
}
