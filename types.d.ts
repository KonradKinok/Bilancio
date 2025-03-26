type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
};

type FrameWindowAction = 'CLOSE' | 'MAXIMIZE' | 'MINIMIZE';

type UnsubscribeFunction = () => void;
 
declare global {


type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
  };
  type TextTempDataBase = {
    textNazwa: string;
  };
  //Table
   export type DictionaryDocuments={
    DocumentId: number;
    DocumentName: string ;
  }
  //ConnectedTable
  type AllDocumentsName={
    DocumentName: string;
    MainTypeName: string;
    TypeName: string;
    SubtypeName: string ;
  }

  type AllInvoicesDb1 = {
    InvoiceId: number;
    InvoiceName: string;
    ReceiptDate: string;
    DeadlineDate: string |null;
    PaymentDate: string;
    IsDeleted: 0 | 1;
    InvoiceDetailsId: number;
    DocumentId: number;
    MainTypeId: number |null;
    TypeId: number|null;
    SubtypeId: number |null;
    Quantity: number;
    Price: number;
    DocumentName: string;
    MainTypeName: string;
    TypeName: string;
    SubtypeName: string;
  }
   type AllInvoicesDb = {
    InvoiceId: number;
    InvoiceName: string;
    ReceiptDate: string;
    DeadlineDate: string |null;
    PaymentDate: string;
    IsDeleted: 0 | 1;
    DocumentNames: string;
    MainTypeNames: string;
    TypeNames: string;
    SubtypeNames: string;
    Quantities: string;
     Prices: string;
    [key: string]: string[]  | null;
  }

  type AllInvoices = {
    InvoiceId: number;
    InvoiceName: string;
    ReceiptDate: string;
    DeadlineDate: string |null;
    PaymentDate: string;
    IsDeleted: 0 | 1;
    DocumentNames: string[];
    MainTypeNames: string[];
    TypeNames: string[];
    SubtypeNames: string[];
    Quantities: string[];
     Prices: string[];
    [key: string]: string[]  | null;
  }
  type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  changeView: View;
  sendFrameAction: FrameWindowAction;
  getTableDictionaryDocuments: DictionaryDocuments[];
    queryToDB: unknown[];
    getAllDocumentName: AllDocumentsName[];
    getAllInvoices: AllInvoices[];
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
      getTableDictionaryDocuments: () => Promise<DictionaryDocuments[]>;
      queryToDB: () => Promise<unknown[]>;
      getAllDocumentsName: () => Promise<AllDocumentsName[]>;
      getAllInvoices: () => Promise<AllInvoices[]>;
    };
  }
}

  export {};
