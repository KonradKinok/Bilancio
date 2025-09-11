import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAllInvoices } from "../../hooks/useAllInvoices";
import { useMainDataContext } from "../../components/Context/useMainDataContext";
import scss from "./ReportsPage.module.scss";
import { NavigationReports } from "../../components/NavigationReports/NavigationReports";
import { Loader } from "../../components/Loader/Loader";

const sizes: Lang[] = [
  { en: "small", pl: "mała" },
  { en: "medium", pl: "średnia" },
  { en: "large", pl: "duża" },
];

const ReportDataPage: React.FC = () => {
  const { options, setOptions } = useMainDataContext();

  // Funkcja do zmiany rozmiaru czcionki
  const handleOptionChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = event.target as HTMLButtonElement;

    setOptions((prev) => {
      if (name === "orientation-toggle-switch") {
        const currentIndex = sizes.findIndex(
          (size) => size.en === prev.fontSize.en
        );
        const nextIndex = (currentIndex + 1) % sizes.length;
        return { ...prev, fontSize: sizes[nextIndex] };
      }

      // if (name === "orientation-toggle-switch") {
      //   return { ...prev, fontSize: value };
      // }
      // if (name === "color-toggle-switch") {
      //   return { ...prev, color: value };
      // }
      return prev;
    });
  };

  return (
    <div className={scss[""]}>
      <div>
        <div className={scss[""]}>
          <div>
            <NavigationReports />
          </div>
          <div className={scss["settings-outlet-container"]}>
            <Suspense fallback={<Loader />}>
              <Outlet />
            </Suspense>
          </div>
        </div>
        {/* <Toaster position="top-right" reverseOrder={false} /> */}
      </div>
    </div>
  );
};

export default ReportDataPage;
