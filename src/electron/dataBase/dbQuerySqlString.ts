// //Pobierz wszystkie dokumenty z tabeli DictionaryDocuments
// export function getTableDictionaryDocumentsSqlString(tableName: string): string {
//   console.log("getTableDictionaryDocumentsSqlString", tableName)
//   if (!tableName) {
//     return ``;
//   }
//   return `SELECT * FROM ${tableName}`;
// };

// // Pobierz wybrane połączone dokumenty z tabeli DictionaryDocuments-DictionaryMainType
// export function getConnectedTableDictionaryDocumentsDictionaryMainTypeSqlString(documentId: number): string {
//   const sql = `SELECT DISTINCT DictionaryMainType.MainTypeId, DictionaryMainType.MainTypeName
// FROM DictionaryMainType
// JOIN AllDocuments ON AllDocuments.MainTypeId = DictionaryMainType.MainTypeId
// JOIN DictionaryDocuments ON AllDocuments.DocumentId = DictionaryDocuments.DocumentId
// WHERE DictionaryDocuments.DocumentId = ${documentId};';
// `;
//   return sql;
// };

// // Pobierz wybrane połączone dokumenty z tabeli DictionaryDocuments-DictionaryMainType-DictionaryType
// export function getConnectedTableDictionaryMainTypeDictionaryTypeSqlString(documentId: number, mainTypeId: number): string {
//   const sql = `SELECT DISTINCT DictionaryType.*
// FROM DictionaryType
// JOIN AllDocuments ON DictionaryType.TypeId = AllDocuments.TypeId
// JOIN DictionaryDocuments ON AllDocuments.DocumentId = DictionaryDocuments.DocumentId
// JOIN DictionaryMainType ON AllDocuments.MainTypeId = DictionaryMainType.MainTypeId
// WHERE DictionaryDocuments.DocumentId = ${documentId}
// AND DictionaryMainType.MainTypeId = ${mainTypeId};
// `;
//   return sql;
// };

// // Pobierz wybrane połączone dokumenty z tabeli DictionaryDocuments-DictionaryMainType-DictionaryType-DictionarySubtype
// export function getConnectedTableDictionaryTypeDictionarySubtypeSqlString(documentId: number, mainTypeId: number, typeId: number): string {
//   const sql = `SELECT DISTINCT DictionarySubtype.*
// FROM DictionarySubtype
// JOIN AllDocuments ON DictionarySubtype.SubtypeId = AllDocuments.SubtypeId
// JOIN DictionaryDocuments ON AllDocuments.DocumentId = DictionaryDocuments.DocumentId
// JOIN DictionaryMainType ON AllDocuments.MainTypeId = DictionaryMainType.MainTypeId
// JOIN DictionaryType ON AllDocuments.TypeId = DictionaryType.TypeId
// WHERE DictionaryDocuments.DocumentId = ${documentId}
// AND DictionaryMainType.MainTypeId = ${mainTypeId}
// AND DictionaryType.TypeId = ${typeId};
// `;
//   return sql;
// };
// // Pobierz wszystkie nazwy dokumentów
// export function getAllDocumentsNameSqlString():string {
//   return `SELECT
//     AllDocuments.DocumentId,
//     AllDocuments.MainTypeId,
//     AllDocuments.TypeId,
//     AllDocuments.SubtypeId,
//     AllDocuments.Price,
//     DictionaryDocuments.DocumentName,
//     DictionaryMainType.MainTypeName,
//     DictionaryType.TypeName,
//     DictionarySubtype.SubtypeName
// FROM AllDocuments
// LEFT JOIN DictionaryDocuments ON AllDocuments.DocumentId = DictionaryDocuments.DocumentId
// LEFT JOIN DictionaryMainType ON AllDocuments.MainTypeId = DictionaryMainType.MainTypeId
// LEFT JOIN DictionaryType ON AllDocuments.TypeId = DictionaryType.TypeId
// LEFT JOIN DictionarySubtype ON AllDocuments.SubtypeId = DictionarySubtype.SubtypeId
// WHERE AllDocuments.IsDeleted = 0
// ORDER BY LOWER(DictionaryDocuments.DocumentName) ASC;`;
// };
// Pobierz wszystkie nazwy dokumentów
// export function getAllDocumentsNameSqlString(isDeleted?: number): string {
//   let sql = `SELECT
//   AllDocuments.AllDocumentsId,
//   AllDocuments.DocumentId,
//   AllDocuments.MainTypeId,
//   AllDocuments.TypeId,
//   AllDocuments.SubtypeId,
//   AllDocuments.Price,
//   AllDocuments.IsDeleted,
//   DictionaryDocuments.DocumentName,
//   DictionaryMainType.MainTypeName,
//   DictionaryType.TypeName,
//   DictionarySubtype.SubtypeName
// FROM AllDocuments
// LEFT JOIN DictionaryDocuments ON AllDocuments.DocumentId = DictionaryDocuments.DocumentId
// LEFT JOIN DictionaryMainType ON AllDocuments.MainTypeId = DictionaryMainType.MainTypeId
// LEFT JOIN DictionaryType ON AllDocuments.TypeId = DictionaryType.TypeId
// LEFT JOIN DictionarySubtype ON AllDocuments.SubtypeId = DictionarySubtype.SubtypeId`;

//   if (isDeleted !== undefined) {
//     sql += ` WHERE AllDocuments.IsDeleted = ?`;
//   }

//   sql += ` ORDER BY LOWER(DictionaryDocuments.DocumentName) ASC, LOWER(DictionaryMainType.MainTypeName) ASC, LOWER(DictionaryType.TypeName) ASC, LOWER(DictionarySubtype.SubtypeName) ASC`;
//   return sql;
// };




// Dodaj faktury do tabeli Invoices
// export function addInvoiceSqlString(): string {
//   return `INSERT INTO Invoices (InvoiceName, ReceiptDate, DeadlineDate, PaymentDate, IsDeleted)
//     VALUES (?, ?, ?, ?, ?)`;
// };
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

