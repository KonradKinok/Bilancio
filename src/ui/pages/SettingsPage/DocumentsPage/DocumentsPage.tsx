import scss from "./DocumentsPage.module.scss";
import { currencyFormater } from "../../../components/GlobalFunctions/GlobalFunctions";
import { useAllDocumentsName } from "../../../hooks/useAllDocumentName";

const DocumentsPage: React.FC = () => {
  //Nazwy wszystkich dokumentów
  const allDocumentsData = useAllDocumentsName();
  const {
    data: dataAllDocumentsName,
    loading: loadingAllDocumentsName,
    error: errorAllDocumentsName,
  } = allDocumentsData;

  return (
    <div className={scss[""]}>
      <h2>Dokumenty</h2>
      {dataAllDocumentsName &&
        dataAllDocumentsName.length > 0 &&
        dataAllDocumentsName.map((document, index) => (
          <p key={index}>
            {String(index + 1).padStart(3, "0")}. {document.DocumentName}
            {document.DocumentId} {document.MainTypeName}
            {document.MainTypeId} {document.TypeName}
            {document.TypeId} {document.SubtypeName}
            {document.SubtypeId} {currencyFormater(document.Price)}
          </p>
        ))}
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
    </div>
  );
};

export default DocumentsPage;
