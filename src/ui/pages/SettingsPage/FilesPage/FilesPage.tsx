import { Suspense, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import scss from "./FilesPage.module.scss";
// import TempStart from "../../../TempStart/TempStart";
const FilesPage: React.FC = () => {
  // const { data: dataAllInvoices } = useAllInvoices();
  // console.log("ReportDataPage data", dataAllInvoices);
  const [dbPath, setDbPath] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDBPath = async () => {
      try {
        const sciezka = await window.electron.getDBbBilancioPath();
        setDbPath(sciezka);
      } catch (err) {
        setError(`Nie udało się załadować ścieżki bazy danych. ${err}`);
        console.error(err);
      }
    };
    fetchDBPath();
  }, []);

  return (
    <div className={scss[""]}>
      FilesPage
      <p>Ścieżka: {dbPath}</p>
      <p>Error: {error}</p>
      <div>{/* <TempStart /> */}</div>
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
    </div>
  );
};

export default FilesPage;
