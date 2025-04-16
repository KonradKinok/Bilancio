import { useState } from "react";
import { FaUser } from "react-icons/fa";
import scss from "./FormAddInvoice.module.scss";
import { SingleInput } from "../SingleInput/SingleInput";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";

interface FormAddInvoiceProps {
  addInvoiceData: InvoiceSave;
  setAddInvoiceData: React.Dispatch<React.SetStateAction<InvoiceSave>>;
}

export const FormAddInvoice: React.FC<FormAddInvoiceProps> = ({
  addInvoiceData,
  setAddInvoiceData,
}) => {
  const [inputName, setInputName] = useState<string>("");
  const [inputNameError, setInputNameError] = useState<string>("");
  const [dateTimePickerFirstDate, setDateTimePickerFirstDate] =
    useState<Date | null>(new Date(new Date().getFullYear(), 0, 1));
  const [dateTimePickerLastDate, setDateTimePickerLastDate] =
    useState<Date | null>(new Date(new Date().getFullYear(), 11, 31));
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputEmailError, setInputEmailError] = useState<string>("");
  const [inputPhone, setInputPhone] = useState<string>("");
  const [inputPhoneError, setInputPhoneError] = useState<string>("");
  const [inputAddress, setInputAddress] = useState<string>("");
  const [inputAddressError, setInputAddressError] = useState<string>("");
  const [inputNip, setInputNip] = useState<string>("");
  const [inputNipError, setInputNipError] = useState<string>("");

  const handleSingleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentValue = event.target.value;
    const currentName = event.target.name;
    let errorTextInput = "";

    if (currentName === addInvoiceData.invoice.InvoiceName) {
      setInputName(currentValue);
      if (currentValue.length === 1) {
        errorTextInput = "Za mało liter";
      } else if (!currentValue) {
        errorTextInput = "Musisz wypełnić te pole";
      }
      setInputNameError(errorTextInput);
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
        <div>
          <SingleInput
            inputName={addInvoiceData.invoice.InvoiceName}
            singleInputValue={inputName}
            handleSingleInputChange={handleSingleInputChange}
            inputPlaceholder="Enter your name"
            iconLeft={<FaUser size={16} />}
            singleInputError={inputNameError}
            required={false}
            classNameInputContainer={scss["custom-input-container"]}
          />
        </div>
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
      </div>
    </form>
  );
};
