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
  type InvoiceTable = {
    InvoiceId?: number;
    InvoiceName: string;
    ReceiptDate: string;
    DeadlineDate: string | null;
    PaymentDate: string;
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
    DocumentName: string;
    MainTypeName: string;
    TypeName: string;
    SubtypeName: string;
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

  type AllInvoices = {
    InvoiceId: number;
    InvoiceName: string;
    ReceiptDate: string;
    DeadlineDate: string | null;
    PaymentDate: string;
    IsDeleted: 0 | 1;
    DocumentNames: string[];
    MainTypeNames: string[];
    TypeNames: string[];
    SubtypeNames: string[];
    Quantities: string[];
    Prices: string[];
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
    getAllDocumentName: AllDocumentsName[];
    getAllInvoices: AllInvoices[];
    getLastRowFromTable: unknown;
    przykladowaFunkcja: JakasFunkcja;
    przykladowaFunkcja2: PrzykladowaFunkcjaResult;
    // addInvoice: unknown;
    // addInvoice: ReturnInvoiceSave;
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
      getAllDocumentsName: () => Promise<AllDocumentsName[]>;
      getAllInvoices: (payload) => Promise<AllInvoices[]>;
      getLastRowFromTable: () => Promise<unknown>;
      przykladowaFunkcja: (payload, numer) => Promise<JakasFunkcja>;
      przykladowaFunkcja2: (payload, numer) => Promise<PrzykladowaFunkcjaResult>;

      // addInvoice: (invoice: {
      //   InvoiceName: string;
      //   ReceiptDate: string;
      //   DeadlineDate?: string;
      //   PaymentDate: string;
      //   IsDeleted: 0 | 1;
      // }) => Promise<ReturnInvoiceSave>;
      // addInvoice: (invoice) => Promise<unknown>;
    };
  }
}

export { };
