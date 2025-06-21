import { useState } from "react";
import { RiSave3Fill } from "react-icons/ri";
import { GiConfirmed } from "react-icons/gi";
import { GiCancel } from "react-icons/gi";
import { ButtonUniversal } from "../ButtonUniversal/ButtonUniversal";
import scss from "./ModalConfirmationSave.module.scss";
import { currencyFormater } from "../GlobalFunctions/GlobalFunctions";
import { IconInfo } from "../IconInfo/IconInfo";
import { TableInvoiceModalConfirmationSave } from "./TableInvoiceModalConfirmationSave/TableInvoiceModalConfirmationSave";
import { TableDetailsInvoiceModalConfirmationSave } from "./TableDetailsInvoiceModalConfirmationSave/TableDetailsInvoiceModalConfirmationSave";

interface ModalConfirmationSaveProps {
  addInvoiceData: InvoiceSave;
  selectedInvoice?: InvoiceSave;
  totalAmount: string;
  formatDocumentDetails: (detail: InvoiceDetailsTable) => {
    documentName: string;
    mainTypeName: string;
    typeName: string;
    subtypeName: string;
    quantity: number;
    price: string;
    total: string;
  };
  isOpenModalConfirmationSave: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loadingDocuments: boolean;
  errorDocuments: unknown;
  isEditMode: boolean;
}

export const ModalConfirmationSave: React.FC<ModalConfirmationSaveProps> = ({
  addInvoiceData,
  selectedInvoice,
  totalAmount,
  formatDocumentDetails,
  isOpenModalConfirmationSave,
  onConfirm,
  onCancel,
  loadingDocuments,
  errorDocuments,
  isEditMode,
}) => {
  return (
    <div
      className={`${scss["modalConfirmationSave-overlay"]} 
      ${isOpenModalConfirmationSave ? scss["is-open"] : ""} `}
    >
      <div className={`${scss["modal"]}`}>
        <div className={scss["modal-title-container"]}>
          <h3 className={scss["modal-title"]}>
            {isEditMode
              ? "Potwierdź edycję faktury"
              : "Potwierdź zapis faktury"}
          </h3>
          <RiSave3Fill className={scss["modal-title-icon"]} />
          <IconInfo
            tooltipId="tooltip-modalConfirmationSave"
            tooltipInfoTextHtml={tooltipInfoFormAddInvoice()}
          />
        </div>
        <div className={scss["modal-content"]}>
          <h4>Dane faktury:</h4>
          <TableInvoiceModalConfirmationSave
            addInvoiceData={addInvoiceData}
            selectedInvoice={selectedInvoice}
            isEditMode={isEditMode}
          />
          <h4>Szczegóły dokumentów:</h4>
          {/* {loadingDocuments ? (
            <p>Ładowanie danych dokumentów...</p>
          ) : errorDocuments ? (
            <p className={scss["error-message"]}>
              Błąd ładowania danych dokumentów. Wyświetlane są ID.
            </p>
          ) : addInvoiceData.details.length === 0 ? (
            <p>Brak dokumentów do wyświetlenia.</p>
          ) : (
            <table className={scss["modal-table"]}>
              <thead>
                <tr>
                  <th>Dokument</th>
                  <th>Ilość</th>
                  <th>Cena jednostkowa</th>
                  <th>Razem</th>
                </tr>
              </thead>
              <tbody>
                {addInvoiceData.details.map((detail, index) => {
                  const formatted = formatDocumentDetails(detail);
                  return (
                    <tr
                      key={index}
                      className={
                        detail.DocumentId === 0 ? scss["invalid-row"] : ""
                      }
                    >
                      <td>
                        {formatted.documentName} {formatted.mainTypeName}{" "}
                        {formatted.typeName} {formatted.subtypeName}
                      </td>
                      <td>{formatted.quantity}</td>
                      <td>{currencyFormater(formatted.price)}</td>
                      <td>{currencyFormater(formatted.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )} */}
          {loadingDocuments ? (
            <p>Ładowanie danych dokumentów...</p>
          ) : errorDocuments ? (
            <p className={scss["error-message"]}>
              Błąd ładowania danych dokumentów. Wyświetlane są ID.
            </p>
          ) : addInvoiceData.details.length === 0 ? (
            <p>Brak dokumentów do wyświetlenia.</p>
          ) : (
            <TableDetailsInvoiceModalConfirmationSave
              addInvoiceData={addInvoiceData}
              selectedInvoice={selectedInvoice}
              isEditMode={isEditMode}
              formatDocumentDetails={formatDocumentDetails}
            />
          )}
          <p>
            <strong>Całkowita kwota:</strong> {totalAmount}
          </p>
        </div>
        <div className={scss["modal-buttons"]}>
          <ButtonUniversal
            buttonName="confirmSave"
            buttonText="Zapisz"
            buttonClick={onConfirm}
            buttonIcon={<GiConfirmed />}
            classNameButtonContainer={scss["modal-button-confirm"]}
          />
          <ButtonUniversal
            buttonName="cancelSave"
            buttonText="Anuluj"
            buttonClick={onCancel}
            buttonIcon={<GiCancel />}
            classNameButtonContainer={scss["modal-button-cancel"]}
          />
        </div>
      </div>
    </div>
  );
};

function tooltipInfoFormAddInvoice() {
  const text = `Formularz potwierdzenia zapisu faktury.
  Kliknięcie przycisku "Zapisz" zapisuje dane faktury do bazy danych.
  Kliknięcie przycisku "Anuluj" zamyka okno potwierdzenia zapisu faktury i powraca do okna edycji danych faktury.`;
  return text.replace(/\n/g, "<br/>");
}
