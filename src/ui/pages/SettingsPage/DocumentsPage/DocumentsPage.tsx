import scss from "./DocumentsPage.module.scss";
import { currencyFormater } from "../../../components/GlobalFunctions/GlobalFunctions";
import { useAllDocumentsName } from "../../../hooks/useAllDocumentName";
import { SeparateDocument } from "./SeparateDocument/SeparateDocument";
import { use, useEffect, useState } from "react";
import { useDeleteDocument } from "../../../hooks/useDeleteDocument";
import { useRestoreDocument } from "../../../hooks/useRestoreDocument";
import toast from "react-hot-toast";
import { STATUS } from "../../../../electron/sharedTypes/status";
const DocumentsPage: React.FC = () => {
  //Nazwy wszystkich dokumentów
  const allDocumentsData = useAllDocumentsName();
  const {
    data: dataAllDocumentsName,
    loading: loadingAllDocumentsName,
    error: errorAllDocumentsName,
    getAllDocuments,
  } = allDocumentsData;

  const {
    deleteDocument,
    data: deleteData,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteDocument();

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

  const handleDeleteRestoreDocument = async (document: AllDocumentsName) => {
    if (!document?.AllDocumentsId) return;
    let loadingText = "",
      successText = "",
      errorText = "";
    if (document?.IsDeleted === 0) {
      loadingText = "Usuwanie dokumentu...";
      successText = "Dokument został pomyślnie usunięty!";
      errorText =
        deleteError || "Nie udało się usunąć dokumentu. Spróbuj ponownie.";
    } else {
      loadingText = "Przywracanie dokumentu...";
      successText = "Dokument został pomyślnie przywrócony!";
      errorText =
        restoreError || "Nie udało się przywrócić dokumentu. Spróbuj ponownie.";
    }
    try {
      const result = await toast.promise(
        document?.IsDeleted == 0
          ? deleteDocument(document?.AllDocumentsId)
          : restoreDocument(document?.AllDocumentsId),
        {
          loading: `${loadingText}`,
          success: `${successText}`,
          error: `${errorText}`,
        }
      );
      if (result.status === STATUS.Success) {
        getAllDocuments(); // Odśwież listę dokumentów

        // setInvoiceToDelete(null);
        console.log("confirmDeleteDocument: Dokument usunięta:", result.data);
        console.log(
          "confirmDeleteDokument deleteData: Dokument usunięta:",
          deleteData
        );
      }
    } catch (err) {
      console.error("Błąd podczas usuwania/przywracania dokumentu:", err);
    }
  };
  //Edit Invoice
  const handleEditDocument = (document: AllDocumentsName) => {
    console.log("handleEditDocument: ", document);
    // const invoiceData = selectedInvoiceData(invoice);
    // setSelectedInvoice(invoiceData);
    // openModalAddInvoice();
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
                    handleEditInvoice={handleEditDocument}
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
