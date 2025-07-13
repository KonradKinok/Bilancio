import scss from "./DocumentsPage.module.scss";
import { currencyFormater } from "../../../components/GlobalFunctions/GlobalFunctions";
import { useAllDocumentsName } from "../../../hooks/useAllDocumentName";
import { SeparateDocument } from "./SeparateDocument/SeparateDocument";
import { use, useEffect, useState } from "react";

const DocumentsPage: React.FC = () => {
  //Nazwy wszystkich dokumentów
  const allDocumentsData = useAllDocumentsName();
  const {
    data: dataAllDocumentsName,
    loading: loadingAllDocumentsName,
    error: errorAllDocumentsName,
    getAllDocuments,
  } = allDocumentsData;

  // Stan do przechowywania liczby dokumentów
  const [documentCounts, setDocumentCounts] = useState({
    active: 0,
    deleted: 0,
  });

  const handleDeleteRestoreDocument = (document: AllDocumentsName) => {
    // setInvoiceToDelete(invoice.InvoiceId);
    //   const invoiceData = selectedInvoiceData(invoice);
    //   setSelectedInvoice(invoiceData);
    //   openModalDeleteConfirm();
    // };
    // const confirmDeleteRestoreInvoice = async () => {
    //   if (!selectedInvoice?.invoice.InvoiceId) return;
    //   let loadingText = "",
    //     successText = "",
    //     errorText = "";
    //   if (selectedInvoice?.invoice.IsDeleted === 0) {
    //     loadingText = "Usuwanie faktury...";
    //     successText = "Faktura została pomyślnie usunięta!";
    //     errorText =
    //       deleteError || "Nie udało się usunąć faktury. Spróbuj ponownie.";
    //   } else {
    //     loadingText = "Przywracanie faktury...";
    //     successText = "Faktura została pomyślnie przywrócona!";
    //     errorText =
    //       restoreError || "Nie udało się przywrócić faktury. Spróbuj ponownie.";
    //   }
    //   try {
    //     const result = await toast.promise(
    //       selectedInvoice?.invoice.IsDeleted == 0
    //         ? deleteInvoice(selectedInvoice?.invoice.InvoiceId)
    //         : restoreInvoice(selectedInvoice?.invoice.InvoiceId),
    //       {
    //         loading: `${loadingText}`,
    //         success: `${successText}`,
    //         error: `${errorText}`,
    //       }
    //     );
    //     if (result.status === STATUS.Success) {
    //       refetchAllInvoices(); // Odśwież listę faktur
    //       closeModalDeleteConfirm();
    //       setSelectedInvoice(undefined);
    //       // setInvoiceToDelete(null);
    //       console.log("confirmDeleteInvoice: Faktura usunięta:", result.data);
    //       console.log(
    //         "confirmDeleteInvoice deleteData: Faktura usunięta:",
    //         deleteData
    //       );
    //     }
    //   } catch (err) {
    //     console.error("Błąd podczas usuwania/przywracania faktury:", err);
    //   }
  };
  //Edit Invoice
  const handleEditInvoice = (invoice: AllDocumentsName) => {
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
                    key={document.DocumentId}
                    document={document}
                    index={index}
                    handleEditInvoice={handleEditInvoice}
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
