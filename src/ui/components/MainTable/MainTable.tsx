import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { STATUS } from "../../../electron/sharedTypes/status";
import { useToggle } from "../../hooks/useToggle";
import { useDeleteInvoice } from "../../hooks/useDeleteInvoice";
import { useRestoreInvoice } from "../../hooks/useRestoreInvoice";
import {
  calculateTotalAmount,
  currencyFormater,
  displayErrorMessage,
} from "../GlobalFunctions/GlobalFunctions";
import Pagination from "../Pagination/Pagination";
import { ModalAddInvoice } from "../ModalAddInvoice/ModalAddInvoice";
import { ModalSelectionWindow } from "../ModalSelectionWindow/ModalSelectionWindow";
import scss from "./MainTable.module.scss";
import { useMainDataContext } from "../Context/useMainDataContext";

interface MainTableProps {
  setFormValuesHomePage: React.Dispatch<
    React.SetStateAction<FormValuesHomePage>
  >;
  dataAllInvoices: AllInvoices[] | null;
  refetchAllInvoices: () => void;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalCount: number;
}

export const MainTable: React.FC<MainTableProps> = ({
  dataAllInvoices,
  refetchAllInvoices,
  rowsPerPage,
  setRowsPerPage,
  page,
  setPage,
  totalCount,
}) => {
  const { dotsNumber, setDotsNumber } = useMainDataContext();
  useEffect(() => {
    if (dotsNumber !== totalCount && totalCount > 0) {
      setDotsNumber(totalCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCount, dotsNumber]);

  const {
    isOpenModal: isModalAddInvoiceOpen,
    openModal: openModalAddInvoice,
    closeModal: closeModalAddInvoice,
  } = useToggle();

  const {
    isOpenModal: isModalDeleteConfirmOpen,
    openModal: openModalDeleteConfirm,
    closeModal: closeModalDeleteConfirm,
  } = useToggle();

  const [selectedInvoice, setSelectedInvoice] = useState<
    InvoiceSave | undefined
  >(undefined);
  const [invoiceToChangeTemp, setInvoiceToChangeTemp] = useState<
    InvoiceSave | undefined
  >(undefined);
  //Delete/Restore Invoice hooks
  const { restoreInvoice } = useRestoreInvoice();
  const { deleteInvoice } = useDeleteInvoice();

  //Delete/Restore Invoice
  const handleDeleteRestoreInvoice = useCallback(
    (invoice: AllInvoices) => {
      const invoiceData = selectedInvoiceData(invoice);
      setSelectedInvoice(invoiceData);
      openModalDeleteConfirm();
    },
    [openModalDeleteConfirm]
  );

  const confirmDeleteRestoreInvoice = useCallback(async () => {
    if (!selectedInvoice?.invoice.InvoiceId) return;
    const successText = `Faktura ${
      selectedInvoice.invoice.InvoiceName
    } została pomyślnie ${
      selectedInvoice?.invoice.IsDeleted === 0 ? "usunięta" : "przywrócona"
    }.`;
    const errorText = `Nie udało się ${
      selectedInvoice?.invoice.IsDeleted === 0 ? "usunąć" : "przywrócić"
    } faktury ${selectedInvoice.invoice.InvoiceName}.`;
    try {
      const result = await (selectedInvoice?.invoice.IsDeleted === 0
        ? deleteInvoice(selectedInvoice?.invoice.InvoiceId)
        : restoreInvoice(selectedInvoice?.invoice.InvoiceId));
      if (result.status === STATUS.Success) {
        refetchAllInvoices();
        closeModalDeleteConfirm();
        setSelectedInvoice(undefined);
        toast.success(successText);
      } else {
        displayErrorMessage(
          "MainTable",
          "confirmDeleteRestoreInvoice",
          `${errorText} ${result.message}`
        );
      }
    } catch (err) {
      displayErrorMessage("MainTable", "confirmDeleteRestoreInvoice", err);
    }
  }, [
    selectedInvoice,
    deleteInvoice,
    restoreInvoice,
    refetchAllInvoices,
    closeModalDeleteConfirm,
  ]);

  const handleEditInvoice = useCallback(
    (invoice: AllInvoices) => {
      const invoiceData = selectedInvoiceData(invoice);
      setSelectedInvoice(invoiceData);
      setInvoiceToChangeTemp(invoiceData);
      openModalAddInvoice();
    },
    [openModalAddInvoice]
  );

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(event.target.value));
      setPage(1);
    },
    [setRowsPerPage, setPage]
  );

  const onPageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const totalPages = useMemo(
    () => Math.ceil(totalCount / rowsPerPage),
    [totalCount, rowsPerPage]
  );

  const getGlobalIndex = useCallback(
    (index: number) => {
      return (page - 1) * rowsPerPage + index + 1;
    },
    [page, rowsPerPage]
  );

  return (
    <div className={scss["mainTable-main-container"]}>
      <div>
        <table className={scss["table"]}>
          <thead>
            <tr>
              <th>Lp.</th>
              <th>Suma faktury</th>
              <th>Nazwa faktury</th>
              <th>Data wpływu</th>
              <th>Termin płatności</th>
              <th>Data płatności</th>
              <th>Dokumenty</th>
              <th>Liczba</th>
              <th>Cena</th>
              <th colSpan={2}>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {dataAllInvoices &&
              dataAllInvoices.length > 0 &&
              dataAllInvoices.map((invoice, index) => {
                const totalAmount = calculateTotalAmount(
                  Array.isArray(invoice.Quantities) ? invoice.Quantities : [],
                  Array.isArray(invoice.Prices) ? invoice.Prices : []
                );
                return (
                  <tr
                    key={invoice.InvoiceId}
                    onDoubleClick={() =>
                      invoice.IsDeleted === 0 && handleEditInvoice(invoice)
                    }
                  >
                    <td>{getGlobalIndex(index)}.</td>
                    <td>{totalAmount}</td>
                    <td>{invoice.InvoiceName}</td>
                    <td>{invoice.ReceiptDate}</td>
                    <td>{invoice.DeadlineDate}</td>
                    <td>{invoice.PaymentDate}</td>
                    <td>
                      {Array.isArray(invoice.DocumentNames) &&
                      invoice.DocumentNames.length > 0 ? (
                        invoice.DocumentNames.map((documentName, i) => (
                          <div key={i}>
                            {i + 1}. {documentName}
                            {Array.isArray(invoice.MainTypeNames) &&
                              invoice.MainTypeNames[i] &&
                              ` ${invoice.MainTypeNames[i]}`}
                            {Array.isArray(invoice.TypeNames) &&
                              invoice.TypeNames[i] &&
                              ` ${invoice.TypeNames[i]}`}
                            {Array.isArray(invoice.SubtypeNames) &&
                              invoice.SubtypeNames[i] &&
                              ` ${invoice.SubtypeNames[i]}`}
                          </div>
                        ))
                      ) : (
                        <div></div>
                      )}
                    </td>
                    <td>
                      {Array.isArray(invoice.Quantities) &&
                      invoice.Quantities.length > 0 ? (
                        invoice.Quantities.map((quantity, i) => (
                          <div key={i}>{quantity}</div>
                        ))
                      ) : (
                        <div></div>
                      )}
                    </td>
                    <td>
                      {Array.isArray(invoice.Prices) &&
                      invoice.Prices.length > 0 ? (
                        invoice.Prices.map((price, i) => (
                          <div key={i}>{currencyFormater(price)}</div>
                        ))
                      ) : (
                        <div></div>
                      )}
                    </td>
                    {invoice.IsDeleted === 0 ? (
                      <>
                        <td className={scss[""]}>
                          <button
                            className={scss["edit-button"]}
                            onClick={() => handleEditInvoice(invoice)}
                          >
                            Edytuj
                          </button>
                        </td>
                        <td className={scss[""]}>
                          <button
                            className={scss["delete-button"]}
                            onClick={() => handleDeleteRestoreInvoice(invoice)}
                          >
                            Usuń
                          </button>
                        </td>
                      </>
                    ) : (
                      <td className={scss[""]}>
                        <button
                          className={scss["delete-button"]}
                          onClick={() => handleDeleteRestoreInvoice(invoice)}
                        >
                          Przywróć
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className={scss["maintable-footer-container"]}>
          <div className={scss["maintable-controls-container"]}>
            <div className={scss["controls"]}>
              <label className={scss["label"]} htmlFor="rowsPerPage">
                Wiersze na stronę:{" "}
              </label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className={scss["select"]}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className={scss["total-invoices"]}>
              <p>Liczba faktur: {totalCount}</p>
            </div>
          </div>

          <Pagination
            className={scss.pagination}
            currentPage={page}
            totalCount={totalPages}
            onPageChange={(page) => onPageChange(page)}
          />
        </div>
      </div>
      <ModalAddInvoice
        isModalAddInvoiceOpen={isModalAddInvoiceOpen}
        closeModalAddInvoice={closeModalAddInvoice}
        selectedInvoice={selectedInvoice} // Przekazanie danych faktury
        invoiceToChangeTemp={invoiceToChangeTemp} // Tymczasowe dane faktury do edycji
        setInvoiceToChangeTemp={setInvoiceToChangeTemp} // Funkcja do ustawienia tymczasowych danych faktury
        refetchAllInvoices={refetchAllInvoices} // Funkcja do odświeżenia listy faktur
      />
      <ModalSelectionWindow
        closeModalSelectionWindow={closeModalDeleteConfirm}
        closeModalAddInvoice={closeModalDeleteConfirm}
        resetFormAddInvoice={() => {}}
        isModalSelectionWindowOpen={isModalDeleteConfirmOpen}
        titleModalSelectionWindow={`Czy na pewno chcesz ${
          selectedInvoice?.invoice.IsDeleted == 0 ? "usunąć" : "przywrócić"
        } fakturę\n\r ${selectedInvoice?.invoice.InvoiceName} z dnia ${
          selectedInvoice?.invoice.ReceiptDate
        }?`}
        confirmDeleteFunction={confirmDeleteRestoreInvoice}
      />
    </div>
  );
};

const selectedInvoiceData = (invoice: AllInvoices): InvoiceSave => {
  const details = Array.isArray(invoice.DocumentNames)
    ? invoice.DocumentNames.map((_: string, index: number) => ({
        InvoiceId: invoice.InvoiceId,
        DocumentId: parseInt(invoice.DocumentIds?.[index] || "0", 10),
        MainTypeId: invoice.MainTypeIds?.[index]
          ? parseInt(invoice.MainTypeIds[index], 10) || null
          : null,
        TypeId: invoice.TypeIds?.[index]
          ? parseInt(invoice.TypeIds[index], 10) || null
          : null,
        SubtypeId: invoice.SubtypeIds?.[index]
          ? parseInt(invoice.SubtypeIds[index], 10) || null
          : null,
        Quantity: parseInt(invoice.Quantities?.[index] || "0", 10),
        Price: parseFloat(invoice.Prices?.[index] || "0"),
        isMainTypeRequired: !!(
          invoice.MainTypeIds && invoice.MainTypeIds[index]
        ),
        isTypeRequired: !!(invoice.TypeIds && invoice.TypeIds[index]),
        isSubtypeRequired: !!(invoice.SubtypeIds && invoice.SubtypeIds[index]),
      }))
    : [
        {
          InvoiceId: invoice.InvoiceId,
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
      ];

  const invoiceData: InvoiceSave = {
    invoice: {
      InvoiceId: invoice.InvoiceId,
      InvoiceName: invoice.InvoiceName,
      ReceiptDate: invoice.ReceiptDate,
      DeadlineDate: invoice.DeadlineDate,
      PaymentDate: invoice.PaymentDate,
      IsDeleted: invoice.IsDeleted || 0,
    },
    details,
  };

  return invoiceData;
};
