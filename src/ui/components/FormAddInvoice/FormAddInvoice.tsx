import { useState } from "react";
import { FaUser } from "react-icons/fa";
import scss from "./FormAddInvoice.module.scss";
import { SingleInput } from "../SingleInput/SingleInput";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import { FormAddInvoiceDocuments } from "../FormAddInvoiceDocuments/FormAddInvoiceDocuments";
import { TextInput } from "../TextInput/TextInput";

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

  const handleSingleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentValue = event.target.value;
    const currentName = event.target.name;
    let errorTextInput = "";

    if (currentName === "invoiceName") {
      setInputInvoiceName(currentValue);
      if (currentValue.length === 1) {
        errorTextInput = "Za mało liter";
      } else if (!currentValue) {
        errorTextInput = "Musisz wypełnić te pole";
      }
      setInputInvoiceNameError(errorTextInput);
    }
    // if (currentName === fieldNames.email) {
    //   setInputEmail(currentValue);
    //   if (currentValue.length === 1) {
    //     errorTextInput = "Za mało liter";
    //   } else if (!currentValue) {
    //     errorTextInput = "Musisz wypełnić te pole";
    //   }
    //   setInputEmailError(errorTextInput);
    // }
    // if (currentName === fieldNames.password) {
    //   setInputPassword(currentValue);
    //   if (currentValue.length === 1) {
    //     errorTextInput = "Za mało liter";
    //   } else if (!currentValue) {
    //     errorTextInput = "Musisz wypełnić te pole";
    //   }
    //   setInputPasswordError(errorTextInput);
    // }
  };

  return (
    <form action="" className={scss["form-add-invoice"]}>
      <h3 className={scss["form-add-invoice-title"]}>Dodaj nową fakturę:</h3>
      <div className={scss["form-invoice-data"]}>
        {/* <div className={scss["form-invoice-main-data"]}>
          <SingleInput
            inputName={addInvoiceData.invoice.InvoiceName}
            singleInputValue={inputInvoiceName}
            handleSingleInputChange={handleSingleInputChange}
            inputPlaceholder="Nazwa faktury"
            iconLeft={<FaUser size={16} />}
            singleInputError={inputInvoiceNameError}
            required={false}
            classNameInputContainer={scss["custom-input-container"]}
          />
        </div> */}
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
          <label htmlFor="dateTimePicker">Termin płatności:</label>
          <DateTimePicker
            dateTimePickerDate={dateTimePickerPaymentDate}
            setDateTimePickerDate={setDateTimePickerPaymentDate}
          />
        </div>
        <div>
          <h3 className={scss["title"]}>Dodaj dokumenty:</h3>
          <FormAddInvoiceDocuments
            addInvoiceData={addInvoiceData}
            setAddInvoiceData={setAddInvoiceData}
          />
        </div>
      </div>
    </form>
  );
};
