import React, { ReactNode, useMemo, useState } from "react";
import { ElectronContext } from "./useMainDataContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useAllDocumentsName } from "../../hooks/useAllDocumentName";
import { useAuth } from "../../hooks/useAuth";
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

type Auth = {
  userDb: User | null;
  loadingAuth: boolean;
  errorAuth: string | null;
  autoLogin: () => void;
};
// Typ dla kontekstu
export interface ElectronContextType {
  options: Options; // Obiekt zawierający orientację
  setOptions: React.Dispatch<React.SetStateAction<Options>>; // Funkcja zmiany opcji
  formValuesHomePage: FormValuesHomePage; // Obiekt zawierający wartości formularza
  setFormValuesHomePage: React.Dispatch<
    React.SetStateAction<FormValuesHomePage>
  >;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  dotsNumber: number; // Obiekt zawierający orientację
  setDotsNumber: React.Dispatch<React.SetStateAction<number>>; // Funkcja zmiany opcji
  auth: Auth;

  // Funkcja zmiany opcji
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
      firstDate: new Date(Date.UTC(new Date().getFullYear(), 0, 1)),
      // firstDate: new Date(Date.UTC(2010, 0, 1)),
      secondDate: new Date(Date.UTC(new Date().getFullYear(), 11, 31)),
      isDeleted: 0,
    });

  const allDocumentsData = useAllDocumentsName();
  // Wartość kontekstu (obiekt z opcjami)
  // Użycie hooka useUsers
  const auth = useAuth();
  const [dotsNumber, setDotsNumber] = useState<number>(0); // Domyślna liczba kropek
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  // const value: ElectronContextType = {
  //   options,
  //   setOptions,
  //   formValuesHomePage,
  //   setFormValuesHomePage,
  //   dotsNumber,
  //   setdotsNumber,
  //   auth,
  //   // allDocumentsData,
  // };
  const value: ElectronContextType = useMemo(
    () => ({
      options,
      setOptions,
      formValuesHomePage,
      setFormValuesHomePage,
      page,
      setPage,
      rowsPerPage,
      setRowsPerPage,
      dotsNumber,
      setDotsNumber,
      auth,
      // allDocumentsData,
    }),
    [
      options,
      setOptions,
      formValuesHomePage,
      setFormValuesHomePage,
      page,
      setPage,
      rowsPerPage,
      setRowsPerPage,
      dotsNumber,
      setDotsNumber,
      auth /*, allDocumentsData*/,
    ]
  );
  return (
    <ElectronContext.Provider value={value}>
      {children}
    </ElectronContext.Provider>
  );
};
