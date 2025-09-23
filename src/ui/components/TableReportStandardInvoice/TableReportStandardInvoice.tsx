import scss from "./TableReportStandardInvoice.module.scss";
import { useMainDataContext } from "../Context/useMainDataContext";

interface TableReportStandardInvoiceProps {
  dataReportStandardInvoices: ReportStandardInvoice[] | null;
}

export const TableReportStandardInvoice = ({
  dataReportStandardInvoices,
}: TableReportStandardInvoiceProps) => {
  const { options } = useMainDataContext();
  if (!dataReportStandardInvoices || dataReportStandardInvoices.length === 0) {
    return <div></div>;
  }

  return (
    <div className={`${scss["mainTable-main-container"]}`}>
      <div>
        <table
          className={`${scss["table"]} ${scss[`${options.fontSize.en}-font`]}`}
        >
          <thead className={`${scss["table-header"]}`}>
            <tr>
              <th>Lp.</th>
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
                        <div key={i}>{documentName.Price}</div>
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
          <div className={scss["maintable-controls-container"]}>
            <div className={scss["total-invoices"]}>
              <p>Liczba faktur: {dataReportStandardInvoices?.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
