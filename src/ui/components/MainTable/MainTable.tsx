import { use, useEffect, useState } from "react";
import { useAllDocumentsName } from "../../hooks/useAllDocumentName";
import { useAllInvoices } from "../../hooks/useAllInvoices";
import scss from "./MainTable.module.scss";

export const MainTable: React.FC = () => {
  const { data: dataAllInvoices, refetch } = useAllInvoices();
  const [someTemp, setSomeTemp] = useState<JakasFunkcja>();
  console.log("MainTable() dataAllInvoices", dataAllInvoices);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await window.electron.przykladowaFunkcja(
          "Przykład tekstu",
          20
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
  return (
    <div className={scss[""]}>
      <h2>Main Table temp</h2>
      <h3>
        Tu powinien być tekst: {someTemp?.jakisNumer} {someTemp?.jakisTekst}
      </h3>
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
  const totalAmount = quantities.reduce((acc, quantity, i) => {
    const price = prices[i];
    if (price) {
      return acc + parseFloat(quantity) * parseFloat(price);
    }
    return acc;
  }, 0);

  return currencyFormater(totalAmount.toString());
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
