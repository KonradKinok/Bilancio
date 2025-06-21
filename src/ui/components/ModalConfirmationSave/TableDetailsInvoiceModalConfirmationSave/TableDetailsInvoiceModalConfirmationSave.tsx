import { currencyFormater } from "../../GlobalFunctions/GlobalFunctions";
import scss from "./TableDetailsInvoiceModalConfirmationSave.module.scss";

interface TableDetailsInvoiceModalConfirmationSaveProps {
  addInvoiceData: InvoiceSave;
  selectedInvoice?: InvoiceSave;
  formatDocumentDetails: (detail: InvoiceDetailsTable) => {
    documentName: string;
    mainTypeName: string;
    typeName: string;
    subtypeName: string;
    quantity: number;
    price: string;
    total: string;
  };
  isEditMode: boolean;
}

export const TableDetailsInvoiceModalConfirmationSave: React.FC<
  TableDetailsInvoiceModalConfirmationSaveProps
> = ({
  addInvoiceData,
  selectedInvoice,
  formatDocumentDetails,
  isEditMode,
}) => {
  return (
    <table className={scss["modal-table"]}>
      <thead>
        <tr>
          <th>Dokument</th>
          <th>Ilość</th>
          <th>Cena jednostkowa</th>
          <th>Razem</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({
          length: Math.max(
            addInvoiceData.details.length,
            selectedInvoice?.details?.length || 0
          ),
        }).map((_, index) => {
          const detail = addInvoiceData.details[index];
          const selectedDetail = selectedInvoice?.details?.[index];
          const formatted = detail ? formatDocumentDetails(detail) : null;
          const selectedFormatted = selectedDetail
            ? formatDocumentDetails(selectedDetail)
            : null;

          // Indywidualne porównania dla każdej kolumny
          const isDocumentDifferent =
            isEditMode &&
            detail &&
            selectedDetail &&
            (detail.DocumentId !== selectedDetail.DocumentId ||
              detail.MainTypeId !== selectedDetail.MainTypeId ||
              detail.TypeId !== selectedDetail.TypeId ||
              detail.SubtypeId !== selectedDetail.SubtypeId);
          console.log(
            "ModalConfirmationSave: isDocumentDifferent",
            isDocumentDifferent
          );
          console.log("ModalConfirmationSave: detail", detail, selectedDetail);
          const isQuantityDifferent =
            isEditMode &&
            detail &&
            selectedDetail &&
            detail.Quantity !== selectedDetail.Quantity;

          const isPriceDifferent =
            isEditMode &&
            detail &&
            selectedDetail &&
            detail.Price !== selectedDetail.Price;

          const isTotalDifferent =
            isEditMode &&
            detail &&
            selectedDetail &&
            (detail.Quantity !== selectedDetail.Quantity ||
              detail.Price !== selectedDetail.Price);

          const isMissingOne = isEditMode && (!detail || !selectedDetail);

          return (
            <tr
              key={index}
              className={detail?.DocumentId === 0 ? scss["invalid-row"] : ""}
            >
              <td>
                {isEditMode && (isDocumentDifferent || isMissingOne) ? (
                  <>
                    {selectedFormatted ? (
                      <p
                        className={
                          !formatted || isDocumentDifferent
                            ? scss["modal-table-deleted-data"]
                            : ""
                        }
                      >
                        {selectedFormatted.documentName}{" "}
                        {selectedFormatted.mainTypeName}{" "}
                        {selectedFormatted.typeName}{" "}
                        {selectedFormatted.subtypeName}
                      </p>
                    ) : (
                      <p className={scss["modal-table-deleted-data"]}>
                        (puste)
                      </p>
                    )}
                    {formatted ? (
                      <p>
                        {formatted.documentName} {formatted.mainTypeName}{" "}
                        {formatted.typeName} {formatted.subtypeName}
                      </p>
                    ) : (
                      <p>(puste)</p>
                    )}
                  </>
                ) : formatted ? (
                  <>
                    {formatted.documentName} {formatted.mainTypeName}{" "}
                    {formatted.typeName} {formatted.subtypeName}
                  </>
                ) : (
                  <p>(puste)</p>
                )}
              </td>
              <td>
                {isEditMode && (isQuantityDifferent || isMissingOne) ? (
                  <>
                    {selectedFormatted ? (
                      <p
                        className={
                          !formatted || isQuantityDifferent
                            ? scss["modal-table-deleted-data"]
                            : ""
                        }
                      >
                        {selectedFormatted.quantity}
                      </p>
                    ) : (
                      <p className={scss["modal-table-deleted-data"]}>
                        (puste)
                      </p>
                    )}
                    {formatted ? <p>{formatted.quantity}</p> : <p>(puste)</p>}
                  </>
                ) : formatted ? (
                  formatted.quantity
                ) : (
                  <p>(puste)</p>
                )}
              </td>
              <td>
                {isEditMode && (isPriceDifferent || isMissingOne) ? (
                  <>
                    {selectedFormatted ? (
                      <p
                        className={
                          !formatted || isPriceDifferent
                            ? scss["modal-table-deleted-data"]
                            : ""
                        }
                      >
                        {currencyFormater(selectedFormatted.price)}
                      </p>
                    ) : (
                      <p className={scss["modal-table-deleted-data"]}>
                        (puste)
                      </p>
                    )}
                    {formatted ? (
                      <p>{currencyFormater(formatted.price)}</p>
                    ) : (
                      <p>(puste)</p>
                    )}
                  </>
                ) : formatted ? (
                  currencyFormater(formatted.price)
                ) : (
                  <p>(puste)</p>
                )}
              </td>
              <td>
                {isEditMode && (isTotalDifferent || isMissingOne) ? (
                  <>
                    {selectedFormatted ? (
                      <p
                        className={
                          !formatted || isTotalDifferent
                            ? scss["modal-table-deleted-data"]
                            : ""
                        }
                      >
                        {currencyFormater(selectedFormatted.total)}
                      </p>
                    ) : (
                      <p className={scss["modal-table-deleted-data"]}>
                        (puste)
                      </p>
                    )}
                    {formatted ? (
                      <p>{currencyFormater(formatted.total)}</p>
                    ) : (
                      <p>(puste)</p>
                    )}
                  </>
                ) : formatted ? (
                  currencyFormater(formatted.total)
                ) : (
                  <p>(puste)</p>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// {
//   loadingDocuments ? (
//     <p>Ładowanie danych dokumentów...</p>
//   ) : errorDocuments ? (
//     <p className={scss["error-message"]}>
//       Błąd ładowania danych dokumentów. Wyświetlane są ID.
//     </p>
//   ) : addInvoiceData.details.length === 0 ? (
//     <p>Brak dokumentów do wyświetlenia.</p>
//   ) : (
//     <table className={scss["modal-table"]}>
//       <thead>
//         <tr>
//           <th>Dokument</th>
//           <th>Ilość</th>
//           <th>Cena jednostkowa</th>
//           <th>Razem</th>
//         </tr>
//       </thead>
//       <tbody>
//         {Array.from({
//           length: Math.max(
//             addInvoiceData.details.length,
//             selectedInvoice?.details?.length || 0
//           ),
//         }).map((_, index) => {
//           const detail = addInvoiceData.details[index];
//           const selectedDetail = selectedInvoice?.details?.[index];
//           const formatted = detail ? formatDocumentDetails(detail) : null;
//           const selectedFormatted = selectedDetail
//             ? formatDocumentDetails(selectedDetail)
//             : null;

//           const isDifferent =
//             isEditMode &&
//             detail &&
//             selectedDetail &&
//             (detail.Quantity !== selectedDetail.Quantity ||
//               detail.Price !== selectedDetail.Price ||
//               detail.MainTypeId !== selectedDetail.MainTypeId ||
//               detail.TypeId !== selectedDetail.TypeId ||
//               detail.SubtypeId !== selectedDetail.SubtypeId);

//           const isMissingOne = isEditMode && (!detail || !selectedDetail);

//           return (
//             <tr
//               key={index}
//               className={detail?.DocumentId === 0 ? scss["invalid-row"] : ""}
//             >
//               <td>
//                 {isEditMode && (isDifferent || isMissingOne) ? (
//                   <>
//                     {selectedFormatted ? (
//                       <p className={scss["modal-table-deleted-data"]}>
//                         {selectedFormatted.documentName}{" "}
//                         {selectedFormatted.mainTypeName}{" "}
//                         {selectedFormatted.typeName}{" "}
//                         {selectedFormatted.subtypeName}
//                       </p>
//                     ) : (
//                       <p>(puste)</p>
//                     )}
//                     {formatted ? (
//                       <p>
//                         {formatted.documentName} {formatted.mainTypeName}{" "}
//                         {formatted.typeName} {formatted.subtypeName}
//                       </p>
//                     ) : (
//                       <p>(puste)</p>
//                     )}
//                   </>
//                 ) : formatted ? (
//                   <>
//                     {formatted.documentName} {formatted.mainTypeName}{" "}
//                     {formatted.typeName} {formatted.subtypeName}
//                   </>
//                 ) : (
//                   <p>(puste)</p>
//                 )}
//               </td>
//               <td>
//                 {isEditMode && (isDifferent || isMissingOne) ? (
//                   <>
//                     {selectedFormatted ? (
//                       <p className={scss["modal-table-deleted-data"]}>
//                         {selectedFormatted.quantity}
//                       </p>
//                     ) : (
//                       <p>(puste)</p>
//                     )}
//                     {formatted ? <p>{formatted.quantity}</p> : <p>(puste)</p>}
//                   </>
//                 ) : formatted ? (
//                   formatted.quantity
//                 ) : (
//                   <p>(puste)</p>
//                 )}
//               </td>
//               <td>
//                 {isEditMode && (isDifferent || isMissingOne) ? (
//                   <>
//                     {selectedFormatted ? (
//                       <p className={scss["modal-table-deleted-data"]}>
//                         {currencyFormater(selectedFormatted.price)}
//                       </p>
//                     ) : (
//                       <p>(puste)</p>
//                     )}
//                     {formatted ? (
//                       <p>{currencyFormater(formatted.price)}</p>
//                     ) : (
//                       <p>(puste)</p>
//                     )}
//                   </>
//                 ) : formatted ? (
//                   currencyFormater(formatted.price)
//                 ) : (
//                   <p>(puste)</p>
//                 )}
//               </td>
//               <td>
//                 {isEditMode && (isDifferent || isMissingOne) ? (
//                   <>
//                     {selectedFormatted ? (
//                       <p className={scss["modal-table-deleted-data"]}>
//                         {currencyFormater(selectedFormatted.total)}
//                       </p>
//                     ) : (
//                       <p>(puste)</p>
//                     )}
//                     {formatted ? (
//                       <p>{currencyFormater(formatted.total)}</p>
//                     ) : (
//                       <p>(puste)</p>
//                     )}
//                   </>
//                 ) : formatted ? (
//                   currencyFormater(formatted.total)
//                 ) : (
//                   <p>(puste)</p>
//                 )}
//               </td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// }
