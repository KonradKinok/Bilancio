import { useCallback, useEffect, useRef } from "react";
import { GiCancel, GiConfirmed } from "react-icons/gi";
import { ButtonUniversal } from "../ButtonUniversal/ButtonUniversal";
import scss from "./ModalSelectionWindow.module.scss";

interface ModalSelectionWindowProps {
  closeModalSelectionWindow: () => void;
  closeModalAddInvoice: () => void;
  resetFormAddInvoice: () => void;
  isModalSelectionWindowOpen: boolean;
  titleModalSelectionWindow: string;
  confirmDeleteFunction?: () => void; // Opcjonalna własna funkcja potwierdzenia
}

export function ModalSelectionWindow({
  closeModalSelectionWindow,
  closeModalAddInvoice,
  resetFormAddInvoice,
  isModalSelectionWindowOpen,
  titleModalSelectionWindow,
  confirmDeleteFunction: confirmDeleteInvoice,
}: ModalSelectionWindowProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const handleEsc = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
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

  const handleConfirm = () => {
    if (confirmDeleteInvoice) {
      confirmDeleteInvoice(); // Wywołaj własną funkcję, jeśli istnieje
    } else {
      closeModalSelectionWindow();
      closeModalAddInvoice();
      resetFormAddInvoice();
    }
  };
  const handleClose = () => {
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
