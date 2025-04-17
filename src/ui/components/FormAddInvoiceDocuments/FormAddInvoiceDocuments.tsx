import { useMemo } from "react";
import { useTableDictionaryDocuments } from "../../hooks/useTableDictionaryDocuments";
import scss from "./FormAddInvoiceDocuments.module.scss";
import Select, { SingleValue } from "react-select";

export interface CBOption {
  value: number; // typ LanguageValue zamiast string
  label: string;
}

export const FormAddInvoiceDocuments = () => {
  const {
    data: dictionaryDocumentTable,
    loading,
    error,
  } = useTableDictionaryDocuments();

  const options = useMemo(() => {
    if (!dictionaryDocumentTable) {
      return []; // Zwróć pustą tablicę, jeśli brak danych
    }
    return dictionaryDocumentTable.map((doc) => ({
      value: doc.DocumentId,
      label: doc.DocumentName,
    }));
  }, [dictionaryDocumentTable]);
  const defaultLanguageComboBox = (): undefined => {
    // const languageFromLocalStorage = globalFunctions.loadLocalStorage(
    //   LOCAL_STORAGE_KEY_LANGUAGE
    // ) as LanguageLocalStorage | null;
    // if (languageFromLocalStorage) {
    //   const language = languageFromLocalStorage.currentLanguage as LanguageValue;
    //   return languageOptions.find((option) => option.value === language);
    // }
    // return languageOptions.find((option) => option.value === currentLanguage);
  };
  // const handleChangeLanguage = (option: SingleValue<LanguageOption>): void => {
  //   if (option) {
  //     dispatch(setLanguage(option.value)); // Użyj zdefiniowanego typu
  //     globalFunctions.saveLocalStorage(LOCAL_STORAGE_KEY_LANGUAGE, {
  //       currentLanguage: option.value,
  //     });
  //   }
  // };
  const handleChangeLanguage = (option: null): void => {
    // if (option) {
    //   dispatch(setLanguage(option.value)); // Użyj zdefiniowanego typu
    //   globalFunctions.saveLocalStorage(LOCAL_STORAGE_KEY_LANGUAGE, {
    //     currentLanguage: option.value,
    //   });
    // }
  };
  return (
    <>
      <h1>Form Add Invoice Documents</h1>
      <Select
        defaultValue={defaultLanguageComboBox()}
        // onChange={(option) => handleChangeLanguage(option)}
        options={options} // Użyj danych z hooka
        isSearchable={false}
        // styles={customStyles}
        menuPortalTarget={document.body} // Portal, który zapewnia renderowanie listy na poziomie document.body
        menuPosition="fixed" // Zapewnia, że pozycjonowanie menu jest "fixed"
        menuShouldBlockScroll={true} // Opcjonalnie: blokuje scroll podczas otwartego menu
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }), // 👈 super ważne
        }}
      />
      <div>
        {dictionaryDocumentTable &&
          JSON.stringify(dictionaryDocumentTable, null, 2)}
      </div>
    </>
  );
};
