import { currencyFormater } from "../../../../components/GlobalFunctions/GlobalFunctions";
import scss from "./SeparateDocument.module.scss";

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
  return (
    <tr
      key={document.DocumentId}
      onDoubleClick={() =>
        document.IsDeleted === 0 && handleEditInvoice(document)
      }
    >
      <td>{String(index + 1).padStart(3, "0")}.</td>
      <td>{document.DocumentName}</td>
      <td>{document.MainTypeName}</td>
      <td>{document.TypeName}</td>
      <td>{document.SubtypeName}</td>
      <td>{document.Price}</td>

      {document.IsDeleted === 0 ? (
        <>
          <td className={scss[""]}>
            <button className={scss["edit-button"]} onClick={() => null}>
              Edytuj
            </button>
          </td>
          <td className={scss[""]}>
            <button
              className={scss["delete-button"]}
              onClick={() => handleDeleteRestoreDocument(document)}
            >
              Usuń
            </button>
          </td>
        </>
      ) : (
        <td colSpan={2} className={scss["recover-container"]}>
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
