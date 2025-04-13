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

// Pobierz ostatni wiersz z tabeli 
export function getLastRowFromTableSqlString(tableName:string, tableNameId:string):string {
  return `SELECT *
FROM ${tableName}
WHERE ${tableNameId} = (SELECT MAX(${tableNameId}) FROM ${tableName});`;
};

// Pobierz wszystkie faktury 
export function getAllInvoicesSqlString(formValuesHomePage:FormValuesHomePage ):string {
    
    if (!formValuesHomePage) {
    console.error('getAllInvoicesSqlString: formValuesHomePage is undefined or null');
    return ''; // lub inny odpowiedni sposób obsługi błędu
    }
    const firstDateStr = formValuesHomePage.firstDate?.toISOString().split("T")[0]; 
    const lastDateStr = formValuesHomePage.secondDate?.toISOString().split("T")[0];
    const isDeleted = formValuesHomePage.isDeleted ; // Ustaw domyślną wartość na 0, jeśli isDeleted jest undefined
    console.log("getAllInvoicesSqlString()", {firstDateStr, lastDateStr, isDeleted})

const sql1=`SELECT 
    Invoices.InvoiceId,
    Invoices.InvoiceName,
    Invoices.ReceiptDate,
    Invoices.DeadlineDate,
    Invoices.PaymentDate,
    Invoices.IsDeleted,
    GROUP_CONCAT(IFNULL(DictionaryDocuments.DocumentName, ''), ';') AS DocumentNames,
    GROUP_CONCAT(IFNULL(DictionaryMainType.MainTypeName, ''), ';') AS MainTypeNames,
    GROUP_CONCAT(IFNULL(DictionaryType.TypeName, ''), ';') AS TypeNames,
    GROUP_CONCAT(IFNULL(DictionarySubtype.SubtypeName, ''), ';') AS SubtypeNames,
    GROUP_CONCAT(IFNULL(InvoiceDetails.Quantity, ''), ';') AS Quantities,
    GROUP_CONCAT(IFNULL(InvoiceDetails.Price, ''), ';') AS Prices
FROM Invoices
    LEFT JOIN InvoiceDetails ON Invoices.InvoiceId = InvoiceDetails.InvoiceId
    LEFT JOIN DictionaryDocuments ON InvoiceDetails.DocumentId = DictionaryDocuments.DocumentId
    LEFT JOIN DictionaryMainType ON InvoiceDetails.MainTypeId = DictionaryMainType.MainTypeId
    LEFT JOIN DictionaryType ON InvoiceDetails.TypeId = DictionaryType.TypeId
    LEFT JOIN DictionarySubtype ON InvoiceDetails.SubtypeId = DictionarySubtype.SubtypeId
WHERE 
    Invoices.ReceiptDate BETWEEN '${firstDateStr}' AND '${lastDateStr}'
    AND Invoices.IsDeleted = ${isDeleted}
GROUP BY Invoices.InvoiceId;
`
    return sql1
}

// Pobierz ostatni wiersz z tabeli 
export function addInvoiceSqlString():string {
  return `INSERT INTO Invoices (InvoiceName, ReceiptDate, DeadlineDate, PaymentDate, IsDeleted)
    VALUES (?, ?, ?, ?, ?)`;
};
// Pobierz wszystkie faktury
// export function getAllInvoicesSqlString1(firstDate:string, lastDate:string, isDeleted:number=0 ):string {
//     const firstDateStr = firstDate; ;
//   const lastDateStr = lastDate;
//   const isDeletedNum = isDeleted;
//     const sql = `SELECT
//     Invoices.*,
//     InvoiceDetails.*,
//     DictionaryDocuments.DocumentName,
//     DictionaryMainType.MainTypeName,
//     DictionaryType.TypeName,
//     DictionarySubtype.SubtypeName
// FROM
//     Invoices
//     LEFT JOIN InvoiceDetails ON Invoices.InvoiceId = InvoiceDetails.InvoiceId
//     LEFT JOIN DictionaryDocuments ON InvoiceDetails.DocumentId = DictionaryDocuments.DocumentId
//     LEFT JOIN DictionaryMainType ON InvoiceDetails.MainTypeId = DictionaryMainType.MainTypeId
//     LEFT JOIN DictionaryType ON InvoiceDetails.TypeId = DictionaryType.TypeId
//     LEFT JOIN DictionarySubtype ON InvoiceDetails.SubtypeId = DictionarySubtype.SubtypeId
// WHERE
//     Invoices.ReceiptDate BETWEEN '2010-01-01' AND '2020-12-31'
//     AND Invoices.IsDeleted = 0;`;

//     return sql
// }

