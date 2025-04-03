import React, { ReactNode, useState } from "react";
import { ElectronContext } from "./useOptionsImage";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export interface Options {
  orientation: string;
  color: string;
}

export interface FormValuesHomePage {
  firstDate: Date | null;
  secondDate: Date | null;
}
// Typ dla kontekstu
export interface ElectronContextType {
  options: Options; // Obiekt zawierający orientację
  setOptions: React.Dispatch<React.SetStateAction<Options>>; // Funkcja zmiany opcji
  formValuesHomePage: FormValuesHomePage; // Obiekt zawierający orientację
  setFormValuesHomePage: React.Dispatch<
    React.SetStateAction<FormValuesHomePage>
  >; // Funkcja zmiany opcji
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
      firstDate: new Date(new Date().getFullYear(), 0, 1),
      secondDate: new Date(new Date().getFullYear(), 11, 31),
    });
  // Wartość kontekstu (obiekt z opcjami)
  const value: ElectronContextType = {
    options,
    setOptions,
    formValuesHomePage,
    setFormValuesHomePage,
  };

  return (
    <ElectronContext.Provider value={value}>
      {children}
    </ElectronContext.Provider>
  );
};
