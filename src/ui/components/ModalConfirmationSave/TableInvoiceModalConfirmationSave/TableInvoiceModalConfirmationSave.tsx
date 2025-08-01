import scss from "./TableInvoiceModalConfirmationSave.module.scss";

interface TableInvoiceModalConfirmationSaveProps {
  addInvoiceData: InvoiceSave;
  selectedInvoice?: InvoiceSave;
  isEditMode: boolean;
}

export const TableInvoiceModalConfirmationSave: React.FC<
  TableInvoiceModalConfirmationSaveProps
> = ({ addInvoiceData, selectedInvoice, isEditMode }) => {
  return (
    <>
      <table className={scss["modal-table"]}>
        <thead>
          <tr>
            <th>Nazwa faktury</th>
            <th>Data wpływu</th>
            <th>Termin płatności</th>
            <th>Data płatności</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {isEditMode &&
            selectedInvoice?.invoice.InvoiceName !==
              addInvoiceData.invoice.InvoiceName ? (
              <td>
                {" "}
                <p className={scss["modal-table-deleted-data"]}>
                  {selectedInvoice?.invoice.InvoiceName || "(puste)"}
                </p>
                <p>{addInvoiceData.invoice.InvoiceName || "(puste)"}</p>
              </td>
            ) : (
              <td> {addInvoiceData.invoice.InvoiceName || "-"}</td>
            )}
            {isEditMode &&
            selectedInvoice?.invoice.ReceiptDate !==
              addInvoiceData.invoice.ReceiptDate ? (
              <td>
                {" "}
                <p className={scss["modal-table-deleted-data"]}>
                  {selectedInvoice?.invoice.ReceiptDate || "(puste)"}
                </p>
                <p>{addInvoiceData.invoice.ReceiptDate || "(puste)"}</p>
              </td>
            ) : (
              <td> {addInvoiceData.invoice.ReceiptDate || "-"}</td>
            )}
            {isEditMode &&
            selectedInvoice?.invoice.DeadlineDate !==
              addInvoiceData.invoice.DeadlineDate ? (
              <td>
                {" "}
                <p className={scss["modal-table-deleted-data"]}>
                  {selectedInvoice?.invoice.DeadlineDate || "(puste)"}
                </p>
                <p>{addInvoiceData.invoice.DeadlineDate || "(puste)"}</p>
              </td>
            ) : (
              <td> {addInvoiceData.invoice.DeadlineDate || "-"}</td>
            )}
            {isEditMode &&
            selectedInvoice?.invoice.PaymentDate !==
              addInvoiceData.invoice.PaymentDate ? (
              <td>
                {" "}
                <p className={scss["modal-table-deleted-data"]}>
                  {selectedInvoice?.invoice.PaymentDate || "(puste)"}
                </p>
                <p>{addInvoiceData.invoice.PaymentDate || "(puste)"}</p>
              </td>
            ) : (
              <td> {addInvoiceData.invoice.PaymentDate || "-"}</td>
            )}
          </tr>
        </tbody>
      </table>
    </>
  );
};
