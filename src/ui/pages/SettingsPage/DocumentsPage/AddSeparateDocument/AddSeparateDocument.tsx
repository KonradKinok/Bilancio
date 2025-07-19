import { useState } from "react";
import scss from "./AddSeparateDocument.module.scss";
import { TextInput } from "../../../../components/TextInput/TextInput";

interface AddSeparateDocumentProps {
  newDocument: AllDocumentsName;
  setNewDocument: React.Dispatch<React.SetStateAction<AllDocumentsName>>;
}

export const AddSeparateDocument: React.FC<AddSeparateDocumentProps> = ({
  newDocument,
  setNewDocument,
}) => {
  const [editedDocument, setEditedDocument] =
    useState<AllDocumentsName>(newDocument);
  const [originalDokument, setOriginalDocument] =
    useState<AllDocumentsName>(newDocument);

  //input errors
  const [inputDocumentNameError, setInputDocumentNameError] =
    useState<string>("");
  const [inputMainTypeNameError, setInputMainTypeNameError] =
    useState<string>("");
  const [inputTypeNameError, setInputTypeNameError] = useState<string>("");
  const [inputSubtypeNameError, setInputSubtypeNameError] =
    useState<string>("");
  const [inputPriceError, setInputPriceError] = useState<string>("");

  const handleSingleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentName = event.target.name as keyof AllDocumentsName;
    const currentValue: string | number = event.target.value;
    let errorTextInput = "";
    if (currentName === "DocumentName") {
      if (!currentValue.trim()) {
        errorTextInput = "Musisz wypełnić to pole";
      }
      setInputDocumentNameError(errorTextInput);
    }
    if (currentName === "MainTypeName") {
      if (!currentValue.trim() && editedDocument.TypeName != "") {
        errorTextInput = "Musisz wypełnić pole MainTypeName";
        setInputMainTypeNameError(errorTextInput);
      } else {
        setInputMainTypeNameError("");
      }
    }
    if (currentName === "TypeName") {
      if (currentValue.trim() && editedDocument.MainTypeName == "") {
        errorTextInput = "Musisz wypełnić pole MainTypeName";
        setInputMainTypeNameError(errorTextInput);
      } else if (!currentValue.trim() && editedDocument.SubtypeName != "") {
        errorTextInput = "Musisz wypełnić pole TypeName";
        setInputTypeNameError(errorTextInput);
      } else {
        setInputMainTypeNameError("");
        setInputTypeNameError("");
      }
    }
    if (currentName === "SubtypeName") {
      if (currentValue.trim() && editedDocument.TypeName == "") {
        errorTextInput = "Musisz wypełnić pole TypeName";
        setInputTypeNameError(errorTextInput);
      } else {
        setInputTypeNameError("");
      }
    }
    if (currentName === "Price") {
      const isValidPrice = /^\d*\.?\d*$/.test(currentValue); // Dopuszcza liczby zmiennoprzecinkowe
      if (!currentValue) {
        errorTextInput = "Musisz wypełnić to pole";
      } else if (currentValue.includes(",")) {
        errorTextInput = "Zamiast przecinka użyj kropki";
      } else if (!isValidPrice) {
        errorTextInput = "Wprowadź poprawną liczbę";
      }
      setInputPriceError(errorTextInput);
    }

    setEditedDocument((prevDokument) => ({
      ...prevDokument,
      [currentName]: currentValue,
    }));
    console.log(
      "handleInputChange: ",
      currentValue,
      editedDocument.MainTypeName,
      inputMainTypeNameError
    );
  };

  return (
    <tr key={newDocument.AllDocumentsId} className={scss["row-container"]}>
      <td className={`${scss["cell"]} `}>000.</td>
      <td
        className={`${scss["cell"]} ${
          newDocument.IsDeleted === 1 && scss["cell-delete"]
        }`}
      >
        <TextInput
          inputName="DocumentName"
          singleInputValue={editedDocument.DocumentName}
          handleSingleInputChange={handleSingleInputChange}
          inputPlaceholder="Nazwa dokumentu ..."
          singleInputError={inputDocumentNameError}
          required={true}
          classNameInputContainer={scss["custom-input-container"]}
        />
      </td>

      <td
        className={`${scss["cell"]} ${
          newDocument.IsDeleted === 1 && scss["cell-delete"]
        }`}
      >
        <TextInput
          inputName="MainTypeName"
          singleInputValue={editedDocument.MainTypeName}
          handleSingleInputChange={handleSingleInputChange}
          inputPlaceholder="MainTypeName ..."
          singleInputError={inputMainTypeNameError}
          required={false}
          classNameInputContainer={scss["custom-input-container"]}
        />
      </td>

      <td
        className={`${scss["cell"]} ${
          newDocument.IsDeleted === 1 && scss["cell-delete"]
        }`}
      >
        <TextInput
          inputName="TypeName"
          singleInputValue={editedDocument.TypeName}
          handleSingleInputChange={handleSingleInputChange}
          inputPlaceholder="TypeName ..."
          singleInputError={inputTypeNameError}
          required={false}
          classNameInputContainer={scss["custom-input-container"]}
        />
      </td>

      <td
        className={`${scss["cell"]} ${
          newDocument.IsDeleted === 1 && scss["cell-delete"]
        }`}
      >
        <TextInput
          inputName="SubtypeName"
          singleInputValue={editedDocument.SubtypeName}
          handleSingleInputChange={handleSingleInputChange}
          inputPlaceholder="SubtypeName ..."
          singleInputError={inputSubtypeNameError}
          required={false}
          classNameInputContainer={scss["custom-input-container"]}
        />
      </td>

      <td
        className={`${scss["cell"]} ${
          newDocument.IsDeleted === 1 && scss["cell-delete"]
        }`}
      >
        <TextInput
          inputName="Price"
          singleInputValue={editedDocument.Price.toString()}
          handleSingleInputChange={handleSingleInputChange}
          inputPlaceholder="Cena ..."
          singleInputError={inputPriceError}
          required={false}
          classNameInputContainer={scss["custom-input-container"]}
        />
      </td>

      <td className={scss["cell"]}>
        <button
          className={scss["save-button"]}
          // onClick={() => handleEditCancelClick()}
        >
          Zapisz
        </button>
      </td>

      <td className={scss["cell"]}>
        <button
          className={scss["cancel-button"]}
          // onClick={() => handleEditCancelClick()}
        >
          Anuluj
        </button>
      </td>
    </tr>
  );
};
