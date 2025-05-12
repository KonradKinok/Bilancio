import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormAddInvoice } from "../FormAddInvoice/FormAddInvoice";
import scss from "./ModalAddInvoice.module.scss";

interface ModalAddInvoiceProps {
  closeModalAddInvoice: () => void;
  isModalAddInvoiceOpen: boolean;
}

export function ModalAddInvoice({
  closeModalAddInvoice,
  isModalAddInvoiceOpen,
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

  const handleEsc = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        console.log("Zamykam modal!");
        closeModalAddInvoice();
      }
    },
    [closeModalAddInvoice]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleEsc]);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModalAddInvoice();
    }
  };

  return (
    <div
      className={`${scss["add-invoice-modal-container"]} 
      ${isModalAddInvoiceOpen ? scss["is-open"] : ""} `}
      onClick={handleClickOutside}
    >
      <div className={scss["add-invoice-modal"]}>
        <div
          className={scss["add-invoice-main-container"]}
          ref={modalContentRef}
        >
          <FormAddInvoice
            addInvoiceData={addInvoiceData}
            setAddInvoiceData={setAddInvoiceData}
            closeModalAddInvoice={closeModalAddInvoice}
            modalContentRef={modalContentRef}
          />
        </div>
      </div>
    </div>
  );
}
