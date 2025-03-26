import { use, useEffect, useState } from "react";
import { useAllDocumentsName } from "../../hooks/useAllDocumentName";
import { useAllInvoices } from "../../hooks/useAllInvoices";
import scss from "./MainTable.module.scss";

const data1 = [
  {
    DocumentName: "DocumentName",
    MainTypeName: "MainTypeName",
    TypeName: "TypeName",
    SubtypeName: "SubtypeName",
  },
];
export const MainTable: React.FC = () => {
  const { data: dataAllInvoices } = useAllInvoices();
  console.log("MainTable() dataAllInvoices", dataAllInvoices);
  return (
    <div className={scss[""]}>
      <h2>Main Table temp</h2>
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
            dataAllInvoices.map(
              (
                {
                  InvoiceId,
                  InvoiceName,
                  ReceiptDate,
                  DeadlineDate,
                  PaymentDate,
                  IsDeleted,
                  DocumentNames,
                  MainTypeNames,
                  TypeNames,
                  SubtypeNames,
                  Quantities,
                  Prices,
                },
                index
              ) => {
                // Obliczanie sumy opłaty za fakturę
                const totalAmount = calculateTotalAmount(Quantities, Prices);

                return (
                  <tr key={InvoiceId}>
                    <td>{++index}</td>
                    <td>{totalAmount}</td> {/* Wyświetlanie sumy opłaty */}
                    <td>{InvoiceName}</td>
                    <td>{ReceiptDate}</td>
                    <td>{DeadlineDate}</td>
                    <td>{PaymentDate}</td>
                    <td>
                      {DocumentNames &&
                        DocumentNames.map((documentName, i) => (
                          <div key={i}>
                            {documentName}{" "}
                            {MainTypeNames && MainTypeNames[i]
                              ? MainTypeNames[i]
                              : ""}{" "}
                            {TypeNames && TypeNames[i] ? TypeNames[i] : ""}{" "}
                            {SubtypeNames && SubtypeNames[i]
                              ? SubtypeNames[i]
                              : ""}
                          </div>
                        ))}
                    </td>
                    <td>
                      {Quantities &&
                        Quantities.map((quantities, i) => (
                          <div key={i}>{quantities} </div>
                        ))}
                    </td>
                    <td>
                      {Prices &&
                        Prices.map((price, i) => (
                          <div key={i}>{currencyFormater(price)} </div>
                        ))}
                    </td>
                  </tr>
                );
              }
            )}
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
