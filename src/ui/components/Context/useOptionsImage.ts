import { createContext, useContext } from "react";
import { ElectronContextType } from "./ElectronProvider";

// Tworzymy kontekst z typem ImageContextType
export const ElectronContext = createContext<ElectronContextType | undefined>(
  undefined
);

// Niestandardowy hak do używania kontekstu ImageContext
export const useMainDataContext = (): ElectronContextType => {
  const context = useContext(ElectronContext);

  // Jeśli kontekst nie jest dostępny, rzucamy błąd (zapobiegamy używaniu poza providerem)
  if (!context) {
    throw new Error("useOptionsImage must be used within an ImageProvider.");
  }

  return context;
};


