import { STATUS, DataBaseResponse, isSuccess } from './src/electron/sharedTypes/status';

declare global {
  //Context HomePage
  interface FormValuesHomePage {
    firstDate: Date | null;
    secondDate: Date | null;
    isDeleted?: 0 | 1;
  }
  export interface PageState {
    firstPage: number;
    lastPage: number;
    paginationPage: number;
  }
  export interface ReturnStatusMessage {
    status: boolean;
    message: string;
  }

  //Table
  export type DictionaryDocuments = {
    DocumentId: number;
    DocumentName: string;
  }

  export type DictionaryMainType = {
    MainTypeId: number;
    MainTypeName: string;
  }

  export type DictionaryType = {
    TypeId: number;
    TypeName: string;
  }

  export type DictionarySubtype = {
    SubtypeId: number;
    SubtypeName: string;
  }
  type Config = {
    dbPath: string;
    documentTemplatesPath: string;
    savedDocumentsPath: string;
  };
  type AllInvoices = {
    InvoiceId: number;
    InvoiceName: string;
    ReceiptDate: string;
    DeadlineDate: string | null;
    PaymentDate: string;
    IsDeleted: 0 | 1;
    DocumentIds: string[];
    DocumentNames: string[];
    MainTypeIds: string[];
    MainTypeNames: string[];
    TypeIds: string[];
    TypeNames: string[];
    SubtypeIds: string[];
    SubtypeNames: string[];
    Quantities: string[];
    Prices: string[];
    [key: string]: string[] | null;
  }

  type InvoiceTable = {
    InvoiceId?: number;
    InvoiceName: string;
    ReceiptDate: string;
    DeadlineDate: string | null;
    PaymentDate: string | null;
    IsDeleted: 0 | 1;
  }
  type InvoiceDetailsTable = {
    InvoiceId?: number;
    DocumentId: number;
    MainTypeId: number | null;
    TypeId: number | null;
    SubtypeId: number | null;
    Quantity: number;
    Price: number;
    isMainTypeRequired?: boolean; // Nowe pole
    isTypeRequired?: boolean; // Nowe pole
    isSubtypeRequired?: boolean; // Nowe pole
  }
  type InvoiceSave = {
    invoice: InvoiceTable;
    details: InvoiceDetailsTable[];
  };
  type ReturnMessageFromDb = {
    lastID: number;
    changes: number;
  }
  //ConnectedTable
  type AllDocumentsName = {
    AllDocumentsId: number;
    DocumentId: number;
    DocumentName: string;
    MainTypeId: number | null;
    MainTypeName: string;
    TypeId: number | null;
    TypeName: string;
    SubtypeId: number | null;
    SubtypeName: string;
    Price: number;
    IsDeleted: 0 | 1;
  }
  type AllDocumentsNameHook = {
    data: AllDocumentsName[] | null;
    loading: boolean;
    error: string | null;
  };

  type InvoicesDifferences = {
    key: string;
    oldValue: unknown;
    newValue: unknown;
  };

  type AllInvoicesDb = {
    InvoiceId: number;
    InvoiceName: string;
    ReceiptDate: string;
    DeadlineDate: string | null;
    PaymentDate: string;
    IsDeleted: 0 | 1;
    DocumentNames: string;
    MainTypeNames: string;
    TypeNames: string;
    SubtypeNames: string;
    Quantities: string;
    Prices: string;
    [key: string]: string[] | null;
  }

  type LastRowInvoice = {
    InvoiceId: number;
    InvoiceName: string;
    ReceiptDate: string;
    DeadlineDate: string;
    PaymentDate: string | null;
    IsDeleted: 0 | 1;
  }

  //ActivityLOG
  enum ActivityType {
    addInvoice = "dodanie faktury",
    editInvoice = "edycja faktury",
    deleteInvoice = "usunięcie faktury",
  }

  type ActivityLog = {
    ActivityLogId?: number;
    Date?: string;
    UserName: string;
    ActivityType: ActivityType;
    ActivityData: string;
  };


  type EventPayloadMapping = {
    getTableDictionaryDocuments: DataBaseResponse<T[]>;
    getConnectedTableDictionary: DataBaseResponse<T[]>;
    getAllDocumentName: DataBaseResponse<AllDocumentsName[]>;
    updateDocumentDeletionStatus: DataBaseResponse<ReturnMessageFromDb>;
    saveEditedDocument: DataBaseResponse<ReturnMessageFromDb>;
    saveNewDocument: DataBaseResponse<ReturnMessageFromDb>;
    getAllInvoices: DataBaseResponse<AllInvoices[]>;
    getLastRowFromTable: unknown;

    addInvoice: DataBaseResponse<ReturnMessageFromDb>;
    updateInvoice: DataBaseResponse<ReturnMessageFromDb>;
    addInvoiceDetails: DataBaseResponse<ReturnMessageFromDb>;
    deleteInvoice: DataBaseResponse<ReturnMessageFromDb>;
    restoreInvoice: DataBaseResponse<ReturnMessageFromDb>;
    countInvoices: DataBaseResponse<number>;

    countActivityLog: DataBaseResponse<number>;
    getAllActivityLog: DataBaseResponse<ActivityLog[]>;
    saveActivityLog: DataBaseResponse<ReturnMessageFromDb>;

    getDBbBilancioPath: string;
    getConfigBilancio: Config;
    saveConfig: Config;
    openDBDialog: { success: boolean; path: string | null };
    openTemplatesDialog: { success: boolean; path: string | null };
    openSavedDocumentsDialog: { success: boolean; path: string | null };
    checkDatabaseExists: ReturnStatusMessage;
    reinitializeDatabase: ReturnStatusMessage;
    getConfigBilancio1: string; // Przykładowy typ dla getConfigBilancio1
  };
  type View = 'CPU' | 'RAM' | 'STORAGE';
  type FrameWindowAction = 'CLOSE' | 'MAXIMIZE' | 'MINIMIZE';
  interface Window {
    electron: {
      getTableDictionaryDocuments: <T> (payload) => Promise<DataBaseResponse<T[]>>;
      getConnectedTableDictionary: <T> (tableName, documentId, mainTypeId, typeId, subTypeId) => Promise<DataBaseResponse<T[]>>;

      getAllDocumentsName: (isDeleted?: number) => Promise<DataBaseResponse<AllDocumentsName[]>>;
      updateDocumentDeletionStatus: (documentId: number, isDeleted: 0 | 1) => Promise<DataBaseResponse<ReturnMessageFromDb>>;

      saveEditedDocument: (document: AllDocumentsName) => Promise<DataBaseResponse<ReturnMessageFromDb>>;
      saveNewDocument: (document: AllDocumentsName) => Promise<DataBaseResponse<ReturnMessageFromDb>>;
      // getAllInvoices: (payload) => Promise<AllInvoices[]>;
      getAllInvoices: (payload, page, rowsPerPage) => Promise<DataBaseResponse<AllInvoices[]>>;
      addInvoice: (payload) => Promise<DataBaseResponse<ReturnMessageFromDb>>;
      updateInvoice: (invoice, invoiceDetails) => Promise<DataBaseResponse<ReturnMessageFromDb>>;
      addInvoiceDetails: (invoice, invoiceDetails) => Promise<DataBaseResponse<ReturnMessageFromDb>>;
      deleteInvoice: (invoiceId: number) => Promise<DataBaseResponse<ReturnMessageFromDb>>;
      restoreInvoice: (invoiceId: number) => Promise<DataBaseResponse<ReturnMessageFromDb>>;
      countInvoices: (payload) => Promise<DataBaseResponse<number>>;

      countActivityLog: () => Promise<DataBaseResponse<number>>;
      getAllActivityLog: (page, rowsPerPage) => Promise<DataBaseResponse<ActivityLog[]>>;
      saveActivityLog: (activity: ActivityLog) => Promise<DataBaseResponse<ReturnMessageFromDb>>;


      getLastRowFromTable: () => Promise<unknown>;
      getDBbBilancioPath: () => Promise<string>;
      getConfigBilancio: () => Promise<Config>;
      saveConfig: (config: Config) => Promise<Config>;
      openDBDialog: () => Promise<{ success: boolean; path: string | null }>;
      openTemplatesDialog: () => Promise<{ success: boolean; path: string | null }>;
      openSavedDocumentsDialog: () => Promise<{ success: boolean; path: string | null }>;
      checkDatabaseExists: () => Promise<ReturnStatusMessage>;
      reinitializeDatabase: (dbPath: string) => Promise<ReturnStatusMessage>;
      getConfigBilancio1: (payload) => Promise<string>; // Przykładowa funkcja zwracająca string
    };
  }
}

export { };


