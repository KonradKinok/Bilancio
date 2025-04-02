import { use, useEffect, useState } from "react";
import { useAllDocumentsName } from "../../hooks/useAllDocumentName";
import { useAllInvoices } from "../../hooks/useAllInvoices";
import { type FormValuesHomePage } from "../../pages/HomePage/HomePage";
import scss from "./MainTable.module.scss";
interface MainTable {
  formValuesHomePage: FormValuesHomePage;
  setFormValuesHomePage: React.Dispatch<
    React.SetStateAction<FormValuesHomePage>
  >;
}
export const MainTable: React.FC<MainTable> = ({
  formValuesHomePage,
  setFormValuesHomePage,
}) => {
  const { data: dataAllInvoices, refetch } = useAllInvoices(formValuesHomePage);
  const [someTemp, setSomeTemp] = useState<JakasFunkcja>();
  const [someTemp1, setSomeTemp1] = useState<PrzykladowaFunkcjaResult>();
  console.log("MainTable() dataAllInvoices", dataAllInvoices);
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
  return (
    <div className={scss[""]}>
      <h2>Main Table temp</h2>
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
      <button onClick={refetch}>Refetch</button>
      <ul className={scss[""]}>
        {dataAllInvoices && dataAllInvoices.length > 0 ? (
          dataAllInvoices.map((invoice, index) => (
            <li key={index}>{JSON.stringify(invoice)}</li>
          ))
        ) : (
          <li>No data</li>
        )}
      </ul>

      <table>
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
          </tr>
        </thead>
        <tbody>
          {dataAllInvoices &&
            dataAllInvoices.length > 0 &&
            dataAllInvoices.map((invoice, index) => {
              const totalAmount = calculateTotalAmount(
                invoice.Quantities,
                invoice.Prices
              );
              return (
                <tr key={invoice.InvoiceId}>
                  <td>{index + 1}</td>
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
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

// function calculateTotalAmount(quantities: string[], prices: string[]): number {
//   return quantities.reduce((acc, quantity, i) => {
//     const price = prices[i];
//     if (price) {
//       return acc + parseFloat(quantity) * parseFloat(price);
//     }
//     return acc;
//   }, 0);
// }

function calculateTotalAmount(quantities: string[], prices: string[]): string {
  if (quantities && prices) {
    const totalAmount = quantities.reduce((acc, quantity, i) => {
      const price = prices[i];
      if (price) {
        return acc + parseFloat(quantity) * parseFloat(price);
      }
      return acc;
    }, 0);

    return currencyFormater(totalAmount.toString());
  }
  return currencyFormater("0");
}

function currencyFormater(value: string): string {
  const currencyFormatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  });
  // Sprawdzenie, czy value jest różne od null i undefined
  if (value == null) {
    return currencyFormatter.format(0); // Zwrócenie "0,00zł"
  }
  const num = parseFloat(value.replace(",", "."));
  // Sprawdzenie, czy num jest NaN
  if (isNaN(num)) {
    return currencyFormatter.format(0); // Zwrócenie "0,00zł"
  }
  return currencyFormatter.format(num);
}
