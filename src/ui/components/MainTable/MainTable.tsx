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

  //Nazwy wszystkich dokumentów
  const { allDocumentsData } = useMainDataContext();
  const {
    data: dataAllDocumentsName,
    loading: loadingAllDocumentsName,
    error: errorAllDocumentsName,
  } = allDocumentsData;

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
                            {documentName}
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
                    <td className={scss.actions}>
                      <button className={scss.editButton}>Edytuj</button>
                    </td>
                    <td className={scss.actions}>
                      <button className={scss.deleteButton}>Usuń</button>
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
