import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import toast from "react-hot-toast";
import { STATUS } from "../../../../electron/sharedTypes/status";
import { useMainDataContext } from "../../../components/Context/useMainDataContext";
import { useAllDocumentsName } from "../../../hooks/useAllDocumentName";
import { useDeleteDocument } from "../../../hooks/useDeleteDocument";
import { useRestoreDocument } from "../../../hooks/useRestoreDocument";
import { useUpdateDocument } from "../../../hooks/useUpdateDocument";
import { useAddDocument } from "../../../hooks/useAddDocument";
import { displayErrorMessage } from "../../../components/GlobalFunctions/GlobalFunctions";
import { SeparateDocument } from "./SeparateDocument/SeparateDocument";
import { IconInfo } from "../../../components/IconInfo/IconInfo";
import { ConditionalWrapper } from "../../../components/ConditionalWrapper/ConditionalWrapper";
import scss from "./DocumentsPage.module.scss";

const DocumentsPage: React.FC = () => {
  const { options } = useMainDataContext();
  // Hook do pobierania wszystkich dokumentów
  const {
    data: dataAllDocumentsName,
    loading: loadingDataAllDocumentsName,
    getAllDocuments,
  } = useAllDocumentsName();

  //Hook do edytowania dokumentów
  const { addDocument } = useAddDocument();

  //Hook do edytowania dokumentów
  const { updateDocument } = useUpdateDocument();

  //Hook do usuwania dokumentów
  const { deleteDocument } = useDeleteDocument();

  //Hook do przywracania dokumentów
  const { restoreDocument } = useRestoreDocument();

  // Stan do przechowywania liczby dokumentów
  const [documentCounts, setDocumentCounts] = useState({
    active: 0,
    deleted: 0,
  });

  const handleIsSaveButtonEnabled = (editDocument: AllDocumentsName) => {
    if (!dataAllDocumentsName || !Array.isArray(dataAllDocumentsName)) {
      return false; // Zwraca false, jeśli dataAllDocumentsName jest undefined, null lub nie jest tablicą
    }
    return dataAllDocumentsName.some((doc) => {
      // Sprawdzanie DocumentName
      const docName = doc.DocumentName?.trim().toLowerCase() ?? "";
      const editDocName = editDocument.DocumentName?.trim().toLowerCase() ?? "";

      // Sprawdzanie MainTypeName
      const docMainType = doc.MainTypeName?.trim().toLowerCase() || null; // Konwersja "" na null
      const editMainType =
        editDocument.MainTypeName?.trim().toLowerCase() || null; // Konwersja "" na null

      // Sprawdzanie TypeName
      const docType = doc.TypeName?.trim().toLowerCase() || null; // Konwersja "" na null
      const editType = editDocument.TypeName?.trim().toLowerCase() || null; // Konwersja "" na null

      // Sprawdzanie SubtypeName
      const docSubtype = doc.SubtypeName?.trim().toLowerCase() || null; // Konwersja "" na null
      const editSubtype =
        editDocument.SubtypeName?.trim().toLowerCase() || null; // Konwersja "" na null

      // Sprawdzanie Price
      const docPrice = doc.Price ?? null;
      const editPrice = editDocument.Price ?? null;

      return (
        docName == editDocName &&
        docMainType == editMainType &&
        docType == editType &&
        docSubtype == editSubtype &&
        docPrice == editPrice
      );
    });
  };

  //Zapisanie edytowanego dokumentu
  const handleSaveEditedDocument = async (
    isNewDocument: boolean,
    document: AllDocumentsName,
    onSuccess: () => void
  ) => {
    const documentName = `${document.DocumentName} ${
      document.MainTypeName ? document.MainTypeName : ""
    } ${document.TypeName ? document.TypeName : ""} ${
      document.SubtypeName ? document.SubtypeName : ""
    }`.trim();
    const successText = `${
      isNewDocument ? "Nowy" : "Edytowany"
    } dokument ${documentName} został pomyślnie zapisany.`;
    const errorText = `Nie udało się zapisać ${
      isNewDocument ? "nowego" : "edytowanego"
    } dokumentu ${documentName}.`;

    try {
      const result = await (isNewDocument
        ? addDocument(document)
        : updateDocument(document));
      if (result.status === STATUS.Success) {
        getAllDocuments(); // Odświeżenie listy dokumentów
        toast.success(`${successText}`);
        onSuccess(); // Wywołanie funkcji zwrotnej po sukcesie
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

  //Usuwanie/Przywracanie dokumentu
  const handleDeleteRestoreDocument = async (document: AllDocumentsName) => {
    if (!document?.AllDocumentsId) return;
    let successText = "",
      errorText = "";
    const documentName = `${document.DocumentName} ${
      document.MainTypeName ? document.MainTypeName : ""
    } ${document.TypeName ? document.TypeName : ""} ${
      document.SubtypeName ? document.SubtypeName : ""
    }`.trim();
    if (document?.IsDeleted === 0) {
      successText = `Dokument ${documentName} został pomyślnie usunięty.`;
      errorText = `Nie udało się usunąć dokumentu ${documentName}.`;
    } else {
      successText = `Dokument ${documentName} został pomyślnie przywrócony.`;
      errorText = `Nie udało się przywrócić dokumentu ${documentName}.`;
    }

    try {
      const result = await (document?.IsDeleted === 0
        ? deleteDocument(document.AllDocumentsId)
        : restoreDocument(document.AllDocumentsId));

      if (result.status === STATUS.Success) {
        getAllDocuments(); // Odświeżenie listy dokumentów
        toast.success(successText);
      } else {
        displayErrorMessage(
          "DocumentsPage",
          "handleDeleteRestoreDocument",
          `${errorText} ${result.message}`
        );
      }
    } catch (err) {
      displayErrorMessage("DocumentsPage", "handleDeleteRestoreDocument", err);
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
      <IconInfo
        tooltipId="tooltip-formAddInvoice"
        tooltipInfoTextHtml={tooltipInfoDocumentsPage()}
      />
      <ConditionalWrapper isLoading={loadingDataAllDocumentsName}>
        <div>
          <table
            className={`${scss["table"]} ${
              scss[`${options.fontSize.en}-font`]
            }`}
          >
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
              <SeparateDocument
                isNewDocument={true}
                index={-1}
                saveEditedDocument={handleSaveEditedDocument}
                handleDeleteRestoreDocument={handleDeleteRestoreDocument}
                handleIsSaveButtonEnabled={handleIsSaveButtonEnabled}
              />
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
                      handleIsSaveButtonEnabled={handleIsSaveButtonEnabled}
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
      </ConditionalWrapper>
      <Tooltip
        id="toolTipSeparateDocumentButtonSave"
        className={scss["tooltip"]}
      />
    </div>
  );
};

export default DocumentsPage;

function tooltipInfoDocumentsPage() {
  const text = `📄 Strona dokumentów.
  Przycisk "Dodaj nowy" umożliwia dodanie nowego dokumentu.
  Przycisk "Edytuj" umożliwia edycję istniejącego dokumentu.
  Przycisk "Usuń" umożliwia usunięcie dokumentu.
  Przycisk "Zapisz" umożliwia zapisanie nowego lub edytowanego dokumentu.
  Przycisk "Przywróć" umożliwia przywrócenie usuniętego dokumentu.
 ⚠️ Nazwy dokumentów nie mogą się powtarzać.`;
  return text.replace(/\n/g, "<br/>");
}
