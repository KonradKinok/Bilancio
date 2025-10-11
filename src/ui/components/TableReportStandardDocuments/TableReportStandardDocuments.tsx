import scss from "./TableReportStandardDocuments.module.scss";
import { useMainDataContext } from "../Context/useMainDataContext";
import { currencyFormater } from "../GlobalFunctions/GlobalFunctions";
import { forwardRef, useEffect, useMemo } from "react";

interface TableReportStandardDocumentsProps {
  dataReportStandardInvoices: ReportStandardInvoice[] | null;
  totalPriceAllInvoices: number;
  reportDocumentsToTable: ReportAllDocumentsToTable[] | undefined;
}

export const TableReportStandardDocuments = forwardRef<
  HTMLTableElement,
  TableReportStandardDocumentsProps
>(
  (
    {
      dataReportStandardInvoices,
      totalPriceAllInvoices,
      reportDocumentsToTable,
    },
    ref
  ) => {
    const { options } = useMainDataContext();

    useEffect(() => {
      console.log(
        "TableReportStandardDocuments: ",
        JSON.stringify(reportDocumentsToTable, null, 2)
      );
    }, [reportDocumentsToTable]);

    useEffect(() => {
      // upewniamy się, że ref jest typu React.RefObject<HTMLTableElement>
      const tableRef = ref as React.RefObject<HTMLTableElement>;

      if ((dataReportStandardInvoices?.length ?? 0) > 0 && tableRef.current) {
        tableRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start", // lub "center"
        });
      }
    }, [dataReportStandardInvoices, ref]);

    const dataDocument = useMemo(() => {
      if (reportDocumentsToTable && reportDocumentsToTable?.length > 0) {
        const [firstRow] = reportDocumentsToTable ?? [];
        const result = {
          totalDocumentsQuantity: firstRow.quantity,
          totalDocumentsPrice: firstRow.totalPrice,
        };
        return result || null;
      }
    }, [reportDocumentsToTable]);

    if (
      !dataReportStandardInvoices ||
      dataReportStandardInvoices.length === 0 ||
      !reportDocumentsToTable ||
      reportDocumentsToTable.length === 0
    ) {
      return null;
    }

    return (
      <div className={`${scss["tableReportStandardDocuments-main-container"]}`}>
        <div className={scss["table-wrapper"]}>
          <table
            ref={ref}
            className={`${scss["table"]} ${
              scss[`${options.fontSize.en}-font`]
            }`}
          >
            <thead className={`${scss["table-header"]}`}>
              <tr>
                <th>Lp.</th>
                <th>Nazwa dokumentu</th>
                <th>Liczba dokumentów</th>
                <th>Suma cen dokumentu</th>
                <th>Nazwa głównego typu dokumentu</th>
                <th>Liczba głównego typu dokumentu</th>
                <th>Suma cen głównego typu dokumentu</th>
                <th>Nazwa typu dokumentu</th>
                <th>Liczba typu dokumentu</th>
                <th>Suma cen typu dokumentu</th>
                <th>Nazwa podtypu dokumentu</th>
                <th>Liczba podtypu dokumentu</th>
                <th>Suma cen podtypu dokumentu</th>
                {/* <th>Lp.</th>
                <th>Dokument</th>
                <th>Ilość</th>
                <th>Suma</th>
                <th>Gł. typ</th>
                <th>Ilość Gł. typ</th>
                <th>Suma Gł. typ</th>
                <th>Typ</th>
                <th>Ilość Typ</th>
                <th>Suma Typ</th>
                <th>Podtyp</th>
                <th>Ilość Podtyp</th>
                <th>Suma Podtyp</th> */}
              </tr>
            </thead>
            <tbody>
              {(() => {
                let docCounter = 0;
                const totalColumns = 13;

                return reportDocumentsToTable?.flatMap((root) =>
                  root.documents.flatMap((doc) => {
                    docCounter++;

                    // dokument bez mainTypes
                    if (!doc.mainTypes || doc.mainTypes.length === 0) {
                      const emptyCols = totalColumns - 4; // 4 kolumny zajmuje dokument
                      return (
                        <tr key={doc.documentId}>
                          <td>{String(docCounter).padStart(2, "0")}.</td>
                          <td>{doc.documentName}</td>
                          <td>{doc.quantity}</td>
                          <td>{currencyFormater(doc.totalPrice)}</td>
                          <td colSpan={emptyCols}></td>
                        </tr>
                      );
                    }

                    return doc.mainTypes.flatMap((mt, mtIndex) => {
                      // mainType bez types
                      if (!mt.types || mt.types.length === 0) {
                        const emptyCols = totalColumns - 7; // dokument + mainType zajmuje 7 kolumn
                        return (
                          <tr key={mt.mainTypeId}>
                            {mtIndex === 0 && (
                              <>
                                <td rowSpan={doc.mainTypes.length}>
                                  {String(docCounter).padStart(2, "0")}.
                                </td>
                                <td rowSpan={doc.mainTypes.length}>
                                  {doc.documentName}
                                </td>
                                <td rowSpan={doc.mainTypes.length}>
                                  {doc.quantity}
                                </td>
                                <td rowSpan={doc.mainTypes.length}>
                                  {currencyFormater(doc.totalPrice)}
                                </td>
                              </>
                            )}
                            <td>{mt.mainTypeName}</td>
                            <td>{mt.quantity}</td>
                            <td>{currencyFormater(mt.totalPrice)}</td>
                            <td colSpan={emptyCols}></td>
                          </tr>
                        );
                      }

                      return mt.types.flatMap((t, tIndex) => {
                        // type bez subtypes
                        if (!t.subtypes || t.subtypes.length === 0) {
                          const emptyCols = totalColumns - 10; // dokument + mainType + type zajmuje 10 kolumn
                          const totalSubtypesInDoc = mt.types.reduce(
                            (acc, ty) => acc + (ty.subtypes?.length || 1),
                            0
                          );
                          return (
                            <tr key={t.typeId}>
                              {mtIndex === 0 && tIndex === 0 && (
                                <>
                                  <td rowSpan={totalSubtypesInDoc}>
                                    {String(docCounter).padStart(2, "0")}.
                                  </td>
                                  <td rowSpan={totalSubtypesInDoc}>
                                    {doc.documentName}
                                  </td>
                                  <td rowSpan={totalSubtypesInDoc}>
                                    {doc.quantity}
                                  </td>
                                  <td rowSpan={totalSubtypesInDoc}>
                                    {currencyFormater(doc.totalPrice)}
                                  </td>
                                </>
                              )}
                              <td rowSpan={t.subtypes?.length || 1}>
                                {mt.mainTypeName}
                              </td>
                              <td rowSpan={t.subtypes?.length || 1}>
                                {mt.quantity}
                              </td>
                              <td rowSpan={t.subtypes?.length || 1}>
                                {currencyFormater(mt.totalPrice)}
                              </td>
                              <td>{t.typeName}</td>
                              <td>{t.quantity}</td>
                              <td>{currencyFormater(t.totalPrice)}</td>
                              <td colSpan={emptyCols}></td>
                            </tr>
                          );
                        }

                        // normalny przypadek: są subtypes
                        const totalSubtypesInMainType = mt.types.reduce(
                          (acc, ty) => acc + (ty.subtypes.length || 1),
                          0
                        );
                        const totalSubtypesInDoc = doc.mainTypes.reduce(
                          (acc, m) =>
                            acc +
                            m.types.reduce(
                              (a, ty) => a + (ty.subtypes.length || 1),
                              0
                            ),
                          0
                        );

                        return t.subtypes.map((st, stIndex) => (
                          <tr key={st.subtypeId}>
                            {/* Dokument */}
                            {mtIndex === 0 && tIndex === 0 && stIndex === 0 && (
                              <>
                                <td rowSpan={totalSubtypesInDoc}>
                                  {String(docCounter).padStart(2, "0")}.
                                </td>
                                <td rowSpan={totalSubtypesInDoc}>
                                  {doc.documentName}
                                </td>
                                <td rowSpan={totalSubtypesInDoc}>
                                  {doc.quantity}
                                </td>
                                <td rowSpan={totalSubtypesInDoc}>
                                  {currencyFormater(doc.totalPrice)}
                                </td>
                              </>
                            )}

                            {/* MainType */}
                            {tIndex === 0 && stIndex === 0 && (
                              <>
                                <td rowSpan={totalSubtypesInMainType}>
                                  {mt.mainTypeName}
                                </td>
                                <td rowSpan={totalSubtypesInMainType}>
                                  {mt.quantity}
                                </td>
                                <td rowSpan={totalSubtypesInMainType}>
                                  {currencyFormater(mt.totalPrice)}
                                </td>
                              </>
                            )}

                            {/* Type */}
                            {stIndex === 0 && (
                              <>
                                <td rowSpan={t.subtypes.length}>
                                  {t.typeName}
                                </td>
                                <td rowSpan={t.subtypes.length}>
                                  {t.quantity}
                                </td>
                                <td rowSpan={t.subtypes.length}>
                                  {currencyFormater(t.totalPrice)}
                                </td>
                              </>
                            )}

                            {/* Subtype */}
                            <td>{st.subtypeName}</td>
                            <td>{st.quantity}</td>
                            <td>{currencyFormater(st.totalPrice)}</td>
                          </tr>
                        ));
                      });
                    });
                  })
                );
              })()}
            </tbody>
          </table>
          <div className={scss["maintable-footer-container"]}>
            <div>
              <p>Liczba documentów: {dataDocument?.totalDocumentsQuantity}</p>
              <p>
                Suma cen dokumentów:{" "}
                {currencyFormater(dataDocument?.totalDocumentsPrice || 0)}
              </p>
            </div>
            <div>
              <p>Liczba faktur: {dataReportStandardInvoices?.length}</p>
              <p>Suma cen faktur: {currencyFormater(totalPriceAllInvoices)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// opcjonalnie dodaj nazwę komponentu (przydatne w devtools)
TableReportStandardDocuments.displayName = "TableReportStandardDocuments";
