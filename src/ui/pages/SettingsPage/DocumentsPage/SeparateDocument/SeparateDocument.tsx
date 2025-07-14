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
  const handleInputChange = (field: keyof AllDocumentsName, value: string) => {
    // if (field === "number" && !isValidPhoneNumber(value)) {
    //  const errorMessage = langDictionary.errorPhoneNumberRegex[
    //   currentLanguage
    //  ].replace("{value}", value.slice(-1));

    //  toast.error(errorMessage, {
    //   position: "top-center",
    //   duration: 4000,
    //  });
    //  return;
    // }
    console.log("handleInputChange: ", field, value);
    setEditedDocument((prevDokument) => ({ ...prevDokument, [field]: value }));
  };
  return (
    <tr
      key={document.AllDocumentsId}
      onDoubleClick={() =>
        document.IsDeleted === 0 && handleEditInvoice(document)
      }
      className={scss["row-container"]}
    >
      <td className={`${scss["cell"]} `}>
        {String(index + 1).padStart(3, "0")}. {editId}{" "}
        {document.AllDocumentsId.toString()}
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
            handleSingleInputChange={(e) =>
              handleInputChange(
                e.target.name as keyof AllDocumentsName,
                e.target.value
              )
            }
            inputPlaceholder="Nazwa dokumentu ..."
            // singleInputError={inputInvoiceNameError}
            required={true}
            classNameInputContainer={scss["custom-input-container"]}
          />
        ) : (
          <>{document.DocumentName}</>
        )}
      </td>
      {/* <td>{document.DocumentName}</td> */}
      <td
        className={`${scss["cell"]} ${
          document.IsDeleted === 1 && scss["cell-delete"]
        }`}
      >
        {document.MainTypeName}
      </td>
      <td
        className={`${scss["cell"]} ${
          document.IsDeleted === 1 && scss["cell-delete"]
        }`}
      >
        {document.TypeName}
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
  );
};
