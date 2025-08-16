// import { useState } from "react";

// export const ExampleParentCod: React.FC = () => {
//   const [text, setText] = useState<string>("");

//   const clickHandler = () => {
//     setText("Clicked!");
//   };

//   return (
//     <div>
//       <h1>JakiśTekst {text}</h1>
//       <ExampleChildCod clickHandler={clickHandler} />
//     </div>
//   );
// };

// interface ExampleChildCodProps {
//   clickHandler: () => void;
// }
// export const ExampleChildCod: React.FC<ExampleChildCodProps> = ({
//   clickHandler,
// }) => {
//   return (
//     <div>
//       <button onClick={clickHandler}>Click me</button>
//     </div>
//   );
// };

// export const ExampleParentCod1: React.FC = () => {
//   const [text, setText] = useState<string>("");

//   return (
//     <div>
//       <h1>JakiśTekst {text}</h1>
//       <ExampleChildCod1 setText={setText} />
//     </div>
//   );
// };
// interface ExampleChildCod1Props {
//   setText: React.Dispatch<React.SetStateAction<string>>;
// }

// const ExampleChildCod1: React.FC<ExampleChildCod1Props> = ({ setText }) => {
//   const clickHandler = () => {
//     setText("Clicked!");
//   };
//   return (
//     <div>
//       <button onClick={clickHandler}>Click me</button>
//     </div>
//   );
// };

// import "./TempStart.css";
// import { useStatistics } from "../useStatistics";
// import { Chart } from "../Chart";
// export function TempStart() {
//   const [text, setText] = useState<string | null>(null);
//   const [documents, setDocuments] = useState<DictionaryDocuments[] | null>(
//     null
//   );
//   const [anyTable, setAnyTable] = useState<unknown[] | null>(null);
//   // const { data: tableDictionaryDocuments } = useTableDictionaryDocuments();
//   // const { data: allDocumentsName } = useTableDictionaryDocuments();
//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       const response = await window.electron.getTableDictionaryDocuments();
//   //       console.log("getDataDocumentsNieznany: Odpowiedź z serwera:", response);
//   //       if (response) setDocuments(response);
//   //     } catch (error) {
//   //       console.error(
//   //         "getDataDocuments: Błąd podczas pobierania danych:",
//   //         error
//   //       );
//   //     }
//   //   };

//   //   fetchData();
//   // }, []);

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       const response = await window.electron.getAllDocumentsName();
//   //       console.log("getAllDocumentName: Odpowiedź z serwera:", response);
//   //     } catch (error) {
//   //       console.error(
//   //         "getAllDocumentName: Błąd podczas pobierania danych:",
//   //         error
//   //       );
//   //     }
//   //   };

//   //   fetchData();
//   // }, []);

//   const [count, setCount] = useState(0);
//   const statistics = useStatistics(10);
//   const [activeView, setActiveView] = useState<View>("CPU");
//   const cpuUsages = useMemo(
//     () => statistics.map((stat) => stat.cpuUsage),
//     [statistics]
//   );
//   const ramUsages = useMemo(
//     () => statistics.map((stat) => stat.ramUsage),
//     [statistics]
//   );
//   const storageUsages = useMemo(
//     () => statistics.map((stat) => stat.storageUsage),
//     [statistics]
//   );
//   const activeUsages = useMemo(() => {
//     switch (activeView) {
//       case "CPU":
//         return cpuUsages;
//       case "RAM":
//         return ramUsages;
//       case "STORAGE":
//         return storageUsages;
//     }
//   }, [activeView, cpuUsages, ramUsages, storageUsages]);

//   useEffect(() => {
//     return window.electron.subscribeChangeView((view) => setActiveView(view));
//   }, []);
//   return (
//     <div className="App">
//       <div>
//         <Header />
//       </div>
//       <div style={{ height: 120 }}>
//         <Chart data={activeUsages} maxDataPoints={10} />
//       </div>

//       <h1>Nazwisko1: {text}</h1>

//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           liczbą jest {count}
//         </button>
//         <button>Podaj imię:</button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates,
//         eius?
//       </p>
//     </div>
//   );
// }

// export default TempStart;

// function Header() {
//   return (
//     <header>
//       <button
//         id="close"
//         onClick={() => window.electron.sendFrameAction("CLOSE")}
//       />
//       <button
//         id="minimize"
//         onClick={() => window.electron.sendFrameAction("MINIMIZE")}
//       />
//       <button
//         id="maximize"
//         onClick={() => window.electron.sendFrameAction("MAXIMIZE")}
//       />
//     </header>
//   );
// }
