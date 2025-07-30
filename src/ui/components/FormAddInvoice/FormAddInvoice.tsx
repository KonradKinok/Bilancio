import { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import { RiSave3Fill } from "react-icons/ri";
import { ImExit } from "react-icons/im";
import { STATUS } from "../../../electron/sharedTypes/status";
import { useToggle } from "../../hooks/useToggle";
import { useAddInvoice } from "../../hooks/useAddInvoice";
import { useUpdateInvoice } from "../../hooks/useUpdateInvoice";
import { useAllDocumentsName } from "../../hooks/useAllDocumentName";
import {
  calculateTotalAmount,
  compareInvoices,
  displayErrorMessage,
  getFormatedDate,
  formatDocumentDetailsFunction,
  formatDocumentDetailsFunctionChanges,
} from "../GlobalFunctions/GlobalFunctions";
import { DateTimePicker } from "../DateTimePicker/DateTimePicker";
import { FormAddInvoiceDocuments } from "../FormAddInvoiceDocuments/FormAddInvoiceDocuments";
import { TextInput } from "../TextInput/TextInput";
import { ButtonUniversal } from "../ButtonUniversal/ButtonUniversal";
import { IconInfo } from "../IconInfo/IconInfo";
import { ModalConfirmationSave } from "../ModalConfirmationSave/ModalConfirmationSave";
import { ModalSelectionWindow } from "../ModalSelectionWindow/ModalSelectionWindow";
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
  //ModalConfirmationSave
  const {
    isOpenModal: isOpenModalConfirmationSave,
    openModal: openModalConfirmationSave,
    closeModal: closeModalConfirmationSave,
  } = useToggle();

  //ModalSelectionWindow
  const {
    isOpenModal: isOpenModalSelectionWindow,
    openModal: openModalSelectionWindow,
    closeModal: closeModalSelectionWindow,
  } = useToggle();

  //AllDocumentsName hook
  const {
    data: dataAllDocumentsName,
    loading: loadingAllDocumentsName,
    error: errorAllDocumentsName,
  } = useAllDocumentsName(0);

  //Różnice w fakturach
  const [invoiceDifference, setInvoiceDifference] = useState<
    InvoicesDifferences[]
  >([]);

  //Inputy
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

  //AddInvoice hook
  const { addInvoice } = useAddInvoice();

  //UpdateInvoice hook
  const { updateInvoice } = useUpdateInvoice();

  // Przygotowanie tablic quantities i prices dla calculateTotalAmount
  const quantities = addInvoiceData.details.map((detail) =>
    detail.Quantity.toString()
  );
  const prices = addInvoiceData.details.map((detail) =>
    detail.Price.toString()
  );
  const totalAmount = calculateTotalAmount(quantities, prices);

  // Porównanie wybranej faktury z danymi do dodania
  useEffect(() => {
    setInvoiceDifference(compareInvoices(selectedInvoice, addInvoiceData));
  }, [selectedInvoice, addInvoiceData]);
  // const formatDifferences =
  //   formatDocumentDetailsFunctionChanges(dataAllDocumentsName);
  // const differencesWithName = formatDifferences(differences);
  // Funkcja do formatowania szczegółów dokumentu
  const formatDocumentDetails =
    formatDocumentDetailsFunction(dataAllDocumentsName);

  useEffect(() => {}, []);
  // Aktualizacja dat w addInvoiceData
  useEffect(() => {
    setAddInvoiceData((prev) => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        ReceiptDate: getFormatedDate(dateTimePickerReceiptDate) || "",
        DeadlineDate: getFormatedDate(dateTimePickerDeadlineDate),
        PaymentDate: getFormatedDate(dateTimePickerPaymentDate) || null,
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
    if (isEditMode && invoiceDifference.length === 0) return false; // Jeśli jest tryb edycji i nie ma różnic, nie pozwalamy na zapis
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
    invoiceDifference,
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

  //Dodawanie dokumentów do formularza faktury
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

  //Usuwanie dokumentów z formularza faktury
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
    const successText = `Faktura została pomyślnie ${
      isEditMode ? "zaktualizowana" : "dodana"
    }!`;
    const errorText = `Nie udało się ${
      isEditMode ? "zaktualizować" : "dodać"
    } faktury.`;

    try {
      // Walidacja formularza
      if (!validateForm()) {
        const errorTekst = "Walidacja formularza niudana.";
        displayErrorMessage(
          "FormAddInvoice",
          "handleConfirmSave-validateForm",
          errorTekst
        );
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

      //Rozpoczynanie zapisu faktury.
      const result = await (isEditMode
        ? updateInvoice(invoice, invoiceDetails)
        : addInvoice(invoice, invoiceDetails));

      if (result.status === STATUS.Success) {
        toast.success(`${successText}`);
        resetForm();
        closeModalConfirmationSave();
        closeModalAddInvoice();
        refetchAllInvoices();
      } else {
        displayErrorMessage(
          "FormAddInvoice",
          "handleConfirmSave",
          `${errorText} ${result.message}`
        );
      }
    } catch (err) {
      displayErrorMessage("FormAddInvoice", "handleConfirmSave", err);
      closeModalConfirmationSave();
    }
  };

  //Zamykanie ModalSelectionWindow
  const handleCloseModalAddInvoice = () => {
    if (isOpenModalSelectionWindow) {
      closeModalSelectionWindow();
    } else if (invoiceDifference.length > 0) {
      openModalSelectionWindow();
    } else {
      closeModalAddInvoice();
      resetForm();
    }
  };

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
            dataAllDocumentsName={dataAllDocumentsName}
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
        {/* <p>Wybrana faktura: {JSON.stringify(selectedInvoice)}</p>
        <p>Inna faktura: {JSON.stringify(addInvoiceData)}</p>
        <p>Różnice w fakturach: {JSON.stringify(differences)}</p>
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
        </ul> */}
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
