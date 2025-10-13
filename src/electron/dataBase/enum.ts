//Nazwy tabel w bazie danych SQLite.
export enum DbTables {
  DictionaryDocuments = "DictionaryDocuments",
  DictionaryMainType = "DictionaryMainType",
  DictionaryType = "DictionaryType",
  DictionarySubtype = "DictionarySubtype",
  Invoices = "Invoices"
}

//Nazwy kolumn w tabeli Invoices.
export enum InvoicesTable {
  InvoiceId = "InvoiceId",
  InvoiceName = "InvoiceName",
  ReceiptDate = "ReceiptDate",
  DeadlineDate = "DeadlineDate",
  PaymentDate = "PaymentDate",
  IsDeleted = "IsDeleted"
}