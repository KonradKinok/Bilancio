import React, { useCallback, useEffect } from "react";

import scss from "./ModalAddInvoice.module.scss";

interface ModalProps {
  closeModal: () => void;
  isModalLibrariesOpen: boolean;
  poster_path: string | null;
  backdrop_path: string | null;
  title: string;
}

export function ImageModal({ closeModal, isModalLibrariesOpen }: ModalProps) {
  const handleEsc = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        console.log("Zamykam modal!");
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleEsc]);

  const handleClickOutside = () => {
    closeModal();
  };

  return (
    <div
      className={`${scss["modal-images-overlay"]} ${
        isModalLibrariesOpen ? scss["is-open"] : ""
      } `}
      onClick={handleClickOutside}
    >
      <div className={scss["modal"]}>
        <div className={scss["container-top-img"]} onClick={closeModal}></div>
        <div className={scss["container-top-img"]}></div>
      </div>
    </div>
  );
}
