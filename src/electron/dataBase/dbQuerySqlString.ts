export function getTableDictionaryDocumentsSqlString() {
    return `SELECT * FROM DictionaryDocuments`;
};

// Pobierz wszystkie nazwy dokumentów 
export function getAllDocumentsNameSqlString():string {
  return `SELECT
  dd.DocumentName AS DocumentName,
    mt.MainTypeName AS MainTypeName,
    t.TypeName AS TypeName,
    st.SubtypeName AS SubtypeName
FROM
    DictionaryDocuments dd
    LEFT JOIN DictionaryDocuments_MainType dmt ON dd.DocumentId = dmt.DocumentId
    LEFT JOIN DictionaryMainType mt ON dmt.MainTypeId = mt.MainTypeId
    LEFT JOIN DictionaryMainType_DictionaryType mtdt ON mt.MainTypeId = mtdt.MainTypeId
    LEFT JOIN DictionaryType t ON mtdt.TypeId = t.TypeId
    LEFT JOIN DictionaryType_DictionarySubtype tds ON t.TypeId = tds.TypeId
    LEFT JOIN DictionarySubtype st ON tds.SubtypeId = st.SubtypeId
ORDER BY
    dd.DocumentName,
    mt.MainTypeName,
    t.TypeName,
    st.SubtypeName;`;
};

// Pobierz wszystkie faktury 
export function getAllInvoicesSqlString1(firstDate:string, lastDate:string, isDeleted:number=0 ):string {
    const firstDateStr = firstDate; ;
  const lastDateStr = lastDate;
  const isDeletedNum = isDeleted;
    const sql = `SELECT
    Invoices.*,
    InvoiceDetails.*,
    DictionaryDocuments.DocumentName,
    DictionaryMainType.MainTypeName,
    DictionaryType.TypeName,
    DictionarySubtype.SubtypeName
FROM
    Invoices
    LEFT JOIN InvoiceDetails ON Invoices.InvoiceId = InvoiceDetails.InvoiceId
    LEFT JOIN DictionaryDocuments ON InvoiceDetails.DocumentId = DictionaryDocuments.DocumentId
    LEFT JOIN DictionaryMainType ON InvoiceDetails.MainTypeId = DictionaryMainType.MainTypeId
    LEFT JOIN DictionaryType ON InvoiceDetails.TypeId = DictionaryType.TypeId
    LEFT JOIN DictionarySubtype ON InvoiceDetails.SubtypeId = DictionarySubtype.SubtypeId
WHERE
    Invoices.ReceiptDate BETWEEN '2010-01-01' AND '2020-12-31'
    AND Invoices.IsDeleted = 0;`;

    return sql
}

// Pobierz wszystkie faktury 
export function getAllInvoicesSqlString(firstDate:string, lastDate:string, isDeleted:number=0 ):string {
    const firstDateStr = firstDate; ;
  const lastDateStr = lastDate;
  const isDeletedNum = isDeleted;
    const sql = `SELECT Invoices.InvoiceId,
       Invoices.InvoiceName,
       Invoices.ReceiptDate,
       Invoices.DeadlineDate,
       Invoices.PaymentDate,
       Invoices.IsDeleted,
       GROUP_CONCAT(DictionaryDocuments.DocumentName, ';') AS DocumentNames,
       GROUP_CONCAT(DictionaryMainType.MainTypeName, ';') AS MainTypeNames,
       GROUP_CONCAT(DictionaryType.TypeName, ';') AS TypeNames,
       GROUP_CONCAT(DictionarySubtype.SubtypeName, ';') AS SubtypeNames,
       GROUP_CONCAT(InvoiceDetails.Quantity, ';') AS Quantities,
       GROUP_CONCAT(InvoiceDetails.Price, ';') AS Prices
  FROM Invoices
       LEFT JOIN
       InvoiceDetails ON Invoices.InvoiceId = InvoiceDetails.InvoiceId
       LEFT JOIN
       DictionaryDocuments ON InvoiceDetails.DocumentId = DictionaryDocuments.DocumentId
       LEFT JOIN
       DictionaryMainType ON InvoiceDetails.MainTypeId = DictionaryMainType.MainTypeId
       LEFT JOIN
       DictionaryType ON InvoiceDetails.TypeId = DictionaryType.TypeId
       LEFT JOIN
       DictionarySubtype ON InvoiceDetails.SubtypeId = DictionarySubtype.SubtypeId
 WHERE Invoices.ReceiptDate BETWEEN '2010-01-01' AND '2015-12-31' AND
       Invoices.IsDeleted = 0
 GROUP BY Invoices.InvoiceId;
`;

    return sql
}