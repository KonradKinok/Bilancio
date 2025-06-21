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

// import scss from "./TableInvoiceModalConfirmationSave.module.scss";

// interface TableInvoiceModalConfirmationSaveProps {
//   addInvoiceData: InvoiceSave;
//   selectedInvoice?: InvoiceSave;
//   isEditMode: boolean;
// }

// interface InvoiceField {
//   key: keyof InvoiceSave["invoice"];
//   label: string;
//   defaultValue: string;
// }

// const fields: InvoiceField[] = [
//   { key: "InvoiceName", label: "Nazwa faktury", defaultValue: "-" },
//   { key: "ReceiptDate", label: "Data wpływu", defaultValue: "-" },
//   { key: "DeadlineDate", label: "Termin płatności", defaultValue: "(puste)" },
//   { key: "PaymentDate", label: "Data płatności", defaultValue: "(puste)" },
// ];

// const renderCell = (
//   field: InvoiceField,
//   addInvoiceData: InvoiceSave,
//   selectedInvoice: InvoiceSave | undefined,
//   isEditMode: boolean
// ) => {
//   const newValue = addInvoiceData.invoice[field.key] || field.defaultValue;
//   const oldValue = selectedInvoice?.invoice[field.key] || field.defaultValue;

//   if (isEditMode && selectedInvoice && oldValue !== newValue) {
//     return (
//       <td>
//         <p className={scss["modal-table-deleted-data"]}>{oldValue}</p>
//         <p>{newValue}</p>
//       </td>
//     );
//   }
//   return <td>{newValue}</td>;
// };

// export const TableInvoiceModalConfirmationSave: React.FC<
//   TableInvoiceModalConfirmationSaveProps
// > = ({ addInvoiceData, selectedInvoice, isEditMode }) => {
//   return (
//     <table className={scss["modal-table"]}>
//       <thead>
//         <tr>
//           {fields.map((field) => (
//             <th key={field.key}>{field.label}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           {fields.map((field) => (
//             <td key={field.key}>
//               {renderCell(field, addInvoiceData, selectedInvoice, isEditMode)}
//             </td>
//           ))}
//         </tr>
//       </tbody>
//     </table>
//   );
// };
