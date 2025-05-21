import { useEffect, useMemo, useState } from "react";
import { useTableDictionaryDocuments } from "../../hooks/useTableDictionaryDocuments";
import { useConnectedTableDictionary } from "../../hooks/useConnectedTableDictionary";
import { MdOutlinePostAdd } from "react-icons/md";
import scss from "./FormAddInvoiceDocuments.module.scss";
import Select, { SingleValue } from "react-select";
import { DbTables } from "../../../electron/dataBase/enum";
import { TextInput } from "../TextInput/TextInput";
import { customStylesComboBox, ComboBoxOption } from "../ComboBox/ComboBox";
import { SingleInput } from "../SingleInput/SingleInput";
import { ButtonUniversal } from "../ButtonUniversal/ButtonUniversal";
import { useMainDataContext } from "../Context/useOptionsImage";
import { calculateTotalAmount } from "../GlobalFunctions/GlobalFunctions";
import { IconInfo } from "../IconInfo/IconInfo";

interface FormAddInvoiceDocumentsProps {
  addInvoiceData: InvoiceSave;
  setAddInvoiceData: React.Dispatch<React.SetStateAction<InvoiceSave>>;
  onAddDocument: () => void;
  onRemoveDocument: () => void;
  isLast: boolean;
  isOnly: boolean;
  index: number;
  modalContentRef?: React.RefObject<HTMLDivElement | null>;
}
export const FormAddInvoiceDocuments: React.FC<
  FormAddInvoiceDocumentsProps
> = ({
  addInvoiceData,
  setAddInvoiceData,
  onAddDocument,
  onRemoveDocument,
  isLast,
  isOnly,
  index,
  modalContentRef,
}) => {
  //useState combobox
  const [selectedDocument, setSelectedDocument] =
    useState<ComboBoxOption | null>(null);
  const [selectedMainType, setSelectedMainType] =
    useState<ComboBoxOption | null>(null);
  const [selectedType, setSelectedType] = useState<ComboBoxOption | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<ComboBoxOption | null>(
    null
  );
  const [isMainTypeExistsBool, setIsMainTypeExistsBool] =
    useState<boolean>(false);
  const [isTypeExistsBool, setIsTypeExistsBool] = useState<boolean>(false);
  const [isSubtypeExistsBool, setIsSubtypeExistsBool] =
    useState<boolean>(false);

  //useState textbox
  const [inputInvoiceQuantity, setInputInvoiceQuantity] = useState<string>("");
  const [inputInvoiceQuantityError, setInputInvoiceQuantityError] =
    useState<string>("");
  const [inputInvoicePrice, setInputInvoicePrice] = useState<string>("");
  const [inputInvoicePriceError, setInputInvoicePriceError] =
    useState<string>("");
  const [isPriceManuallyEdited, setIsPriceManuallyEdited] =
    useState<boolean>(false); // Nowy stan
  //All documents name
  const { allDocumentsData } = useMainDataContext();
  const {
    data: dataAllDocumentsName,
    loading: loadingAllDocumentsName,
    error: errorAllDocumentsName,
  } = allDocumentsData;

  const handleSingleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentValue = event.target.value;
    const currentName = event.target.name;
    let errorTextInput = "";

    if (currentName === "quantity") {
      const isValidInteger = /^\d*$/.test(currentValue);
      if (isValidInteger) {
        // Usuń wiodące zera i sparsuj do liczby
        const parsedValue = currentValue ? parseInt(currentValue, 10) : NaN;
        const cleanedValue = isNaN(parsedValue) ? "" : parsedValue.toString();

        setInputInvoiceQuantity(cleanedValue);

        if (!cleanedValue) {
          errorTextInput = "Musisz wypełnić to pole";
        } else if (parsedValue <= 0) {
          errorTextInput = "Wprowadź liczbę większą od 0";
        }
      } else {
        errorTextInput = "Dozwolone są tylko liczby całkowite";
      }
      setInputInvoiceQuantityError(errorTextInput);
    }
    if (currentName === "price") {
      const isValidPrice = /^\d*\.?\d*$/.test(currentValue); // Dopuszcza liczby zmiennoprzecinkowe
      setInputInvoicePrice(currentValue);
      setIsPriceManuallyEdited(true); // Ustaw flagę, że cena została ręcznie edytowana
      if (!currentValue) {
        errorTextInput = "Musisz wypełnić to pole";
      } else if (currentValue.includes(",")) {
        errorTextInput = "Zamiast przecinka użyj kropki";
      } else if (!isValidPrice) {
        errorTextInput = "Wprowadź poprawną liczbę";
      }
      setInputInvoicePriceError(errorTextInput);
    }
  };
  const handleKeyDownQuantityInput = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key.match(/[^0-9]/) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
        event.key
      )
    ) {
      event.preventDefault();
    }
  };
  const handleKeyDownPriceInput = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "," ||
      (event.key.match(/[^0-9.]/) &&
        !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
          event.key
        ))
    ) {
      event.preventDefault();
    }
  };
  //Dane tabel pobrane z hooka
  //dictionaryDocumentTable
  const dictionaryDocumentTable = useMemo(() => {
    if (!dataAllDocumentsName) return [];
    return getDictionaryDocumentsTable(dataAllDocumentsName);
  }, [dataAllDocumentsName]);

  //dictionaryMainTypeTable
  const dictionaryMainTypeTable = useMemo(() => {
    if (!dataAllDocumentsName) return [];
    return getDictionaryMainTypeTable(
      dataAllDocumentsName,
      selectedDocument?.value
    );
  }, [dataAllDocumentsName, selectedDocument]);

  //dictionaryTypeTable
  const dictionaryTypeTable = useMemo(() => {
    if (!dataAllDocumentsName || !selectedDocument?.value) return [];
    return getDictionaryTypeTable(
      dataAllDocumentsName,
      selectedDocument.value,
      selectedMainType?.value ?? null
    );
  }, [dataAllDocumentsName, selectedDocument, selectedMainType]);

  //dictionarySubtypeTable
  const dictionarySubtypeTable = useMemo(() => {
    if (!dataAllDocumentsName || !selectedDocument?.value) return [];
    return getDictionarySubtypeTable(
      dataAllDocumentsName,
      selectedDocument.value,
      selectedMainType?.value ?? null,
      selectedType?.value ?? null
    );
  }, [dataAllDocumentsName, selectedDocument, selectedMainType, selectedType]);

  //dane do combobox
  //dictionaryDocumentTable
  const optionsDictionaryDocumentTable = useMemo(() => {
    if (!dictionaryDocumentTable) {
      return []; // Zwróć pustą tablicę, jeśli brak danych
    }
    return dictionaryDocumentTable.map((doc) => ({
      value: doc.DocumentId,
      label: doc.DocumentName,
    }));
  }, [dictionaryDocumentTable]);
  //dictionaryMainTypeTable
  const optionsDictionaryMainTypeTable = useMemo(() => {
    if (!dictionaryMainTypeTable) {
      return []; // Zwróć pustą tablicę, jeśli brak danych
    }
    return dictionaryMainTypeTable.map((doc) => ({
      value: doc.MainTypeId,
      label: doc.MainTypeName,
    }));
  }, [dictionaryMainTypeTable]);
  //dictionaryTypeTable
  const optionsDictionaryTypeTable = useMemo(() => {
    if (!dictionaryTypeTable) {
      return []; // Zwróć pustą tablicę, jeśli brak danych
    }
    return dictionaryTypeTable.map((doc) => ({
      value: doc.TypeId,
      label: doc.TypeName,
    }));
  }, [dictionaryTypeTable]);
  //dictionarySubtypeTable
  const optionsDictionarySubtypeTable = useMemo(() => {
    if (!dictionarySubtypeTable) {
      return []; // Zwróć pustą tablicę, jeśli brak danych
    }
    return dictionarySubtypeTable.map((doc) => ({
      value: doc.SubtypeId,
      label: doc.SubtypeName,
    }));
  }, [dictionarySubtypeTable]);

  const getSingleDefaultOption = <T extends ComboBoxOption>(
    options: T[]
  ): T | undefined => {
    return options.length === 1 ? options[0] : undefined;
  };
  //removing elements from the combobox when changing
  useEffect(() => {
    setSelectedMainType(null);
    setSelectedType(null);
    setSelectedSubtype(null);
    setIsPriceManuallyEdited(false); // Resetuj flagę przy zmianie dokumentu
  }, [selectedDocument]);
  useEffect(() => {
    setSelectedType(null);
    setSelectedSubtype(null);
    setIsPriceManuallyEdited(false); // Resetuj flagę przy zmianie typu głównego
  }, [selectedMainType]);
  useEffect(() => {
    setSelectedSubtype(null);
    setIsPriceManuallyEdited(false); // Resetuj flagę przy zmianie typu
  }, [selectedType]);

  //set single item in combobox

  useEffect(() => {
    const defaultMainType = getSingleDefaultOption(
      optionsDictionaryMainTypeTable
    );
    if (defaultMainType && !selectedMainType) {
      setSelectedMainType(defaultMainType);
    }
  }, [optionsDictionaryMainTypeTable, selectedMainType]);

  useEffect(() => {
    const defaultType = getSingleDefaultOption(optionsDictionaryTypeTable);
    if (defaultType && !selectedType) {
      setSelectedType(defaultType);
    }
  }, [optionsDictionaryTypeTable, selectedType]);

  useEffect(() => {
    const defaultSubtype = getSingleDefaultOption(
      optionsDictionarySubtypeTable
    );

    if (defaultSubtype && !selectedSubtype) {
      console.log(
        "const defaultSubtype = getSingleDefaultOption",
        defaultSubtype
      );
      setSelectedSubtype(defaultSubtype);
    }
  }, [optionsDictionarySubtypeTable, selectedSubtype]);

  //Setting the price and checking the existence of types
  useEffect(() => {
    const isMainTypeExists = checkComboBoxExistence(
      [selectedDocument],
      optionsDictionaryMainTypeTable
    );
    setIsMainTypeExistsBool(isMainTypeExists);

    const isTypeExists = checkComboBoxExistence(
      [selectedDocument, selectedMainType],
      optionsDictionaryTypeTable
    );
    setIsTypeExistsBool(isTypeExists);

    const isSubtypeExists = checkComboBoxExistence(
      [selectedDocument, selectedMainType, selectedType],
      optionsDictionarySubtypeTable
    );
    setIsSubtypeExistsBool(isSubtypeExists);

    if (!isPriceManuallyEdited) {
      const price = getPrice(
        dataAllDocumentsName,
        selectedDocument,
        selectedMainType,
        isMainTypeExists,
        selectedType,
        isTypeExists,
        selectedSubtype,
        isSubtypeExists
      );
      setInputInvoicePrice(price);
    }

    // Aktualizacja addInvoiceData.details
    setAddInvoiceData((prev) => {
      const newDetails = [...prev.details];
      newDetails[index] = {
        InvoiceId: undefined,
        DocumentId: selectedDocument?.value ?? 0,
        MainTypeId: selectedMainType?.value ?? null,
        TypeId: selectedType?.value ?? null,
        SubtypeId: selectedSubtype?.value ?? null,
        Quantity: inputInvoiceQuantity ? parseInt(inputInvoiceQuantity) : 0,
        Price: inputInvoicePrice ? parseFloat(inputInvoicePrice) : 0,
        isMainTypeRequired: isMainTypeExists, // Nowe pole
        isTypeRequired: isTypeExists, // Nowe pole
        isSubtypeRequired: isSubtypeExists, // Nowe pole
      };
      return { ...prev, details: newDetails };
    });
  }, [
    dataAllDocumentsName,
    selectedDocument,
    selectedMainType,
    optionsDictionaryMainTypeTable,
    selectedType,
    optionsDictionaryTypeTable,
    selectedSubtype,
    optionsDictionarySubtypeTable,
    inputInvoiceQuantity,
    inputInvoicePrice,
    isPriceManuallyEdited,
    index,
    setAddInvoiceData,
  ]);

  const areFieldsFilled = () => {
    const isDocumentSelected = !!selectedDocument;
    const isQuantityValid =
      inputInvoiceQuantity && parseInt(inputInvoiceQuantity) > 0;
    const isPriceValid =
      inputInvoicePrice && /^\d*\.?\d*$/.test(inputInvoicePrice);

    // Sprawdź, czy wymagane pola zależne są wypełnione
    const isMainTypeFilled = !isMainTypeExistsBool || !!selectedMainType;
    const isTypeFilled = !isTypeExistsBool || !!selectedType;
    const isSubtypeFilled = !isSubtypeExistsBool || !!selectedSubtype;

    return (
      isDocumentSelected &&
      isQuantityValid &&
      isPriceValid &&
      isMainTypeFilled &&
      isTypeFilled &&
      isSubtypeFilled
    );
  };

  const handleAddButtonClick = () => {
    onAddDocument();
    setTimeout(() => {
      if (modalContentRef?.current) {
        modalContentRef.current.scrollTo({
          top: modalContentRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  };
  return (
    <div className={scss["formAddInvoiceDocuments-main-container"]}>
      <div className={scss["document-container"]}>
        <Select<ComboBoxOption> //Dokument Combobox
          value={selectedDocument} // <-- zamiast tylko defaultValue
          defaultValue={getSingleDefaultOption(optionsDictionaryDocumentTable)}
          onChange={(option) => setSelectedDocument(option as ComboBoxOption)}
          options={optionsDictionaryDocumentTable} // Użyj danych z hooka
          isSearchable={true}
          placeholder="Wybierz..."
          styles={customStylesComboBox}
          menuPortalTarget={document.body} // Portal, który zapewnia renderowanie listy na poziomie document.body
          menuPosition="fixed" // Zapewnia, że pozycjonowanie menu jest "fixed"
          menuShouldBlockScroll={true} // Opcjonalnie: blokuje scroll podczas otwartego menu
          className={scss["select-document-container"]}
          classNamePrefix={scss["select-document"]}
        />
        {isMainTypeExistsBool && (
          <Select<ComboBoxOption> //MainType Combobox
            value={selectedMainType}
            defaultValue={getSingleDefaultOption(
              optionsDictionaryMainTypeTable
            )}
            onChange={(option) => setSelectedMainType(option as ComboBoxOption)}
            options={optionsDictionaryMainTypeTable} // Użyj danych z hooka
            isSearchable={true}
            placeholder="Wybierz..."
            styles={customStylesComboBox}
            menuPortalTarget={document.body} // Portal, który zapewnia renderowanie listy na poziomie document.body
            menuPosition="fixed" // Zapewnia, że pozycjonowanie menu jest "fixed"
            menuShouldBlockScroll={true} // Opcjonalnie: blokuje scroll podczas otwartego menu
            className={scss["select-maintype-container"]}
          />
        )}
        {isTypeExistsBool && (
          <Select<ComboBoxOption> //Type Combobox
            value={selectedType}
            defaultValue={getSingleDefaultOption(optionsDictionaryTypeTable)}
            onChange={(option) => setSelectedType(option as ComboBoxOption)}
            options={optionsDictionaryTypeTable} // Użyj danych z hooka
            isSearchable={true}
            placeholder="Wybierz..."
            styles={customStylesComboBox}
            menuPortalTarget={document.body} // Portal, który zapewnia renderowanie listy na poziomie document.body
            menuPosition="fixed" // Zapewnia, że pozycjonowanie menu jest "fixed"
            menuShouldBlockScroll={true} // Opcjonalnie: blokuje scroll podczas otwartego menu
            className={scss["select-type-container"]}
          />
        )}
        {isSubtypeExistsBool && (
          <Select<ComboBoxOption> //Subtype Combobox
            value={selectedSubtype}
            // defaultValue={getSingleDefaultOption(optionsDictionarySubtypeTable)}
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
        )}
      </div>
      <div className={scss["textinput-and-button-container"]}>
        <div className={scss["textinput-container"]}>
          <div className={scss[""]}>
            <TextInput
              inputName="quantity"
              singleInputValue={inputInvoiceQuantity}
              handleSingleInputChange={handleSingleInputChange}
              handleKeyDown={handleKeyDownQuantityInput}
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
              handleKeyDown={handleKeyDownPriceInput}
              inputPlaceholder="Wprowadź kwotę ..."
              inputLabelText="Kwota jednostkowa:"
              singleInputError={inputInvoicePriceError}
              required={false}
              classNameInputContainer={scss["custom-input-container"]}
            />
          </div>
          <div className={scss["document-total-amount-container"]}>
            <p>
              Razem:{" "}
              {calculateTotalAmount(
                [inputInvoiceQuantity],
                [inputInvoicePrice]
              )}
            </p>
          </div>
        </div>
      </div>
      <div className={scss["button-container"]}>
        <ButtonUniversal
          buttonName={"deleteDocument"}
          buttonText={"Usuń dokument"}
          buttonClick={onRemoveDocument}
          buttonDisabled={isOnly}
        />
      </div>
      <div className={scss["button-container"]}>
        {isLast && areFieldsFilled() && (
          <ButtonUniversal
            buttonName={"addDocument"}
            buttonText={"Dodaj dokument"}
            buttonClick={handleAddButtonClick}
            buttonIcon={<MdOutlinePostAdd />}
            classNameButtonContainer={scss["button-add-document"]}
          />
        )}
      </div>
    </div>
  );
};

function getPrice(
  dataAllDocumentsName: AllDocumentsName[] | null,
  selectedDocumentComboBox: ComboBoxOption | null,
  selectedMainTypeComboBox: ComboBoxOption | null,
  isMainTypeExists: boolean,
  selectedTypeComboBox: ComboBoxOption | null,
  isTypeExists: boolean,
  selectedSubtypeComboBox: ComboBoxOption | null,
  isSubtypeExists: boolean
): string {
  if (isMainTypeExists) {
    if (isTypeExists) {
      if (isSubtypeExists) {
        const selectedDocuments =
          dataAllDocumentsName?.filter(
            (doc) =>
              doc.DocumentId === selectedDocumentComboBox?.value &&
              doc.MainTypeId === selectedMainTypeComboBox?.value &&
              doc.TypeId === selectedTypeComboBox?.value &&
              doc.SubtypeId === selectedSubtypeComboBox?.value
          ) || [];
        if (selectedDocuments.length == 1 && selectedDocuments[0].Price) {
          const price = selectedDocuments[0].Price.toString();
          return price; // Zwraca cenę pierwszego pasującego dokumentu
        }
      } else {
        const selectedDocuments =
          dataAllDocumentsName?.filter(
            (doc) =>
              doc.DocumentId === selectedDocumentComboBox?.value &&
              doc.MainTypeId === selectedMainTypeComboBox?.value &&
              doc.TypeId === selectedTypeComboBox?.value
          ) || [];
        if (selectedDocuments.length == 1 && selectedDocuments[0].Price) {
          const price = selectedDocuments[0].Price.toString();
          return price;
        }
      }
    } else {
      const selectedDocuments =
        dataAllDocumentsName?.filter(
          (doc) =>
            doc.DocumentId === selectedDocumentComboBox?.value &&
            doc.MainTypeId === selectedMainTypeComboBox?.value
        ) || [];
      if (selectedDocuments.length == 1 && selectedDocuments[0].Price) {
        const price = selectedDocuments[0].Price.toString();
        return price;
      }
    }
  } else {
    const selectedDocuments =
      dataAllDocumentsName?.filter(
        (doc) => doc.DocumentId === selectedDocumentComboBox?.value
      ) || [];
    if (selectedDocuments.length == 1 && selectedDocuments[0].Price) {
      const price = selectedDocuments[0].Price.toString();
      return price;
    }
  }
  return "0";
}

function checkComboBoxExistence(
  comboBoxes: (ComboBoxOption | null)[],
  optionsTable: ComboBoxOption[] | null
): boolean {
  return (
    comboBoxes.every((comboBox) => !!comboBox) &&
    !!optionsTable &&
    optionsTable.length > 0
  );
}

function getDictionaryDocumentsTable(
  data: AllDocumentsName[]
): DictionaryDocuments[] {
  const uniqueDocuments = new Map<number, string>();

  data.forEach((doc) => {
    if (!uniqueDocuments.has(doc.DocumentId)) {
      uniqueDocuments.set(doc.DocumentId, doc.DocumentName);
    }
  });

  return Array.from(uniqueDocuments, ([DocumentId, DocumentName]) => ({
    DocumentId,
    DocumentName,
  }));
}

const getDictionaryMainTypeTable = (
  data: AllDocumentsName[],
  documentId?: number
): DictionaryMainType[] => {
  if (!documentId) return [];
  const uniqueMainTypes = new Map<number, string>();

  data.forEach((doc) => {
    if (
      doc.DocumentId === documentId &&
      doc.MainTypeId !== null &&
      !uniqueMainTypes.has(doc.MainTypeId)
    ) {
      uniqueMainTypes.set(doc.MainTypeId, doc.MainTypeName);
    }
  });

  return Array.from(uniqueMainTypes, ([MainTypeId, MainTypeName]) => ({
    MainTypeId,
    MainTypeName,
  }));
};

const getDictionaryTypeTable = (
  data: AllDocumentsName[],
  documentId: number,
  mainTypeId: number | null
): DictionaryType[] => {
  const uniqueTypes = new Map<number, string>();

  data.forEach((doc) => {
    if (
      doc.DocumentId === documentId &&
      doc.MainTypeId === mainTypeId &&
      doc.TypeId !== null &&
      !uniqueTypes.has(doc.TypeId)
    ) {
      uniqueTypes.set(doc.TypeId, doc.TypeName);
    }
  });

  return Array.from(uniqueTypes, ([TypeId, TypeName]) => ({
    TypeId,
    TypeName,
  }));
};

const getDictionarySubtypeTable = (
  data: AllDocumentsName[],
  documentId: number,
  mainTypeId: number | null,
  typeId: number | null
): DictionarySubtype[] => {
  const uniqueSubtypes = new Map<number, string>();

  data.forEach((doc) => {
    if (
      doc.DocumentId === documentId &&
      doc.MainTypeId === mainTypeId &&
      doc.TypeId === typeId &&
      doc.SubtypeId !== null &&
      !uniqueSubtypes.has(doc.SubtypeId)
    ) {
      uniqueSubtypes.set(doc.SubtypeId, doc.SubtypeName);
    }
  });

  return Array.from(uniqueSubtypes, ([SubtypeId, SubtypeName]) => ({
    SubtypeId,
    SubtypeName,
  }));
};
