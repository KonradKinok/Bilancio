import { useEffect, useRef, useState } from "react";
import { FormAddInvoice } from "../FormAddInvoice/FormAddInvoice";
import scss from "./ModalAddInvoice.module.scss";

interface ModalAddInvoiceProps {
  invoiceToChangeTemp?: InvoiceSave;
  setInvoiceToChangeTemp?: React.Dispatch<
    React.SetStateAction<InvoiceSave | undefined>
  >;

  closeModalAddInvoice: () => void;
  isModalAddInvoiceOpen: boolean;
  selectedInvoice?: InvoiceSave;
  refetchAllInvoices: () => void;
}

export function ModalAddInvoice({
  closeModalAddInvoice,
  isModalAddInvoiceOpen,
  selectedInvoice,
  refetchAllInvoices,
  invoiceToChangeTemp,
  setInvoiceToChangeTemp,
}: ModalAddInvoiceProps) {
  const [addInvoiceData, setAddInvoiceData] = useState<InvoiceSave>({
    invoice: {
      InvoiceId: undefined,
      InvoiceName: "",
      ReceiptDate: "",
      DeadlineDate: null,
      PaymentDate: "",
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
      },
    ],
  });

  const modalContentRef = useRef<HTMLDivElement>(null);

  // Aktualizacja addInvoiceData, gdy selectedInvoice się zmienia
  useEffect(() => {
    if (selectedInvoice) {
      setAddInvoiceData(selectedInvoice);
    }
  }, [selectedInvoice]);

  return (
    <div
      className={`${scss["add-invoice-modal-container"]} 
      ${isModalAddInvoiceOpen ? scss["is-open"] : ""} `}
    >
      <div className={scss["add-invoice-modal"]}>
        <div
          className={scss["add-invoice-main-container"]}
          ref={modalContentRef}
        >
          <FormAddInvoice
            invoiceToChangeTemp={invoiceToChangeTemp}
            setInvoiceToChangeTemp={setInvoiceToChangeTemp}
            addInvoiceData={addInvoiceData}
            setAddInvoiceData={setAddInvoiceData}
            closeModalAddInvoice={closeModalAddInvoice}
            modalContentRef={modalContentRef}
            selectedInvoice={selectedInvoice}
            isEditMode={!!invoiceToChangeTemp?.invoice.InvoiceId} // Przekazujemy informację o trybie edycji
            refetchAllInvoices={refetchAllInvoices}
          />
        </div>
      </div>
    </div>
  );
}
