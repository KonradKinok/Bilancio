import React, { ReactNode, useState } from "react";
import { ElectronContext } from "./useOptionsImage";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useAllDocumentsName } from "../../hooks/useAllDocumentName";
type AllDocumentsNameHook = {
  data: AllDocumentsName[] | null;
  loading: boolean;
  error: string | null;
};

// type AllDocumentsName = {
//   DocumentId: number;
//   DocumentName: string;
//   MainTypeId: number | null;
//   MainTypeName: string;
//   TypeId: number | null;
//   TypeName: string;
//   SubtypeId: number | null;
//   SubtypeName: string;
//   Price: number;
// };
export interface Options {
  orientation: string;
  color: string;
}

// Typ dla kontekstu
export interface ElectronContextType {
  options: Options; // Obiekt zawierający orientację
  setOptions: React.Dispatch<React.SetStateAction<Options>>; // Funkcja zmiany opcji
  formValuesHomePage: FormValuesHomePage; // Obiekt zawierający orientację
  setFormValuesHomePage: React.Dispatch<
    React.SetStateAction<FormValuesHomePage>
  >; // Funkcja zmiany opcji
  // allDocumentsData: AllDocumentsNameHook;
}
// Typ dla propsów w providerze
interface ElectronProviderProps {
  children: ReactNode;
}

// Komponent dostawcy kontekstu
export const ElectronProvider: React.FC<ElectronProviderProps> = ({
  children,
}) => {
  const [options, setOptions] = useLocalStorage(
    { orientation: "", color: "" }, // Wartość początkowa
    "__options_storage_key" // Klucz w localStorage
  );

  const [formValuesHomePage, setFormValuesHomePage] =
    useState<FormValuesHomePage>({
      // firstDate: new Date(Date.UTC(new Date().getFullYear(), 0, 1)),
      firstDate: new Date(Date.UTC(2010, 0, 1)),
      secondDate: new Date(Date.UTC(new Date().getFullYear(), 11, 31)),
      isDeleted: 0,
    });

  const allDocumentsData = useAllDocumentsName();
  // Wartość kontekstu (obiekt z opcjami)
  const value: ElectronContextType = {
    options,
    setOptions,
    formValuesHomePage,
    setFormValuesHomePage,
    // allDocumentsData,
  };

  return (
    <ElectronContext.Provider value={value}>
      {children}
    </ElectronContext.Provider>
  );
};
