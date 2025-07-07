// src/ui/pages/SettingsPage/FilesPage/FilesPage.tsx
import { Suspense, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import scss from "./FilesPage.module.scss";
import { useConfig } from "../../../hooks/useConfig";

const FilesPage: React.FC = () => {
  const {
    config,
    dbExists,
    loading,
    error,
    selectDatabasePath,
    selectTemplatesPath,
    selectSavedDocumentsPath,
  } = useConfig();

  const handleSelectDB = async () => {
    const result = await selectDatabasePath();
    if (!result.success) {
      console.log("Anulowano wybór ścieżki bazy danych");
    }
  };

  const handleSelectTemplates = async () => {
    const result = await selectTemplatesPath();
    if (!result.success) {
      console.log("Anulowano wybór katalogu szablonów");
    }
  };

  const handleSelectSavedDocuments = async () => {
    const result = await selectSavedDocumentsPath();
    if (!result.success) {
      console.log("Anulowano wybór katalogu zapisanych dokumentów");
    }
  };

  const [config1, setConfig1] = useState<Config | null>(null);
  const [config2, setConfig2] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [dbExists1, setDbExists1] = useState<boolean>(false);
  const [loading1, setLoading1] = useState<boolean>(false);
  const [error1, setError1] = useState<string | null>(null);
  // Pobieranie konfiguracji przy montowaniu komponentu
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading1(true);
      try {
        const configData = await window.electron.getConfigBilancio();
        setConfig1(configData);
        // const exists = await window.electron.checkDatabaseExists(
        //   configData.dbPath
        // );
        // setDbExists1(exists);
        setError1(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Nieznany błąd";
        setError1(errorMessage);
      } finally {
        setLoading1(false);
      }
    };
    fetchConfig();
  }, []);

  const [dbPathBilancio, setDbPathBilancio] = useState<string | null>(null);
  const [dbPathBilancioError, setDbPathBilancioError] = useState<string | null>(
    null
  );
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading1(true);
      try {
        const configData = await window.electron.getDBbBilancioPath();
        setDbPathBilancio(configData);
        // const exists = await window.electron.checkDatabaseExists(
        //   configData.dbPath
        // );
        // setDbExists1(exists);
        setDbPathBilancioError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "FilesPage Nieznany błąd";
        setDbPathBilancioError(errorMessage);
      } finally {
        setLoading1(false);
      }
    };
    fetchConfig();
  }, []);
  // console.log(
  //   "FilesPage: window.electron.getConfigBilancio1()",
  //   window.electron.getConfigBilancio1("")
  // );
  console.log(
    "FilesPage: window.electron.getConfigBilancio1",
    window.electron.getConfigBilancio1
  );
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await window.electron.getConfigBilancio1("");

        console.log(
          "FilesPage: window.electron.getConfigBilancio1",
          window.electron.getConfigBilancio1
        );
        setConfig2(configData);
        // const exists = await window.electron.checkDatabaseExists(
        //   configData.dbPath
        // );
        // setDbExists1(exists);
        setError2(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "FilesPage Nieznany błąd";
        setError2(errorMessage);
      }
    };
    fetchConfig();
  }, []);
  const [someTemp, setSomeTemp] = useState<JakasFunkcja>();
  const [someTemperror, setSomeTemperror] = useState<string | null>();
  const [someTemp1, setSomeTemp1] = useState<PrzykladowaFunkcjaResult>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await window.electron.przykladowaFunkcja(
          "FilesPage Przykład tekstu",
          10
        );
        setSomeTemp(result);
      } catch (err) {
        console.error(
          "FilesPage przykladowaFunkcja() Błąd podczas pobierania danych:",
          err
        );
        const errorMessage =
          err instanceof Error ? err.message : "Nieznany błąd";
        setSomeTemperror(errorMessage || "przykladowaFunkcja Nieznany błąd");
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await window.electron.przykladowaFunkcja2(
          "Przykład tekstu2",
          20
        );
        setSomeTemp1(result);
      } catch (err) {
        console.error("FilesPage Błąd podczas pobierania danych:", err);
      }
    };

    fetchData();
  }, []);

  const [checkDatabase, setcheckDatabase] = useState<boolean>();
  const [checkDatabaseError, setcheckDatabaseError] = useState<string | null>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await window.electron.checkDatabaseExists(
          dbPathBilancio || ""
        );
        setcheckDatabase(result);
      } catch (err) {
        console.error(
          "FilesPage checkDatabaseExists() Błąd podczas pobierania danych:",
          err
        );
        const errorMessage =
          err instanceof Error ? err.message : "FilesPage Nieznany błąd";
        setcheckDatabaseError(
          errorMessage || "FilesPage checkDatabaseExists Nieznany błąd"
        );
      }
    };

    fetchData();
  }, [dbPathBilancio]);
  return (
    <div className={scss["files-page"]}>
      <h2>Settings - Files</h2>
      <h3>Tu powinien być tekst: {JSON.stringify(someTemp)}</h3>
      <h3>error: {someTemperror}</h3>
      <h3>Tu powinien być status: {someTemp1?.status}</h3>
      {someTemp1?.status === "sukces" ? (
        <h3>
          Tu powinny być dane: {someTemp1.dane.jakisTekst},{" "}
          {someTemp1.dane.jakisNumer}
        </h3>
      ) : (
        <h3>Błąd: {someTemp1?.komunikat}</h3>
      )}
      <div>
        <p>{JSON.stringify(config1)}</p>
        <p>Error: {error1}</p>
      </div>
      <div>
        <p>dbPathBilancio {JSON.stringify(dbPathBilancio)}</p>
        <p>dbPathBilancio Error: {dbPathBilancioError}</p>
      </div>
      <div>
        <p>checkDatabaseExists {JSON.stringify(checkDatabase)}</p>
        <p>checkDatabaseExists Error: {checkDatabaseError}</p>
      </div>

      <div>
        <p>{JSON.stringify(config2)}</p>
        <p>Error: {error2}</p>
      </div>
      {loading && <p>Ładowanie...</p>}
      {error && <p className={scss.error}>Błąd: {error}</p>}
      {config && (
        <div>
          <div className={scss.path}>
            <p>
              Ścieżka do bazy danych: {config.dbPath}
              <span
                className={scss.status}
                style={{ backgroundColor: dbExists ? "green" : "red" }}
              ></span>
            </p>
            <button onClick={handleSelectDB}>Wybierz bazę danych</button>
          </div>
          <div className={scss.path}>
            <p>
              Ścieżka do szablonów dokumentów: {config.documentTemplatesPath}
            </p>
            <button onClick={handleSelectTemplates}>
              Wybierz katalog szablonów
            </button>
          </div>
          <div className={scss.path}>
            <p>Ścieżka do zapisanych dokumentów: {config.savedDocumentsPath}</p>
            <button onClick={handleSelectSavedDocuments}>
              Wybierz katalog zapisanych dokumentów
            </button>
          </div>
        </div>
      )}
      <Suspense fallback={<div>Ładowanie podstrony...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default FilesPage;
