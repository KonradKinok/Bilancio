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
  type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  changeView: View;
  sendFrameAction: FrameWindowAction;
  getTableDictionaryDocuments: DictionaryDocuments[];
    queryToDB: unknown[];
  getAllDocumentName: AllDocumentsName[];
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
    };
  }
}

  export {};
