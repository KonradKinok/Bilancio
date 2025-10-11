import scss from "./TableReportStandardInvoice.module.scss";
import { useMainDataContext } from "../Context/useMainDataContext";
import { currencyFormater } from "../GlobalFunctions/GlobalFunctions";
import { forwardRef, useEffect } from "react";

interface TableReportStandardInvoiceProps {
  dataReportStandardInvoices: ReportStandardInvoice[] | null;
  totalPriceAllInvoices: number;
}

export const TableReportStandardInvoice = forwardRef<
  HTMLTableElement,
  TableReportStandardInvoiceProps
>(({ dataReportStandardInvoices, totalPriceAllInvoices }, ref) => {
  const { options } = useMainDataContext();

  useEffect(() => {
    // Rzutowanie ref na typ React.RefObject<HTMLTableElement>
    const tableRef = ref as React.RefObject<HTMLTableElement>;

    if ((dataReportStandardInvoices?.length ?? 0) > 0 && tableRef.current) {
      tableRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start", // lub "center"
      });
    }
  }, [dataReportStandardInvoices, ref]);

  if (!dataReportStandardInvoices || dataReportStandardInvoices.length === 0) {
    return null;
  }

  return (
    <div className={`${scss["mainTable-main-container"]}`}>
      <div>
        <table
          ref={ref}
          className={`${scss["table"]} ${scss[`${options.fontSize.en}-font`]}`}
        >
          <thead className={`${scss["table-header"]}`}>
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
            {dataReportStandardInvoices?.map((invoice, index) => {
              return (
                <tr key={invoice.InvoiceId}>
                  <td>{String(index + 1).padStart(3, "0")}.</td>
                  <td>{currencyFormater(invoice.TotalAmount)}</td>
                  <td>{invoice.InvoiceName}</td>
                  <td>{invoice.ReceiptDate}</td>
                  <td>{invoice.DeadlineDate}</td>
                  <td>{invoice.PaymentDate}</td>
                  <td>
                    {Array.isArray(invoice.Documents) &&
                    invoice.Documents.length > 0 ? (
                      invoice.Documents.map((documentName, i) => (
                        <div key={i}>
                          {i + 1}. {documentName.DocumentName}{" "}
                          {documentName.MainTypeName} {documentName.TypeName}{" "}
                          {documentName.SubtypeName}
                        </div>
                      ))
                    ) : (
                      <div></div>
                    )}
                  </td>
                  <td>
                    {Array.isArray(invoice.Documents) &&
                    invoice.Documents.length > 0 ? (
                      invoice.Documents.map((documentName, i) => (
                        <div key={i}>{documentName.Quantity}</div>
                      ))
                    ) : (
                      <div></div>
                    )}
                  </td>
                  <td>
                    {Array.isArray(invoice.Documents) &&
                    invoice.Documents.length > 0 ? (
                      invoice.Documents.map((documentName, i) => (
                        <div key={i}>
                          {currencyFormater(documentName.Price)}
                        </div>
                      ))
                    ) : (
                      <div></div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={scss["maintable-footer-container"]}>
          <p>Liczba faktur: {dataReportStandardInvoices?.length}</p>
          <p>Suma cen faktur: {currencyFormater(totalPriceAllInvoices)}</p>
        </div>
      </div>
    </div>
  );
});

// opcjonalnie dodaj nazwę komponentu (przydatne w devtools)
TableReportStandardInvoice.displayName = "TableReportStandardInvoice";
