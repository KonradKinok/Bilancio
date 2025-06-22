import { use, useEffect, useState } from "react";
import { useAllDocumentsName } from "../../hooks/useAllDocumentName";
import toast from "react-hot-toast";
import { useAllInvoices } from "../../hooks/useAllInvoices";
// import { type FormValuesHomePage } from "../Context/ElectronProvider";
import scss from "./MainTable.module.scss";
import { useMainDataContext } from "../Context/useOptionsImage";
import {
  calculateTotalAmount,
  currencyFormater,
} from "../GlobalFunctions/GlobalFunctions";
import Pagination from "../Pagination/Pagination";
import { useToggle } from "../../hooks/useToggle";
import { ModalAddInvoice } from "../ModalAddInvoice/ModalAddInvoice";
import { useDeleteInvoice } from "../../hooks/useDeleteInvoice";
import { STATUS } from "../../../electron/sharedTypes/status";
import { ModalSelectionWindow } from "../ModalSelectionWindow/ModalSelectionWindow";

interface PageState {
  firstPage: number;
  lastPage: number;
  paginationPage: number;
}

interface MainTable {
  formValuesHomePage: FormValuesHomePage;
  setFormValuesHomePage: React.Dispatch<
    React.SetStateAction<FormValuesHomePage>
  >;
}
export const MainTable: React.FC = () => {
  const { formValuesHomePage, setFormValuesHomePage } = useMainDataContext();
  const { data: dataAllInvoices, refetch } = useAllInvoices(formValuesHomePage);
  const [totalPages, setTotalPages] = useState<number>(20);
  // Stan dla liczby wierszy na stronę
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  // Stan dla modala edycji
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
  const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);
  //Nazwy wszystkich dokumentów
  const { allDocumentsData } = useMainDataContext();
  const {
    data: dataAllDocumentsName,
    loading: loadingAllDocumentsName,
    error: errorAllDocumentsName,
  } = allDocumentsData;
  const {
    deleteInvoice,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteInvoice();
  //Delete Invoice
  const handleDeleteInvoice = (invoiceId: number) => {
    setInvoiceToDelete(invoiceId);
    openModalDeleteConfirm();
  };

  const confirmDeleteInvoice = async () => {
    if (!invoiceToDelete) return;

    try {
      const result = await toast.promise(deleteInvoice(invoiceToDelete), {
        loading: "Usuwanie faktury...",
        success: "Faktura została pomyślnie usunięta!",
        error: deleteError || "Nie udało się usunąć faktury. Spróbuj ponownie.",
      });

      if (result.status === STATUS.Success) {
        refetch(); // Odśwież listę faktur
        closeModalDeleteConfirm();
        setInvoiceToDelete(null);
      }
    } catch (err) {
      console.error("Błąd podczas usuwania faktury:", err);
    }
  };
  //Edit Invoice
  const handleEditInvoice = (invoice: AllInvoices) => {
    const invoiceData: InvoiceSave = {
      invoice: {
        InvoiceId: invoice.InvoiceId,
        InvoiceName: invoice.InvoiceName,
        ReceiptDate: invoice.ReceiptDate,
        DeadlineDate: invoice.DeadlineDate,
        PaymentDate: invoice.PaymentDate,
        IsDeleted: invoice.IsDeleted || 0,
      },
      details: invoice.DocumentNames.map((_: string, index: number) => ({
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
      })),
    };
    setSelectedInvoice(invoiceData);
    openModalAddInvoice();
  };
  //Pagination
  const initialPage = 1;
  const [page, setPage] = useState<PageState>({
    paginationPage: initialPage,
    firstPage: 2 * initialPage - 1,
    lastPage: 2 * initialPage,
  });
  const [someTemp, setSomeTemp] = useState<JakasFunkcja>();
  const [someTemp1, setSomeTemp1] = useState<PrzykladowaFunkcjaResult>();
  console.log("MainTable() useMainDataContext", formValuesHomePage);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await window.electron.przykladowaFunkcja(
          "Przykład tekstu",
          10
        );
        setSomeTemp(result);
      } catch (err) {
        console.error(
          "getAllDocumentsName() Błąd podczas pobierania danych:",
          err
        );
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await window.electron.przykladowaFunkcja2(
          "Przykład tekstu2",
          20
        );
        setSomeTemp1(result);
      } catch (err) {
        console.error(
          "getAllDocumentsName() Błąd podczas pobierania danych:",
          err
        );
      }
    };

    fetchData();
  }, []);
  const toastClick = () => {
    toast.success("Successfully created!");
  };
  // Obsługa zmiany liczby wierszy na stronę
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
  };

  // Przycięcie danych na podstawie liczby wierszy
  const displayedInvoices = dataAllInvoices
    ? dataAllInvoices.slice(0, rowsPerPage)
    : [];

  //Pagination
  const onPageChange = (newPage: number) => {
    const newFirstPage = 2 * newPage - 1;
    const newLastPage = newFirstPage + 1;

    setPage({
      paginationPage: newPage,
      firstPage: newFirstPage,
      lastPage: newLastPage,
    });
  };
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
            {displayedInvoices &&
              displayedInvoices.length > 0 &&
              displayedInvoices.map((invoice, index) => {
                const totalAmount = calculateTotalAmount(
                  invoice.Quantities,
                  invoice.Prices
                );
                return (
                  <tr key={invoice.InvoiceId}>
                    <td>{index + 1}.</td>
                    <td>{totalAmount}</td>
                    <td>{invoice.InvoiceName}</td>
                    <td>{invoice.ReceiptDate}</td>
                    <td>{invoice.DeadlineDate}</td>
                    <td>{invoice.PaymentDate}</td>
                    <td>
                      {invoice.DocumentNames &&
                        invoice.DocumentNames.map((documentName, i) => (
                          <div key={i}>
                            {i + 1}. {documentName}
                            {invoice.MainTypeNames &&
                              invoice.MainTypeNames[i] &&
                              ` ${invoice.MainTypeNames[i]}`}
                            {invoice.TypeNames &&
                              invoice.TypeNames[i] &&
                              ` ${invoice.TypeNames[i]}`}
                            {invoice.SubtypeNames &&
                              invoice.SubtypeNames[i] &&
                              ` ${invoice.SubtypeNames[i]}`}
                          </div>
                        ))}
                    </td>
                    <td>
                      {invoice.Quantities &&
                        invoice.Quantities.map((quantity, i) => (
                          <div key={i}>{quantity}</div>
                        ))}
                    </td>
                    <td>
                      {invoice.Prices &&
                        invoice.Prices.map((price, i) => (
                          <div key={i}>{currencyFormater(price)}</div>
                        ))}
                    </td>
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
                        onClick={() => handleDeleteInvoice(invoice.InvoiceId)}
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
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
          <Pagination
            className={scss.pagination}
            currentPage={page.paginationPage}
            totalCount={totalPages}
            onPageChange={(page) => onPageChange(page)}
          />
        </div>
      </div>
      <ModalAddInvoice
        isModalAddInvoiceOpen={isModalAddInvoiceOpen}
        closeModalAddInvoice={closeModalAddInvoice}
        selectedInvoice={selectedInvoice} // Przekazanie danych faktury
      />
      <ModalSelectionWindow
        closeModalSelectionWindow={closeModalDeleteConfirm}
        closeModalAddInvoice={closeModalDeleteConfirm}
        resetFormAddInvoice={() => {}}
        isModalSelectionWindowOpen={isModalDeleteConfirmOpen}
        titleModalSelectionWindow="Czy na pewno chcesz usunąć fakturę?"
        confirmDeleteInvoice={confirmDeleteInvoice}
      />
      <div>
        <button onClick={toastClick}>Refetch</button>
        <h2>Dokumenty</h2>
        {dataAllDocumentsName &&
          dataAllDocumentsName.length > 0 &&
          dataAllDocumentsName.map((document, index) => (
            <p key={index}>
              {index + 1}. {document.DocumentName}
              {document.DocumentId} {document.MainTypeName}
              {document.MainTypeId} {document.TypeName}
              {document.TypeId} {document.SubtypeName}
              {document.SubtypeId} {currencyFormater(document.Price)}
            </p>
          ))}
      </div>
      <h2>Main Table temp</h2>
      <h3>
        ContextDate: {formValuesHomePage.firstDate?.toDateString()}{" "}
        {formValuesHomePage.secondDate?.toDateString()}{" "}
        {formValuesHomePage.isDeleted}
      </h3>
      <h3>
        Tu powinien być tekst: {someTemp?.jakisNumer} {someTemp?.jakisTekst}
      </h3>
      <h3>Tu powinien być status: {someTemp1?.status}</h3>
      {someTemp1?.status === "sukces" ? (
        <h3>
          Tu powinny być dane: {someTemp1.dane.jakisTekst},{" "}
          {someTemp1.dane.jakisNumer}
        </h3>
      ) : (
        <h3>Błąd: {someTemp1?.komunikat}</h3>
      )}

      <ul className={scss[""]}>
        {dataAllInvoices && dataAllInvoices.length > 0 ? (
          dataAllInvoices.map((invoice, index) => (
            <li key={index}>{JSON.stringify(invoice)}</li>
          ))
        ) : (
          <li>No data</li>
        )}
      </ul>
    </div>
  );
};
