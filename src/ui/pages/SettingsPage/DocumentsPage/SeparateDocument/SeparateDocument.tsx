import { useEffect, useState } from "react";
import { currencyFormater } from "../../../../components/GlobalFunctions/GlobalFunctions";
import scss from "./SeparateDocument.module.scss";
import { spacing } from "react-select/dist/declarations/src/theme";
import { TextInput } from "../../../../components/TextInput/TextInput";
import { Tooltip } from "react-tooltip";

interface SeparateDocumentProps {
  isNewDocument?: boolean;
  document?: AllDocumentsName;
  index: number;
  saveEditedDocument: (
    isNewDocument: boolean,
    document: AllDocumentsName,
    onSuccess: () => void
  ) => void;
  handleDeleteRestoreDocument: (document: AllDocumentsName) => void;
  handleIsSaveButtonEnabled: (document: AllDocumentsName) => boolean;
}

const defaultDocument: AllDocumentsName = {
  AllDocumentsId: 0,
  DocumentId: 0,
  DocumentName: "",
  MainTypeId: null,
  MainTypeName: "",
  TypeId: null,
  TypeName: "",
  SubtypeId: null,
  SubtypeName: "",
  Price: 0,
  IsDeleted: 0,
};

export const SeparateDocument: React.FC<SeparateDocumentProps> = ({
  isNewDocument = false,
  document = defaultDocument,
  index,
  saveEditedDocument,
  handleDeleteRestoreDocument,
  handleIsSaveButtonEnabled,
}) => {
  // Domyślny stan

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
  const [inputPriceError, setInputPriceError] = useState<string>("");

  // Synchronizuj stany z propem document, gdy się zmieni
  useEffect(() => {
    setOriginalDocument(document);
    setEditedDocument(document);
  }, [document]);

  const handleEditCancelClick = () => {
    if (editId === document.AllDocumentsId.toString()) {
      setEditId(null);
    } else {
      setEditId(document.AllDocumentsId.toString());
      setEditedDocument(originalDokument);
      setInputDocumentNameError("");
      setInputMainTypeNameError("");
      setInputTypeNameError("");
      setInputSubtypeNameError("");
      setInputPriceError("");
    }
  };
  const isSaveButtonDisabled = () => {
    if (
      !editedDocument.DocumentName.trim() ||
      inputDocumentNameError ||
      inputMainTypeNameError ||
      inputTypeNameError ||
      inputSubtypeNameError ||
      inputPriceError
    )
      return true;
    return handleIsSaveButtonEnabled(editedDocument);
  };
  const handleSaveEditedDocument = () => {
    // Wywołaj saveEditedDocument i przekaż funkcję onSuccess
    saveEditedDocument(isNewDocument, editedDocument, () => {
      setEditId(null); // Aktualizacja stanu po sukcesie
      setOriginalDocument(editedDocument); // Aktualizacja stanu po sukcesie
    });
  };

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
      if (!currentValue.trim() && !editedDocument.TypeName) {
        errorTextInput = "Musisz wypełnić pole MainTypeName";
        setInputMainTypeNameError(errorTextInput);
      } else {
        setInputMainTypeNameError("");
      }
    }
    if (currentName === "TypeName") {
      if (currentValue.trim() && !editedDocument.MainTypeName) {
        errorTextInput = "Musisz wypełnić pole MainTypeName";
        setInputMainTypeNameError(errorTextInput);
      } else if (!currentValue.trim() && editedDocument.SubtypeName) {
        errorTextInput = "Musisz wypełnić pole TypeName";
        setInputTypeNameError(errorTextInput);
      } else {
        setInputMainTypeNameError("");
        setInputTypeNameError("");
      }
    }
    if (currentName === "SubtypeName") {
      if (currentValue.trim() && !editedDocument.TypeName) {
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
    <tr
      key={document.AllDocumentsId}
      onDoubleClick={() => document.IsDeleted === 0 && handleEditCancelClick()}
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
            singleInputValue={editedDocument.DocumentName ?? ""}
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
            singleInputValue={editedDocument.MainTypeName ?? ""}
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
            singleInputValue={editedDocument.TypeName ?? ""}
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
        {editId === String(editedDocument.AllDocumentsId) ? (
          <TextInput
            inputName="SubtypeName"
            singleInputValue={editedDocument.SubtypeName ?? ""}
            handleSingleInputChange={handleSingleInputChange}
            inputPlaceholder="SubtypeName ..."
            singleInputError={
              inputSubtypeNameError ? inputSubtypeNameError : ""
            }
            required={false}
            classNameInputContainer={scss["custom-input-container"]}
          />
        ) : (
          <>{document.SubtypeName}</>
        )}
      </td>

      <td
        className={`${scss["cell"]} ${
          document.IsDeleted === 1 && scss["cell-delete"]
        }`}
      >
        {editId === String(editedDocument.AllDocumentsId) ? (
          <TextInput
            inputName="Price"
            singleInputValue={editedDocument.Price.toString()}
            handleSingleInputChange={handleSingleInputChange}
            inputPlaceholder="Cena ..."
            singleInputError={inputPriceError}
            required={true}
            classNameInputContainer={scss["custom-input-container"]}
          />
        ) : (
          <>{document.Price > 0 ? document.Price : ""}</>
        )}
      </td>

      {isNewDocument ? (
        !editId ? (
          <td
            colSpan={2}
            className={`${scss["cell"]} ${scss["recover-container"]}`}
          >
            <button
              className={scss["edit-button"]}
              onClick={() => handleEditCancelClick()}
            >
              Dodaj nowy
            </button>
          </td>
        ) : (
          <>
            <td className={scss["cell"]}>
              <button
                className={scss["save-button"]}
                disabled={isSaveButtonDisabled()}
                onClick={() => handleSaveEditedDocument()}
                data-tooltip-id="toolTipSeparateDocumentButtonSave"
                data-tooltip-html={toolTipSeparateDocumentButtonSave(
                  isNewDocument
                )}
              >
                Zapisz
              </button>
            </td>

            <td className={scss["cell"]}>
              <button
                className={scss["cancel-button"]}
                onClick={() => handleEditCancelClick()}
              >
                Anuluj
              </button>
            </td>
          </>
        )
      ) : document.IsDeleted === 0 ? (
        <>
          <td className={scss["cell"]}>
            {!editId ? (
              <button
                className={scss["edit-button"]}
                onClick={() => handleEditCancelClick()}
              >
                Korekta
              </button>
            ) : (
              <button
                className={scss["save-button"]}
                disabled={isSaveButtonDisabled()}
                onClick={() => handleSaveEditedDocument()}
                data-tooltip-id={
                  isSaveButtonDisabled()
                    ? "toolTipSeparateDocumentButtonSave"
                    : undefined
                }
                data-tooltip-html={toolTipSeparateDocumentButtonSave(
                  isNewDocument
                )}
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
                onClick={() => handleEditCancelClick()}
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
  );
};

function toolTipSeparateDocumentButtonSave(isNewDocument: boolean) {
  const text = `Przycisk zapisu dokumentu zostanie uaktywniony
  po prawidłowym uzupełnieniu pól formularza ${
    !isNewDocument ? " i wykryciu zmian w dokumencie" : ""
  }.`;
  return text.replace(/\n/g, "<br/>");
}
