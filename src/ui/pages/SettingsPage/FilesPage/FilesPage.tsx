// import { useConfig } from "../../../hooks/useConfig";
import scss from "./FilesPage.module.scss";

const FilesPage: React.FC = () => {
  // const {
  //   config,
  //   dbExists,
  //   loading,
  //   error,
  //   selectDatabasePath,
  //   selectTemplatesPath,
  //   selectSavedDocumentsPath,
  // } = useConfig();

  // const handleSelectDB = async () => {
  //   const result = await selectDatabasePath();
  //   if (!result.success) {
  //     console.log("Anulowano wybór ścieżki bazy danych");
  //   }
  // };

  // const handleSelectTemplates = async () => {
  //   const result = await selectTemplatesPath();
  //   if (!result.success) {
  //     console.log("Anulowano wybór katalogu szablonów");
  //   }
  // };

  // const handleSelectSavedDocuments = async () => {
  //   const result = await selectSavedDocumentsPath();
  //   if (!result.success) {
  //     console.log("Anulowano wybór katalogu zapisanych dokumentów");
  //   }
  // };

  return (
    <div className={scss["files-page-container"]}>
      {/* {config && (
        <>
          <div className={scss["path-container"]}>
            <button
              className={scss["button-show-dialog"]}
              onClick={handleSelectDB}
            >
              Wybierz bazę danych
            </button>
            <p
              className={`${scss["path"]} ${
                !dbExists?.status && scss["database-status"]
              }`}
            >
              {config.dbPath}
            </p>
          </div>
          <div className={scss["path-container"]}>
            <button
              className={scss["button-show-dialog"]}
              onClick={handleSelectTemplates}
            >
              Wybierz katalog szablonów
            </button>
            <p className={scss["path"]}>{config.documentTemplatesPath}</p>
          </div>
          <div className={scss["path-container"]}>
            <button
              className={scss["button-show-dialog"]}
              onClick={handleSelectSavedDocuments}
            >
              Wybierz katalog zapisanych dokumentów
            </button>
            <p className={scss["path"]}>{config.savedDocumentsPath}</p>
          </div>
        </>
      )} */}
    </div>
  );
};

export default FilesPage;
