import { useState } from "react";
import { currencyFormater } from "../../../../components/GlobalFunctions/GlobalFunctions";
import scss from "./SeparateDocument.module.scss";
import { spacing } from "react-select/dist/declarations/src/theme";
import { TextInput } from "../../../../components/TextInput/TextInput";

interface SeparateDocumentProps {
  document: AllDocumentsName;
  index: number;
  handleEditInvoice: (document: AllDocumentsName) => void;
  handleDeleteRestoreDocument: (document: AllDocumentsName) => void;
}

export const SeparateDocument: React.FC<SeparateDocumentProps> = ({
  document,
  index,
  handleEditInvoice,
  handleDeleteRestoreDocument,
}) => {
  const [editId, setEditId] = useState<string | null>(null);
  const [editedDocument, setEditedDocument] =
    useState<AllDocumentsName>(document);
  const [originalDokument, setOriginalDocument] =
    useState<AllDocumentsName>(document);

  //input errors
  const [inputDocumentNameError, setInputDocumentNameError] =
    useState<string>("");
  const [inputMainTypeNameError, setInputMainTypeNameError] =
    useState<string>("");
  const [inputTypeNameError, setInputTypeNameError] = useState<string>("");
  const [inputSubtypeNameError, setInputSubtypeNameError] =
    useState<string>("");

  const handleEditClick = () => {
    if (editId === document.AllDocumentsId.toString()) {
      // editContact(editedContact);
      setEditId(null);
      // setEditId(document.AllDocumentsId.toString());
    } else {
      setEditId(document.AllDocumentsId.toString());
      setOriginalDocument(document);
    }
    console.log("handleEditClick: ", { editId }, { document });
  };

  const handleSingleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentName = event.target.name as keyof AllDocumentsName;
    let currentValue: string | number = event.target.value;
    let errorTextInput = "";
    if (currentName === "DocumentName") {
      if (!currentValue.trim()) {
        errorTextInput = "Musisz wypełnić to pole";
      }
      setInputDocumentNameError(errorTextInput);
    }
    if (currentName === "MainTypeName") {
      if (!currentValue.trim()) {
        errorTextInput = "Musisz wypełnić to pole";
      }
      setInputMainTypeNameError(errorTextInput);
    }
    if (currentName === "TypeName") {
      if (currentValue.trim() && editedDocument.MainTypeName === "") {
        errorTextInput = "Musisz wypełnić pole MainTypeName";
      }
      setInputTypeNameError(errorTextInput);
    }
    if (currentName === "SubtypeName") {
      if (!currentValue.trim()) {
        errorTextInput = "Musisz wypełnić to pole";
      }
      setInputSubtypeNameError(errorTextInput);
    }
    if (currentName === "Price") {
      currentValue = parseFloat(currentValue) || 0; // Konwersja na liczbę
    }
    setEditedDocument((prevDokument) => ({
      ...prevDokument,
      [currentName]: currentValue,
    }));
    console.log("handleInputChange: ", editedDocument);
  };
  return (
    <>
      <tr
        key={document.AllDocumentsId}
        onDoubleClick={() =>
          document.IsDeleted === 0 && handleEditInvoice(document)
        }
        className={scss["row-container"]}
      >
        <td className={`${scss["cell"]} `}>
          {String(index + 1).padStart(3, "0")}.
        </td>
        <td
          className={`${scss["cell"]} ${
            document.IsDeleted === 1 && scss["cell-delete"]
          }`}
        >
          {editId === String(editedDocument.AllDocumentsId) ? (
            <TextInput
              inputName="DocumentName"
              singleInputValue={editedDocument.DocumentName}
              handleSingleInputChange={handleSingleInputChange}
              inputPlaceholder="Nazwa dokumentu ..."
              singleInputError={inputDocumentNameError}
              required={true}
              classNameInputContainer={scss["custom-input-container"]}
            />
          ) : (
            <>{document.DocumentName}</>
          )}
        </td>

        <td
          className={`${scss["cell"]} ${
            document.IsDeleted === 1 && scss["cell-delete"]
          }`}
        >
          {editId === String(editedDocument.AllDocumentsId) ? (
            <TextInput
              inputName="MainTypeName"
              singleInputValue={editedDocument.MainTypeName}
              handleSingleInputChange={handleSingleInputChange}
              inputPlaceholder="MainTypeName ..."
              singleInputError={inputMainTypeNameError}
              required={false}
              classNameInputContainer={scss["custom-input-container"]}
            />
          ) : (
            <>{document.MainTypeName}</>
          )}
        </td>

        <td
          className={`${scss["cell"]} ${
            document.IsDeleted === 1 && scss["cell-delete"]
          }`}
        >
          {editId === String(editedDocument.AllDocumentsId) ? (
            <TextInput
              inputName="TypeName"
              singleInputValue={editedDocument.TypeName}
              handleSingleInputChange={handleSingleInputChange}
              inputPlaceholder="TypeName ..."
              singleInputError={inputTypeNameError}
              required={false}
              classNameInputContainer={scss["custom-input-container"]}
            />
          ) : (
            <>{document.TypeName}</>
          )}
        </td>

        <td
          className={`${scss["cell"]} ${
            document.IsDeleted === 1 && scss["cell-delete"]
          }`}
        >
          {document.SubtypeName}
        </td>
        <td
          className={`${scss["cell"]} ${
            document.IsDeleted === 1 && scss["cell-delete"]
          }`}
        >
          {document.Price}
        </td>

        {document.IsDeleted === 0 ? (
          <>
            <td className={scss["cell"]}>
              {!editId ? (
                <button
                  className={scss["edit-button"]}
                  onClick={() => handleEditClick()}
                >
                  Edytuj
                </button>
              ) : (
                <button
                  className={scss["save-button"]}
                  onClick={() => handleEditClick()}
                >
                  Zapisz
                </button>
              )}
            </td>

            <td className={scss["cell"]}>
              {!editId ? (
                <button
                  className={scss["delete-button"]}
                  onClick={() => handleDeleteRestoreDocument(document)}
                >
                  Usuń
                </button>
              ) : (
                <button
                  className={scss["cancel-button"]}
                  onClick={() => handleEditClick()}
                >
                  Anuluj
                </button>
              )}
            </td>
          </>
        ) : (
          <td
            colSpan={2}
            className={`${scss["cell"]} ${scss["recover-container"]}`}
          >
            <button
              className={scss["delete-button"]}
              onClick={() => handleDeleteRestoreDocument(document)}
            >
              Przywróć
            </button>
          </td>
        )}
      </tr>
    </>
  );
};
