import { useState, useEffect } from "react";
import { STATUS } from "../../electron/sharedTypes/status";

type Config = {
  dbPath: string;
  documentTemplatesPath: string;
  savedDocumentsPath: string;
};

type DialogResponse = {
  success: boolean;
  path: string | null;
};

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [dbExists, setDbExists] = useState<DatabaseExists>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Pobieranie konfiguracji przy montowaniu komponentu
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const configData = await window.electron.getConfigBilancio();
        setConfig(configData);
        const exists = await window.electron.checkDatabaseExists();
        setDbExists(exists);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Nieznany błąd";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // Funkcja do wyboru ścieżki bazy danych
  const selectDatabasePath = async (): Promise<DialogResponse> => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.electron.openDBDialog();
      if (result.success && result.path) {
        const currentConfig = config || {
          dbPath: '',
          documentTemplatesPath: '',
          savedDocumentsPath: '',
        };
        const newConfig = await window.electron.saveConfig({
          ...currentConfig,
          dbPath: result.path,
        });
        setConfig(newConfig);
        const exists = await window.electron.checkDatabaseExists();
        setDbExists(exists);
        return result;
      }
      return { success: false, path: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Nieznany błąd";
      setError(errorMessage);
      return { success: false, path: null };
    } finally {
      setLoading(false);
    }
  };

  // Funkcja do wyboru katalogu szablonów
  const selectTemplatesPath = async (): Promise<DialogResponse> => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.electron.openTemplatesDialog();
      if (result.success && result.path) {
        const currentConfig = config || {
          dbPath: '',
          documentTemplatesPath: '',
          savedDocumentsPath: '',
        };
        const newConfig = await window.electron.saveConfig({
          ...currentConfig,
          documentTemplatesPath: result.path,
        });
        setConfig(newConfig);
        return result;
      }
      return { success: false, path: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Nieznany błąd";
      setError(errorMessage);
      return { success: false, path: null };
    } finally {
      setLoading(false);
    }
  };

  // Funkcja do wyboru katalogu zapisanych dokumentów
  const selectSavedDocumentsPath = async (): Promise<DialogResponse> => {
    setLoading(true);
    setError(null);
    try {
      const result = await window.electron.openSavedDocumentsDialog();
      if (result.success && result.path) {
        const currentConfig = config || {
          dbPath: '',
          documentTemplatesPath: '',
          savedDocumentsPath: '',
        };
        const newConfig = await window.electron.saveConfig({
          ...currentConfig,
          savedDocumentsPath: result.path,
        });
        setConfig(newConfig);
        return result;
      }
      return { success: false, path: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Nieznany błąd";
      setError(errorMessage);
      return { success: false, path: null };
    } finally {
      setLoading(false);
    }
  };

  return {
    config,
    dbExists,
    loading,
    error,
    selectDatabasePath,
    selectTemplatesPath,
    selectSavedDocumentsPath,
  };
}