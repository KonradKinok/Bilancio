import { useEffect, useMemo, useState } from "react";
import { useTableDictionaryDocuments } from "../../hooks/useTableDictionaryDocuments";
import { useConnectedTableDictionary } from "../../hooks/useConnectedTableDictionary";
import { FaUser } from "react-icons/fa";
import scss from "./FormAddInvoiceDocuments.module.scss";
import Select, { SingleValue } from "react-select";
import { DbTables } from "../../../electron/dataBase/enum";
import { TextInput } from "../TextInput/TextInput";
import { customStylesComboBox, ComboBoxOption } from "../ComboBox/ComboBox";
import { SingleInput } from "../SingleInput/SingleInput";
// interface ComboBoxOption {
//   value: number; // typ LanguageValue zamiast string
//   label: string;
// }

export const FormAddInvoiceDocuments = () => {
  //useState
  const [selectedDocument, setSelectedDocument] =
    useState<ComboBoxOption | null>(null);
  const [selectedMainType, setSelectedMainType] =
    useState<ComboBoxOption | null>(null);
  const [selectedType, setSelectedType] = useState<ComboBoxOption | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<ComboBoxOption | null>(
    null
  );

  const [inputInvoiceQuantity, setInputInvoiceQuantity] = useState<string>("");
  const [inputInvoiceQuantityError, setInputInvoiceQuantityError] =
    useState<string>("");
  const [inputInvoicePrice, setInputInvoicePrice] = useState<string>("");
  const [inputInvoicePriceError, setInputInvoicePriceError] =
    useState<string>("");

  const handleSingleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentValue = event.target.value;
    const currentName = event.target.name;
    let errorTextInput = "";

    if (currentName === "quantity") {
      setInputInvoiceQuantity(currentValue);
      if (currentValue.length === 1) {
        errorTextInput = "Za mało liter";
      } else if (!currentValue) {
        errorTextInput = "Musisz wypełnić te pole";
      }
      setInputInvoiceQuantityError(errorTextInput);
    }
    if (currentName === "price") {
      setInputInvoicePrice(currentValue);
      if (currentValue.length === 1) {
        errorTextInput = "Za mało liter";
      } else if (!currentValue) {
        errorTextInput = "Musisz wypełnić te pole";
      }
      setInputInvoicePriceError(errorTextInput);
    }
    // if (currentName === fieldNames.password) {
    //   setInputPassword(currentValue);
    //   if (currentValue.length === 1) {
    //     errorTextInput = "Za mało liter";
    //   } else if (!currentValue) {
    //     errorTextInput = "Musisz wypełnić te pole";
    //   }
    //   setInputPasswordError(errorTextInput);
    // }
  };

  //Dane tabel pobrane z hooka
  //dictionaryDocumentTable
  const {
    data: dictionaryDocumentTable,
    loading: loadingDictionaryDocumentTable,
    error: errorDictionaryDocumentTable,
  } = useConnectedTableDictionary<DictionaryDocuments>(
    DbTables.DictionaryDocuments
  );
  //dictionaryMainTypeTable
  const {
    data: dictionaryMainTypeTable,
    loading: loadingDictionaryMainTypeTable,
    error: errorDictionaryMainTypeTable,
  } = useConnectedTableDictionary<DictionaryMainType>(
    DbTables.DictionaryMainType,
    selectedDocument?.value
  );
  //dictionaryTypeTable
  const {
    data: dictionaryTypeTable,
    loading: loadingDictionaryTypeTable,
    error: errorDictionaryTypeTable,
  } = useConnectedTableDictionary<DictionaryType>(
    DbTables.DictionaryType,
    selectedDocument?.value,
    selectedMainType?.value
  );
  //dictionarySubtypeTable
  const {
    data: dictionarySubtypeTable,
    loading: loadingDictionarySubtypeTable,
    error: errorDictionarySubtypeTable,
  } = useConnectedTableDictionary<DictionarySubtype>(
    DbTables.DictionarySubtype,
    selectedDocument?.value,
    selectedMainType?.value,
    selectedType?.value
  );

  //dane do combobox
  //dictionaryDocumentTable
  const optionsDictionaryDocumentTable = useMemo(() => {
    if (!dictionaryDocumentTable) {
      return []; // Zwróć pustą tablicę, jeśli brak danych
    }
    return dictionaryDocumentTable.map((doc) => ({
      value: doc.DocumentId,
      label: doc.DocumentName + doc.DocumentId,
    }));
    //  return dictionaryDocumentTable.map((doc) => ({
    //    value: doc.DocumentId,
    //    label: (
    //      <div className={scss["combobox-item"]}>
    //        {doc.DocumentName} {doc.DocumentId}
    //      </div>
    //    ),
    //  }));
  }, [dictionaryDocumentTable]);
  //dictionaryMainTypeTable
  const optionsDictionaryMainTypeTable = useMemo(() => {
    if (!dictionaryMainTypeTable) {
      return []; // Zwróć pustą tablicę, jeśli brak danych
    }
    return dictionaryMainTypeTable.map((doc) => ({
      value: doc.MainTypeId,
      label: doc.MainTypeName + doc.MainTypeId,
    }));
  }, [dictionaryMainTypeTable]);
  //dictionaryTypeTable
  const optionsDictionaryTypeTable = useMemo(() => {
    if (!dictionaryTypeTable) {
      return []; // Zwróć pustą tablicę, jeśli brak danych
    }
    return dictionaryTypeTable.map((doc) => ({
      value: doc.TypeId,
      label: doc.TypeName + doc.TypeId,
    }));
  }, [dictionaryTypeTable]);
  //dictionarySubtypeTable
  const optionsDictionarySubtypeTable = useMemo(() => {
    if (!dictionarySubtypeTable) {
      return []; // Zwróć pustą tablicę, jeśli brak danych
    }
    return dictionarySubtypeTable.map((doc) => ({
      value: doc.SubtypeId,
      label: doc.SubtypeName + doc.SubtypeId,
    }));
  }, [dictionarySubtypeTable]);

  const getSingleDefaultOption = <T extends ComboBoxOption>(
    options: T[]
  ): T | undefined => {
    return options.length === 1 ? options[0] : undefined;
  };

  useEffect(() => {
    setSelectedMainType(null);
    setSelectedType(null);
    setSelectedSubtype(null);
  }, [selectedDocument]);
  useEffect(() => {
    setSelectedType(null);
    setSelectedSubtype(null);
  }, [selectedMainType]);
  useEffect(() => {
    setSelectedSubtype(null);
  }, [selectedType]);
  const defaultDocumentComboBox = (): undefined => {
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
    <div className={scss["formAddInvoiceDocuments-main-container"]}>
      <h1>Form Add Invoice Documents .........</h1>
      <div className={scss["document-container"]}>
        <Select<ComboBoxOption>
          value={selectedDocument} // <-- zamiast tylko defaultValue
          defaultValue={getSingleDefaultOption(optionsDictionaryDocumentTable)}
          onChange={(option) => setSelectedDocument(option as ComboBoxOption)}
          options={optionsDictionaryDocumentTable} // Użyj danych z hooka
          isSearchable={false}
          placeholder="Wybierz..."
          styles={customStylesComboBox}
          menuPortalTarget={document.body} // Portal, który zapewnia renderowanie listy na poziomie document.body
          menuPosition="fixed" // Zapewnia, że pozycjonowanie menu jest "fixed"
          menuShouldBlockScroll={true} // Opcjonalnie: blokuje scroll podczas otwartego menu
          className={scss["select-document-container"]}
          classNamePrefix={scss["select-document"]}
        />
        <Select<ComboBoxOption>
          value={selectedMainType}
          defaultValue={getSingleDefaultOption(optionsDictionaryMainTypeTable)}
          onChange={(option) => setSelectedMainType(option as ComboBoxOption)}
          options={optionsDictionaryMainTypeTable} // Użyj danych z hooka
          isSearchable={false}
          placeholder="Wybierz..."
          styles={customStylesComboBox}
          menuPortalTarget={document.body} // Portal, który zapewnia renderowanie listy na poziomie document.body
          menuPosition="fixed" // Zapewnia, że pozycjonowanie menu jest "fixed"
          menuShouldBlockScroll={true} // Opcjonalnie: blokuje scroll podczas otwartego menu
          className={scss["select-maintype-container"]}
        />
        <Select<ComboBoxOption>
          value={selectedType}
          defaultValue={getSingleDefaultOption(optionsDictionaryTypeTable)}
          onChange={(option) => setSelectedType(option as ComboBoxOption)}
          options={optionsDictionaryTypeTable} // Użyj danych z hooka
          isSearchable={false}
          placeholder="Wybierz..."
          styles={customStylesComboBox}
          menuPortalTarget={document.body} // Portal, który zapewnia renderowanie listy na poziomie document.body
          menuPosition="fixed" // Zapewnia, że pozycjonowanie menu jest "fixed"
          menuShouldBlockScroll={true} // Opcjonalnie: blokuje scroll podczas otwartego menu
          className={scss["select-type-container"]}
        />
        <Select<ComboBoxOption>
          value={selectedSubtype}
          defaultValue={getSingleDefaultOption(optionsDictionarySubtypeTable)}
          onChange={(option) => setSelectedSubtype(option as ComboBoxOption)}
          options={optionsDictionarySubtypeTable} // Użyj danych z hooka
          isSearchable={false}
          placeholder="Wybierz..."
          styles={customStylesComboBox}
          menuPortalTarget={document.body} // Portal, który zapewnia renderowanie listy na poziomie document.body
          menuPosition="fixed" // Zapewnia, że pozycjonowanie menu jest "fixed"
          menuShouldBlockScroll={true} // Opcjonalnie: blokuje scroll podczas otwartego menu
          className={scss["select-subtype-container"]}
        />
      </div>
      <div className={scss["textinput-container"]}>
        <div className={scss["textinput"]}>
          <TextInput
            inputName="quantity"
            singleInputValue={inputInvoiceQuantity}
            handleSingleInputChange={handleSingleInputChange}
            inputPlaceholder="Wprowadź liczbę sztuk ..."
            inputLabelText="Liczba sztuk:"
            singleInputError={inputInvoiceQuantityError}
            required={false}
            classNameInputContainer={scss["custom-input-container"]}
          />
        </div>
        <div>
          <TextInput
            inputName="price"
            singleInputValue={inputInvoicePrice}
            handleSingleInputChange={handleSingleInputChange}
            inputPlaceholder="Wprowadź kwotę ..."
            inputLabelText="Kwota jednostkowa:"
            singleInputError={inputInvoicePriceError}
            required={false}
            classNameInputContainer={scss["custom-input-container"]}
          />
        </div>
      </div>
      <div>
        Wybrane dokumenty:
        {dictionarySubtypeTable &&
          JSON.stringify(dictionarySubtypeTable, null, 2)}
      </div>
      <div>
        <h3>Wybrany dokument:</h3>
        {selectedDocument ? (
          <p>
            value: <strong>{selectedDocument.value}</strong>, label:{" "}
            <strong>{selectedDocument.label}</strong>
          </p>
        ) : (
          <p>Brak wybranego dokumentu</p>
        )}
      </div>

      <div>
        <h3>Wybrany typ :</h3>
        {selectedMainType ? (
          <p>
            value: <strong>{selectedMainType.value}</strong>, label:{" "}
            <strong>{selectedMainType.label}</strong>
          </p>
        ) : (
          <p>Brak wybranego typu</p>
        )}
      </div>
    </div>
  );
};

// type DataItem = {
//   [key: string]: unknown;
// };

// function getOptions<T extends DataItem>(
//   data: T[] | undefined,
//   valueKey: keyof T,
//   labelKey: keyof T
// ): ComboBoxOption[] {
//   if (!data) return [];
//   return data.map((item) => ({
//     value: item[valueKey] as number,
//     label: item[labelKey] as string,
//   }));
// }
