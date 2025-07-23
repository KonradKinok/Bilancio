import { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import { RiSave3Fill } from "react-icons/ri";
import { ImExit } from "react-icons/im";
import { DataBaseResponse, STATUS } from "../../../electron/sharedTypes/status";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import { FormAddInvoiceDocuments } from "../FormAddInvoiceDocuments/FormAddInvoiceDocuments";
import { TextInput } from "../TextInput/TextInput";
import { ButtonUniversal } from "../ButtonUniversal/ButtonUniversal";
import {
  calculateTotalAmount,
  compareInvoices2,
  formatDocumentDetailsFunctionChanges,
} from "../GlobalFunctions/GlobalFunctions";
import { IconInfo } from "../IconInfo/IconInfo";
import { ModalConfirmationSave } from "../ModalConfirmationSave/ModalConfirmationSave";
import { ModalSelectionWindow } from "../ModalSelectionWindow/ModalSelectionWindow";
import { useToggle } from "../../hooks/useToggle";
import { useAddInvoice } from "../../hooks/useAddInvoice";
import { useUpdateInvoice } from "../../hooks/useUpdateInvoice";
import { useAllDocumentsName } from "../../hooks/useAllDocumentName";
import scss from "./FormAddInvoice.module.scss";

interface FormAddInvoiceProps {
  addInvoiceData: InvoiceSave;
  selectedInvoice?: InvoiceSave;
  setAddInvoiceData: React.Dispatch<React.SetStateAction<InvoiceSave>>;
  closeModalAddInvoice: () => void;
  modalContentRef?: React.RefObject<HTMLDivElement | null>;
  isEditMode: boolean;
  refetchAllInvoices: () => void;
}

export const FormAddInvoice: React.FC<FormAddInvoiceProps> = ({
  addInvoiceData,
  setAddInvoiceData,
  closeModalAddInvoice,
  modalContentRef,
  selectedInvoice,
  isEditMode,
  refetchAllInvoices,
}) => {
  const {
    isOpenModal: isOpenModalConfirmationSave,
    openModal: openModalConfirmationSave,
    closeModal: closeModalConfirmationSave,
  } = useToggle();
  const {
    isOpenModal: isOpenModalSelectionWindow,
    openModal: openModalSelectionWindow,
    closeModal: closeModalSelectionWindow,
  } = useToggle();
  const allDocumentsData = useAllDocumentsName(0);
  const {
    data: dataAllDocumentsName,
    loading: loadingAllDocumentsName,
    error: errorAllDocumentsName,
  } = allDocumentsData;
  const [inputInvoiceName, setInputInvoiceName] = useState<string>("");
  const [inputInvoiceNameError, setInputInvoiceNameError] =
    useState<string>("");
  const [dateTimePickerReceiptDate, setDateTimePickerReceiptDate] =
    useState<Date | null>(null);
  const [dateTimePickerDeadlineDate, setDateTimePickerDeadlineDate] =
    useState<Date | null>(null);
  const [dateTimePickerPaymentDate, setDateTimePickerPaymentDate] =
    useState<Date | null>(null);
  const [documentComponents, setDocumentComponents] = useState<string[]>([
    nanoid(),
  ]);
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] =
    useState<boolean>(false);
  const {
    addInvoice,
    data: saveInvoiceData,
    loading: saveInvoiceLoading,
    error: saveInvoiceError,
  } = useAddInvoice();
  const {
    updateInvoice,
    data: updateInvoiceData,
    loading: updateInvoiceLoading,
    error: updateInvoiceError,
  } = useUpdateInvoice();

  // Przechowywanie początkowego stanu dla wykrywania zmian
  const [initialState] = useState({
    addInvoiceData: JSON.stringify(addInvoiceData),
    inputInvoiceName: "",
    dateTimePickerReceiptDate: null,
    dateTimePickerDeadlineDate: null,
    dateTimePickerPaymentDate: null,
    documentComponents: [nanoid()],
  });

  // Przygotowanie tablic quantities i prices dla calculateTotalAmount
  const quantities = addInvoiceData.details.map((detail) =>
    detail.Quantity.toString()
  );
  const prices = addInvoiceData.details.map((detail) =>
    detail.Price.toString()
  );
  const totalAmount = calculateTotalAmount(quantities, prices);

  const formatDate = (date: Date | null): string | null => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() zwraca 0-11, więc dodajemy 1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  };
  // Porównanie wybranej faktury z danymi do dodania
  // const differences = compareInvoices(selectedInvoice, addInvoiceData);
  const differences = compareInvoices2(selectedInvoice, addInvoiceData);
  console.log("FormAddInvoice: selectedInvoice:", selectedInvoice);
  console.log("FormAddInvoice: addInvoiceData:", addInvoiceData);
  console.log("FormAddInvoice: differences:", differences);
  const formatDifferences =
    formatDocumentDetailsFunctionChanges(dataAllDocumentsName);
  const differencesWithName = formatDifferences(differences);
  // Funkcja do formatowania szczegółów dokumentu
  const formatDocumentDetails =
    formatDocumentDetailsFunction(dataAllDocumentsName);
  // Aktualizacja dat w addInvoiceData
  useEffect(() => {
    setAddInvoiceData((prev) => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        ReceiptDate: formatDate(dateTimePickerReceiptDate) || "",
        DeadlineDate: formatDate(dateTimePickerDeadlineDate),
        PaymentDate: formatDate(dateTimePickerPaymentDate) || null,
      },
    }));
  }, [
    dateTimePickerReceiptDate,
    dateTimePickerDeadlineDate,
    dateTimePickerPaymentDate,
    setAddInvoiceData,
  ]);

  // Wypełnianie formularza danymi z addInvoiceData
  useEffect(() => {
    if (selectedInvoice) {
      setInputInvoiceName(selectedInvoice.invoice.InvoiceName);
      setDateTimePickerReceiptDate(
        selectedInvoice.invoice.ReceiptDate
          ? new Date(selectedInvoice.invoice.ReceiptDate)
          : null
      );
      setDateTimePickerDeadlineDate(
        selectedInvoice.invoice.DeadlineDate
          ? new Date(selectedInvoice.invoice.DeadlineDate)
          : null
      );
      setDateTimePickerPaymentDate(
        selectedInvoice.invoice.PaymentDate
          ? new Date(selectedInvoice.invoice.PaymentDate)
          : null
      );
      setDocumentComponents(selectedInvoice.details.map(() => nanoid()));
    }
  }, [selectedInvoice]);

  const validateForm = useCallback((): boolean => {
    if (isEditMode && differences.length === 0) return false; // Jeśli jest tryb edycji i są różnice, nie pozwalamy na zapis
    const isInvoiceNameValid = inputInvoiceName.trim() !== "";
    const isReceiptDateValid = !!dateTimePickerReceiptDate;
    const areDetailsValid = addInvoiceData.details.every((detail) => {
      const isMainTypeValid =
        !detail.isMainTypeRequired ||
        (detail.MainTypeId && detail.MainTypeId > 0);
      const isTypeValid =
        !detail.isTypeRequired || (detail.TypeId && detail.TypeId > 0);
      const isSubtypeValid =
        !detail.isSubtypeRequired || (detail.SubtypeId && detail.SubtypeId > 0);
      return (
        detail.DocumentId !== 0 &&
        detail.Quantity > 0 &&
        detail.Price >= 0 &&
        isMainTypeValid &&
        isTypeValid &&
        isSubtypeValid
      );
    });
    return isInvoiceNameValid && isReceiptDateValid && areDetailsValid;
  }, [
    inputInvoiceName,
    dateTimePickerReceiptDate,
    addInvoiceData.details,
    differences,
    isEditMode,
  ]);

  useEffect(() => {
    setIsSaveButtonEnabled(validateForm());
  }, [
    inputInvoiceName,
    dateTimePickerReceiptDate,
    addInvoiceData.details,
    validateForm,
  ]);

  const handleSingleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentValue = event.target.value;
    const currentName = event.target.name;
    let errorTextInput = "";

    if (currentName === "invoiceName") {
      setInputInvoiceName(currentValue);
      setAddInvoiceData((prev) => ({
        ...prev,
        invoice: { ...prev.invoice, InvoiceName: currentValue },
      }));
      if (!currentValue) {
        errorTextInput = "Musisz wypełnić to pole";
      }
      setInputInvoiceNameError(errorTextInput);
    }
  };

  const handleAddDocument = () => {
    const newId = nanoid();
    setDocumentComponents((prev) => [...prev, newId]);
    setAddInvoiceData((prev) => ({
      ...prev,
      details: [
        ...prev.details,
        {
          InvoiceId: undefined,
          DocumentId: 0,
          MainTypeId: null,
          TypeId: null,
          SubtypeId: null,
          Quantity: 0,
          Price: 0,
        },
      ],
    }));
  };

  const handleRemoveDocument = (id: string) => {
    if (documentComponents.length <= 1) {
      return; // Blokuj usuwanie, jeśli jest tylko jeden komponent
    }
    const indexToRemove = documentComponents.indexOf(id);
    if (indexToRemove === -1) return; // Zabezpieczenie przed błędnym ID
    setDocumentComponents((prev) =>
      prev.filter((componentId) => componentId !== id)
    );
    setAddInvoiceData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== indexToRemove),
    }));
  };

  const resetForm = () => {
    setInputInvoiceName("");
    setDateTimePickerReceiptDate(null);
    setDateTimePickerDeadlineDate(null);
    setDateTimePickerPaymentDate(null);
    setDocumentComponents([nanoid()]);
    setAddInvoiceData({
      invoice: {
        InvoiceId: undefined,
        InvoiceName: "",
        ReceiptDate: "",
        DeadlineDate: null,
        PaymentDate: null,
        IsDeleted: 0,
      },
      details: [
        {
          InvoiceId: undefined,
          DocumentId: 0,
          MainTypeId: null,
          TypeId: null,
          SubtypeId: null,
          Quantity: 0,
          Price: 0,
          isMainTypeRequired: false,
          isTypeRequired: false,
          isSubtypeRequired: false,
        },
      ],
    });
  };
  const handleConfirmSave = async () => {
    const toastErrorMessage = `Nie udało się ${
      isEditMode ? "zaktualizować" : "dodać"
    } faktury. Sprawdź dane i spróbuj ponownie.`;
    const toastSuccessMessage = `Faktura została pomyślnie ${
      isEditMode ? "zaktualizowana" : "dodana"
    }!`;
    try {
      // Walidacja formularza
      if (!validateForm()) {
        console.log("handleConfirmSave: Walidacja formularza nieudana.");
        toast.error("Formularz zawiera błędy. Sprawdź dane.");
        closeModalConfirmationSave();
        return;
      }

      const invoice: InvoiceTable = {
        InvoiceId: selectedInvoice?.invoice.InvoiceId, // Ważne dla update
        InvoiceName: addInvoiceData.invoice.InvoiceName,
        ReceiptDate: addInvoiceData.invoice.ReceiptDate,
        DeadlineDate: addInvoiceData.invoice.DeadlineDate,
        PaymentDate: addInvoiceData.invoice.PaymentDate,
        IsDeleted: 0,
      };

      const invoiceDetails: InvoiceDetailsTable[] = addInvoiceData.details.map(
        (detail) => ({
          InvoiceId: selectedInvoice?.invoice.InvoiceId, // Ważne dla update
          DocumentId: detail.DocumentId,
          MainTypeId: detail.MainTypeId,
          TypeId: detail.TypeId,
          SubtypeId: detail.SubtypeId,
          Quantity: detail.Quantity,
          Price: detail.Price,
          isMainTypeRequired: detail.isMainTypeRequired,
          isTypeRequired: detail.isTypeRequired,
          isSubtypeRequired: detail.isSubtypeRequired,
        })
      );

      console.log("handleConfirmSave: Rozpoczynanie zapisu faktury...");
      const result = await toast.promise(
        isEditMode
          ? updateInvoice(invoice, invoiceDetails)
          : addInvoice(invoice, invoiceDetails),
        {
          loading: "Zapisywanie faktury...",
          success: (res: DataBaseResponse<ReturnMessageFromDb>) => {
            console.log("toast.promise sukces:", res);
            if (res.status === STATUS.Success && res.data?.lastID) {
              return toastSuccessMessage;
            }
            throw new Error(toastErrorMessage);
          },
          error: (err: Error) => {
            console.log("toast.promise błąd:", err);
            return err.message || toastErrorMessage;
          },
        }
      );

      console.log("handleConfirmSave: Wynik addInvoice:", result);
      if (result.status === STATUS.Success && result.data?.lastID) {
        console.log("handleConfirmSave: Zapis udany, zamykanie modali.");
        console.log(
          "handleConfirmSave: refetchAllInvoices:",
          refetchAllInvoices
        );
        resetForm();
        closeModalConfirmationSave();
        closeModalAddInvoice();
        refetchAllInvoices();
      } else {
        console.log("handleConfirmSave: Zapis nieudany, wynik:", result);
        throw new Error("Nie udało się dodać faktury.");
      }
    } catch (error) {
      console.error(
        "handleConfirmSave: Błąd podczas zapisywania faktury:",
        error
      );
      closeModalConfirmationSave();
    }
  };
  //ModalSelectionWindow
  const handleCloseModalAddInvoice = () => {
    if (isOpenModalSelectionWindow) {
      closeModalSelectionWindow();
    } else if (differences.length > 0) {
      openModalSelectionWindow();
    } else {
      closeModalAddInvoice();
      resetForm();
    }
  };
  // const handleConfirmSave = async () => {
  //   const toastErrorMessage = `Nie udało się dodać faktury. Sprawdź dane i spróbuj ponownie.`;
  //   const toastSuccessMessage = `Faktura została pomyślnie dodana!`;
  //   try {
  //     const invoice: InvoiceTable = {
  //       InvoiceName: addInvoiceData.invoice.InvoiceName,
  //       ReceiptDate: addInvoiceData.invoice.ReceiptDate,
  //       DeadlineDate: addInvoiceData.invoice.DeadlineDate,
  //       PaymentDate: addInvoiceData.invoice.PaymentDate,
  //       IsDeleted: 0,
  //     };

  //     const invoiceDetails: InvoiceDetailsTable[] = addInvoiceData.details.map(
  //       (detail) => ({
  //         DocumentId: detail.DocumentId,
  //         MainTypeId: detail.MainTypeId,
  //         TypeId: detail.TypeId,
  //         SubtypeId: detail.SubtypeId,
  //         Quantity: detail.Quantity,
  //         Price: detail.Price,
  //         isMainTypeRequired: detail.isMainTypeRequired,
  //         isTypeRequired: detail.isTypeRequired,
  //         isSubtypeRequired: detail.isSubtypeRequired,
  //       })
  //     );

  //     await toast.promise(addInvoice(invoice, invoiceDetails), {
  //       loading: "Zapisywanie faktury...",
  //       success: toastSuccessMessage,
  //       error: saveInvoiceError || toastErrorMessage,
  //     });
  //     console.log("FormAddInvoice: Faktura zapisana:", saveInvoiceData);
  //     console.log(
  //       "FormAddInvoice: saveInvoiceData?.changes:",
  //       saveInvoiceData?.changes
  //     );
  //     console.log(
  //       "FormAddInvoice: saveInvoiceData.lastID:",
  //       saveInvoiceData?.lastID
  //     );
  //     console.log(
  //       "FormAddInvoice: saveInvoiceLoading:",
  //       saveInvoiceLoading.toString()
  //     );
  //     if (
  //       saveInvoiceData &&
  //       saveInvoiceData.changes &&
  //       saveInvoiceData.lastID
  //     ) {
  //       resetForm();
  //       closeModalConfirmationSave();
  //       closeModalAddInvoice();
  //       // toast.success(toastSuccessMessage);
  //     } else {
  //       // toast.error(toastErrorMessage);
  //       throw new Error("Nie udało się dodać faktury.");
  //     }
  //   } catch (error) {
  //     console.error("Błąd podczas zapisywania faktury:", error);
  //     // toast.error(toastErrorMessage);
  //     closeModalConfirmationSave();
  //   }
  // };
  return (
    <form action="" className={scss["form-add-invoice"]}>
      <div className={scss["form-add-invoice-container"]}>
        <div className={scss["form-add-invoice-title-container"]}>
          <h3 className={scss["form-add-invoice-title"]}>
            {isEditMode ? "Edytuj fakturę:" : "Dodaj nową fakturę:"}
          </h3>
          <IconInfo
            tooltipId="tooltip-formAddInvoice"
            tooltipInfoTextHtml={tooltipInfoFormAddInvoice(isEditMode)}
          />
        </div>
        <div className={scss["form-invoice-data"]}>
          <div className={scss[""]}>
            <TextInput
              inputName="invoiceName"
              singleInputValue={inputInvoiceName}
              handleSingleInputChange={handleSingleInputChange}
              inputPlaceholder="Wprowadź nazwę faktury ..."
              inputLabelText="Nazwa faktury:"
              singleInputError={inputInvoiceNameError}
              required={false}
              classNameInputContainer={scss["custom-input-container"]}
            />
          </div>
          <div className={scss["dateTimePicker-container"]}>
            <label htmlFor="dateTimePicker">Data wpływu:</label>
            <DateTimePicker
              dateTimePickerDate={dateTimePickerReceiptDate}
              setDateTimePickerDate={setDateTimePickerReceiptDate}
              isClearable={false}
            />
          </div>
          <div className={scss["dateTimePicker-container"]}>
            <label htmlFor="dateTimePicker">Termin płatności:</label>
            <DateTimePicker
              dateTimePickerDate={dateTimePickerDeadlineDate}
              setDateTimePickerDate={setDateTimePickerDeadlineDate}
            />
          </div>
          <div className={scss["dateTimePicker-container"]}>
            <label htmlFor="dateTimePicker">Data płatności:</label>
            <DateTimePicker
              dateTimePickerDate={dateTimePickerPaymentDate}
              setDateTimePickerDate={setDateTimePickerPaymentDate}
            />
          </div>
        </div>
        <div className={scss["form-add-invoice-title-container"]}>
          <h3 className={scss["form-add-invoice-title"]}>Dodaj dokumenty:</h3>
          <IconInfo
            tooltipId="tooltip-formAddDocument"
            tooltipInfoTextHtml={tooltipInfoFormAddDocument()}
          />
        </div>
        {documentComponents.map((id, index) => (
          <FormAddInvoiceDocuments
            allDocumentsData={allDocumentsData}
            key={id}
            addInvoiceData={addInvoiceData}
            setAddInvoiceData={setAddInvoiceData}
            onAddDocument={handleAddDocument}
            onRemoveDocument={() => handleRemoveDocument(id)}
            isLast={index === documentComponents.length - 1}
            isOnly={documentComponents.length === 1}
            index={index}
            modalContentRef={modalContentRef}
            detail={selectedInvoice?.details[index]} // Przekazujemy dane szczegółów
          />
        ))}
        <div className={scss["form-add-invoice-save-container"]}>
          <p>
            <strong>Całkowita kwota:</strong> {totalAmount}
          </p>
          <div className={scss["form-add-invoice-button-save-container"]}>
            <ButtonUniversal
              buttonName="saveInvoice"
              buttonText={isEditMode ? "Zapisz zmiany" : "Zapisz fakturę"}
              buttonClick={openModalConfirmationSave}
              buttonDisabled={!isSaveButtonEnabled}
              buttonIcon={<RiSave3Fill />}
              classNameButtonContainer={scss["button-save-document"]}
              toolTipId="tooltipButtonSaveInvoiceFormAddInvoice"
              toolTipContent={
                !isSaveButtonEnabled
                  ? tooltipButtonSaveInvoiceFormAddInvoice(isEditMode)
                  : undefined
              }
              toolTipClassName={`${scss["tooltip"]} `}
            />
            <ButtonUniversal
              buttonName="closeInvoice"
              buttonText="Zamknij okno"
              buttonClick={handleCloseModalAddInvoice}
              buttonIcon={<ImExit />}
              classNameButtonContainer={scss[""]}
            />
          </div>
        </div>
        <p>Wybrana faktura: {JSON.stringify(selectedInvoice)}</p>
        <p>Inna faktura: {JSON.stringify(addInvoiceData)}</p>
        <p>Różnice w fakturach: {JSON.stringify(differencesWithName)}</p>
        <h2>Różnice w fakturach</h2>
        <ul>
          {differencesWithName.map((diff, index) => (
            <li key={index}>
              <strong>{diff.key}</strong>:
              <br />
              Stara wartość: {JSON.stringify(diff.oldValue)}
              <br />
              Nowa wartość: {JSON.stringify(diff.newValue)}
            </li>
          ))}
        </ul>
      </div>
      <ModalConfirmationSave
        addInvoiceData={addInvoiceData}
        selectedInvoice={selectedInvoice}
        totalAmount={totalAmount}
        formatDocumentDetails={formatDocumentDetails}
        isOpenModalConfirmationSave={isOpenModalConfirmationSave}
        onConfirm={handleConfirmSave}
        onCancel={closeModalConfirmationSave}
        loadingDocuments={loadingAllDocumentsName}
        errorDocuments={errorAllDocumentsName}
        isEditMode={isEditMode}
      />
      <ModalSelectionWindow
        closeModalAddInvoice={closeModalAddInvoice}
        closeModalSelectionWindow={closeModalSelectionWindow}
        isModalSelectionWindowOpen={isOpenModalSelectionWindow}
        titleModalSelectionWindow="Czy na pewno chcesz zamknąć okno?"
        resetFormAddInvoice={resetForm}
      />
    </form>
  );
};

function formatDocumentDetailsFunction(
  dataAllDocumentsName: AllDocumentsName[] | null
) {
  return (detail: InvoiceDetailsTable) => {
    const document = dataAllDocumentsName?.find(
      (doc) => doc.DocumentId === detail.DocumentId
    );
    const mainType = detail.MainTypeId
      ? dataAllDocumentsName?.find(
          (doc) => doc.MainTypeId === detail.MainTypeId
        )
      : null;
    const type = detail.TypeId
      ? dataAllDocumentsName?.find((doc) => doc.TypeId === detail.TypeId)
      : null;
    const subtype = detail.SubtypeId
      ? dataAllDocumentsName?.find((doc) => doc.SubtypeId === detail.SubtypeId)
      : null;

    return {
      documentName:
        document?.DocumentName || `Dokument ID: ${detail.DocumentId}`,
      mainTypeName:
        mainType?.MainTypeName ||
        (detail.MainTypeId ? `Typ główny ID: ${detail.MainTypeId}` : ""),
      typeName:
        type?.TypeName || (detail.TypeId ? `Typ ID: ${detail.TypeId}` : ""),
      subtypeName:
        subtype?.SubtypeName ||
        (detail.SubtypeId ? `Podtyp ID: ${detail.SubtypeId}` : ""),
      quantity: detail.Quantity,
      price: detail.Price.toFixed(2),
      total: (detail.Quantity * detail.Price).toFixed(2),
    };
  };
}

function tooltipInfoFormAddInvoice(isEditMode: boolean) {
  const text = `Formularz ${isEditMode ? "edycji" : "dodania nowej"} faktury.
  Pole "Nazwa faktury" (wymagane) umożliwia wpisanie nazwy faktury.
  Pole "Data wpływu" (wymagane) umożliwia wybranie daty wpływu faktury.
  Pole "Termin płatności" (opcjonalne) umożliwia wybranie daty terminu płatności za fakturę
  Pole "Data płatności" (opcjonalne) umożliwiają wybór daty płatności za fakturę.
  Wybór daty odbywa się poprzez kliknięcie w pole, co otworzy kalendarz.`;
  return text.replace(/\n/g, "<br/>");
}

function tooltipInfoFormAddDocument() {
  const text = `Formularz dodania nowego dokumentu do faktury.
  Pole wyboru dokumentu (wymagane) umożliwia wybranie dokumentu.
  Jeżeli pojawia się kolejne pole wyboru, również należy je uzupełnić.
  Po uzupełnieniu wymaganych pól dokumentu, kwota jednostkowa pojawia się automatycznie.
  Kwotę jednostkową można zmienić w polu "Kwota jednostkowa".
  Pole "Liczba sztuk" (wymagane) umożliwia wpisanie liczby sztuk dokumentu.
  Po prawidłowym uzupełnieniu pól dokumentu pojawia się przycisk "Dodaj dokument".
  Aby dodać kolejny dokument należy kliknąć przycisk "Dodaj dokument".
  Przycisk "Usuń dokument" umożliwia usunięcie dokumentu z formularza.
  Jeżeli jest to jedyny dokument, nie można go usunąć.
  Przycisk "Zapisz fakturę" staje się aktywny po prawidłowym uzupełnieniu pól formularza.
  Po kliknięciu przycisku "Zapisz fakturę" pojawi się okno potwierdzenia zapisu.`;
  return text.replace(/\n/g, "<br/>");
}

function tooltipButtonSaveInvoiceFormAddInvoice(isEditMode: boolean) {
  const text = `Przycisk zapisu faktury zostanie uaktywniony
  po prawidłowym uzupełnieniu pól formularza ${
    isEditMode ? " i wykryciu zmian w fakturze" : ""
  }`;
  return text.replace(/\n/g, "<br/>");
}
