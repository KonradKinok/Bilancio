import  { STATUS, DataBaseResponse, isSuccess } from './src/electron/sharedTypes/status';

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
};

type FrameWindowAction = 'CLOSE' | 'MAXIMIZE' | 'MINIMIZE';

type UnsubscribeFunction = () => void;

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
  type Statistics = {
    cpuUsage: number;
    ramUsage: number;
    storageUsage: number;
  };
  type TextTempDataBase = {
    textNazwa: string;
  };
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
  type ReturnInvoiceSave = {
    lastID: number;
    changes: number;
  }
  //ConnectedTable
  type AllDocumentsName = {
    DocumentId: number;
    DocumentName: string;
    MainTypeId: number | null;
    MainTypeName: string;
    TypeId: number | null;
    TypeName: string;
    SubtypeId: number | null;
    SubtypeName: string;
    Price: number;
  }

  // type AllInvoicesDb1 = {
  //   InvoiceId: number;
  //   InvoiceName: string;
  //   ReceiptDate: string;
  //   DeadlineDate: string |null;
  //   PaymentDate: string;
  //   IsDeleted: 0 | 1;
  //   InvoiceDetailsId: number;
  //   DocumentId: number;
  //   MainTypeId: number |null;
  //   TypeId: number|null;
  //   SubtypeId: number |null;
  //   Quantity: number;
  //   Price: number;
  //   DocumentName: string;
  //   MainTypeName: string;
  //   TypeName: string;
  //   SubtypeName: string;
  // }
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


  type JakasFunkcja = {
    jakisTekst: string;
    jakisNumer: number;
  }
  //   const STATUS_SUKCES = 'sukces';
  // const STATUS_BLED = 'blad';

  // type PrzykladowaFunkcjaResult =
  //   | { status: typeof STATUS_SUKCES; dane: JakasFunkcja }
  //   | { status: typeof STATUS_BLED; komunikat: string };
  const STATUS1 = {
    Sukces: "sukces",
    Error: "error"
  } as const
  type PrzykladowaFunkcjaResult =
    | { status: typeof STATUS1.Sukces; dane: JakasFunkcja }
    | { status: typeof STATUS1.Error; komunikat: string };

  
  type EventPayloadMapping = {
    statistics: Statistics;
    getStaticData: StaticData;
    changeView: View;
    sendFrameAction: FrameWindowAction;
    getTableDictionaryDocuments: DataBaseResponse<T[]>;
    getConnectedTableDictionary:DataBaseResponse<T[]>;
    queryToDB: unknown[];
    getAllDocumentName: DataBaseResponse<AllDocumentsName[]>;
    // getAllInvoices: AllInvoices[];
    getAllInvoices: DataBaseResponse<AllInvoices[]>;
    getLastRowFromTable: unknown;
    przykladowaFunkcja: JakasFunkcja;
    przykladowaFunkcja2: PrzykladowaFunkcjaResult;
    
    addInvoice: DataBaseResponse<ReturnInvoiceSave>;
    updateInvoice: DataBaseResponse<ReturnInvoiceSave>;
    addInvoiceDetails: DataBaseResponse<ReturnInvoiceSave>;
    deleteInvoice: DataBaseResponse<ReturnInvoiceSave>;
    restoreInvoice: DataBaseResponse<ReturnInvoiceSave>;
    countInvoices: DataBaseResponse<number>;
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
      subscribeStatistics: (
        callback: (statistics: Statistics) => void
      ) => UnsubscribeFunction;
      getStaticData: () => Promise<StaticData>;
      subscribeChangeView: (
        callback: (view: View) => void
      ) => UnsubscribeFunction;
      sendFrameAction: (payload: FrameWindowAction) => void;
      getTableDictionaryDocuments: <T> (payload) => Promise<DataBaseResponse<T[]>>;
      getConnectedTableDictionary: <T> (tableName, documentId, mainTypeId, typeId, subTypeId) => Promise<DataBaseResponse<T[]>>;
      queryToDB: () => Promise<unknown[]>;
      getAllDocumentsName: () => Promise<DataBaseResponse<AllDocumentsName[]>>;
      // getAllInvoices: (payload) => Promise<AllInvoices[]>;
      getAllInvoices: (payload, page, rowsPerPage) => Promise<DataBaseResponse<AllInvoices[]>>;
      addInvoice: (payload) => Promise<DataBaseResponse<ReturnInvoiceSave>>; 
      updateInvoice: (invoice, invoiceDetails) => Promise<DataBaseResponse<ReturnInvoiceSave>>; 
      addInvoiceDetails: (invoice, invoiceDetails) => Promise<DataBaseResponse<ReturnInvoiceSave>>;
      deleteInvoice: (invoiceId: number) => Promise<DataBaseResponse<ReturnInvoiceSave>>;
      restoreInvoice: (invoiceId: number) => Promise<DataBaseResponse<ReturnInvoiceSave>>;
      countInvoices: (payload) => Promise<DataBaseResponse<number>>;
      getLastRowFromTable: () => Promise<unknown>;
      getDBbBilancioPath: () => Promise<string>;
      przykladowaFunkcja: (payload, numer) => Promise<JakasFunkcja>;
      przykladowaFunkcja2: (payload, numer) => Promise<PrzykladowaFunkcjaResult>;
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
