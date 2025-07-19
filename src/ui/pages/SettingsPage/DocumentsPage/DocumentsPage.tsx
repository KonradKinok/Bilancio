import scss from "./DocumentsPage.module.scss";
import {
  currencyFormater,
  displayErrorMessage,
} from "../../../components/GlobalFunctions/GlobalFunctions";
import { useAllDocumentsName } from "../../../hooks/useAllDocumentName";
import { SeparateDocument } from "./SeparateDocument/SeparateDocument";
import { use, useEffect, useState } from "react";
import { useDeleteDocument } from "../../../hooks/useDeleteDocument";
import { useRestoreDocument } from "../../../hooks/useRestoreDocument";
import toast from "react-hot-toast";
import { STATUS } from "../../../../electron/sharedTypes/status";
import { useEditDocument } from "../../../hooks/useEditDocument";

const DocumentsPage: React.FC = () => {
  //Pusty dokument
  const [newDocument, setNewDocument] = useState<AllDocumentsName>({
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
  });

  // Hook do pobierania wszystkich dokumentów
  const allDocumentsData = useAllDocumentsName();
  const {
    data: dataAllDocumentsName,
    loading: loadingAllDocumentsName,
    error: errorAllDocumentsName,
    getAllDocuments,
  } = allDocumentsData;

  //Hook do edytowania dokumentów
  const {
    editDocument,
    data: editData,
    loading: editLoading,
    error: editError,
  } = useEditDocument();

  //Hook do usuwania dokumentów
  const {
    deleteDocument,
    data: deleteData,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteDocument();

  //Hook do przywracania dokumentów
  const {
    restoreDocument,
    data: restoreData,
    loading: restoreLoading,
    error: restoreError,
  } = useRestoreDocument();
  // Stan do przechowywania liczby dokumentów
  const [documentCounts, setDocumentCounts] = useState({
    active: 0,
    deleted: 0,
  });

  const handleSaveEditedDocument = async (
    document: AllDocumentsName,
    onSuccess: () => void
  ) => {
    console.log("handleSaveEditedDocument: Dokument do edycji:", document);
    // if (!document?.AllDocumentsId) return;

    const successText = "Edytowany dokument został pomyślnie zapisany!";
    const errorText = `Nie udało się zapisać edytowanego dokumentu. Spróbuj ponownie.`;

    try {
      const result = await editDocument(document);
      if (result.status === STATUS.Success) {
        getAllDocuments(); // Odśwież listę dokumentów
        toast.success(`${successText}`);
        onSuccess(); // Wywołaj funkcję zwrotną po sukcesie
        // setInvoiceToDelete(null);
        console.log(
          "handleSaveEditedDocument editDocumentt: Dokument edytowany:",
          result.data
        );
        console.log(
          "handleSaveEditedDocument editDocument: Dokument edytowany:",
          deleteData
        );
      } else {
        displayErrorMessage(
          "DocumentsPage",
          "handleSaveEditedDocument",
          `${errorText} ${result.message}`
        );
      }
    } catch (err) {
      displayErrorMessage("DocumentsPage", "handleSaveEditedDocument", err);
    }
  };

  const handleDeleteRestoreDocument = async (document: AllDocumentsName) => {
    if (!document?.AllDocumentsId) return;
    let successText = "",
      errorText = "";

    if (document?.IsDeleted === 0) {
      successText = "Dokument został pomyślnie usunięty!";
      errorText = `Nie udało się usunąć dokumentu. Spróbuj ponownie. ${
        deleteError ? deleteError : ""
      }`;
    } else {
      successText = "Dokument został pomyślnie przywrócony!";
      errorText = `Nie udało się przywrócić dokumentu. Spróbuj ponownie.`;
    }

    try {
      const result = await (document?.IsDeleted === 0
        ? deleteDocument(document.AllDocumentsId)
        : restoreDocument(document.AllDocumentsId));

      if (result.status === STATUS.Success) {
        getAllDocuments(); // Odśwież listę dokumentów
        toast.success(successText);
      } else {
        displayErrorMessage(
          "DocumentsPage",
          "handleDeleteRestoreDocument",
          `${errorText} ${result.message}`
        );
      }
    } catch (err) {
      // displayErrorMessage("DocumentsPage", "handleDeleteRestoreDocument", err);
    }
  };

  useEffect(() => {
    if (dataAllDocumentsName) {
      const counts = dataAllDocumentsName?.reduce(
        (acc, item) => ({
          active: acc.active + (item.IsDeleted == 0 ? 1 : 0),
          deleted: acc.deleted + (item.IsDeleted == 1 ? 1 : 0),
        }),
        { active: 0, deleted: 0 } // Initial value
      );
      setDocumentCounts(counts);
    }
  }, [dataAllDocumentsName]);

  return (
    <div className={scss["documentsPage-main-container"]}>
      <div>
        <table className={scss["table"]}>
          <thead>
            <tr>
              <th>Lp.</th>
              <th>Nazwa dokumentu</th>
              <th>Główny typ dokumentu</th>
              <th>Typ dokumentu</th>
              <th>Podtyp dokumentu</th>
              <th>Cena</th>
              <th colSpan={2}>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {dataAllDocumentsName &&
              dataAllDocumentsName.length > 0 &&
              dataAllDocumentsName.map((document, index) => {
                return (
                  <SeparateDocument
                    key={document.AllDocumentsId}
                    document={document}
                    index={index}
                    saveEditedDocument={handleSaveEditedDocument}
                    handleDeleteRestoreDocument={handleDeleteRestoreDocument}
                  />
                );
              })}
          </tbody>
        </table>
        <div className={scss["maintable-footer-container"]}>
          <p>Aktywne: {documentCounts?.active}</p>
          <p>Usunięte: {documentCounts?.deleted}</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
