import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormAddInvoice } from "../FormAddInvoice/FormAddInvoice";
import scss from "./ModalSelectionWindow.module.scss";
import { ButtonUniversal } from "../ButtonUniversal/ButtonUniversal";
import { GiCancel, GiConfirmed } from "react-icons/gi";

interface ModalSelectionWindowProps {
  closeModalSelectionWindow: () => void;
  closeModalAddInvoice: () => void;
  resetFormAddInvoice: () => void;
  isModalSelectionWindowOpen: boolean;
  titleModalSelectionWindow: string;
  confirmDeleteInvoice?: () => void; // Opcjonalna własna funkcja potwierdzenia
}

export function ModalSelectionWindow({
  closeModalSelectionWindow,
  closeModalAddInvoice,
  resetFormAddInvoice,
  isModalSelectionWindowOpen,
  titleModalSelectionWindow,
  confirmDeleteInvoice,
}: ModalSelectionWindowProps) {
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
        closeModalSelectionWindow();
      }
    },
    [closeModalSelectionWindow]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleEsc]);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModalSelectionWindow();
    }
  };

  // const handleConfirm = () => {
  //   console.log("Zamknij");
  //   // Add your save logic here

  //   closeModalSelectionWindow();
  //   closeModalAddInvoice();
  //   resetFormAddInvoice();
  // };
  const handleConfirm = () => {
    console.log("Zamknij");
    if (confirmDeleteInvoice) {
      confirmDeleteInvoice(); // Wywołaj własną funkcję, jeśli istnieje
    } else {
      closeModalSelectionWindow();
      closeModalAddInvoice();
      resetFormAddInvoice();
    }
  };
  const handleClose = () => {
    console.log("Anuluj");
    closeModalSelectionWindow();
  };
  return (
    <div
      className={`${scss["modalSelectionWindow-main-container"]} 
      ${isModalSelectionWindowOpen ? scss["is-open"] : ""} `}
      ref={modalContentRef}
    >
      <div className={scss["modalSelectionWindow-container"]}>
        <h3>{titleModalSelectionWindow}</h3>
        <div className={scss["modal-buttons"]}>
          <ButtonUniversal
            buttonName="closeWindow"
            buttonText={confirmDeleteInvoice ? "Tak" : "Zamknij okno"}
            buttonClick={handleConfirm}
            buttonIcon={<GiConfirmed />}
            classNameButtonContainer={scss["modal-button-confirm"]}
          />
          <ButtonUniversal
            buttonName="cancelCloseWindow"
            buttonText="Anuluj"
            buttonClick={handleClose}
            buttonIcon={<GiCancel />}
            classNameButtonContainer={scss["modal-button-cancel"]}
          />
        </div>
      </div>
    </div>
  );
}
