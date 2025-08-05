import React, { ReactNode, useState } from "react";
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
  windowsUserName: WindowsUsername | null;
  userDb: User | null;
  loading: boolean;
  error: string | null;
  autoLogin: () => void;
  loginFunction: () => void;
  logoutFunction: () => void;
  windowsUserNameFunction: () => void;
};
// Typ dla kontekstu
export interface ElectronContextType {
  options: Options; // Obiekt zawierający orientację
  setOptions: React.Dispatch<React.SetStateAction<Options>>; // Funkcja zmiany opcji
  dotsNumber: number; // Obiekt zawierający orientację
  setdotsNumber: React.Dispatch<React.SetStateAction<number>>; // Funkcja zmiany opcji
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
      // firstDate: new Date(Date.UTC(new Date().getFullYear(), 0, 1)),
      firstDate: new Date(Date.UTC(2010, 0, 1)),
      secondDate: new Date(Date.UTC(new Date().getFullYear(), 11, 31)),
      isDeleted: 0,
    });

  const allDocumentsData = useAllDocumentsName();
  // Wartość kontekstu (obiekt z opcjami)
  // Użycie hooka useUsers
  const auth = useAuth();
  const [dotsNumber, setdotsNumber] = useState<number>(0); // Domyślna liczba kropek
  const value: ElectronContextType = {
    options,
    setOptions,
    dotsNumber,
    setdotsNumber,
    auth,
    // allDocumentsData,
  };

  return (
    <ElectronContext.Provider value={value}>
      {children}
    </ElectronContext.Provider>
  );
};
