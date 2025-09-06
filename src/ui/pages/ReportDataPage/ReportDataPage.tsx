import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAllInvoices } from "../../hooks/useAllInvoices";
import { useMainDataContext } from "../../components/Context/useMainDataContext";
import scss from "./ReportDataPage.module.scss";

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
    <div className={scss["reportDataPage-main-container"]}>
      <h1>Strona raportów - do implementacji</h1>

      {/* <button
        name="orientation-toggle-switch"
        onClick={handleOptionChange}
        className={scss["font-size-button"]}
      >
        Zmień rozmiar czcionki
      </button>
      <p>
        Aktualny rozmiar czcionki: {options.fontSize.pl}{" "}
        {sizes.findIndex((size) => size.en === options.fontSize.en)}
      </p>
      <p className={`${scss["table"]} ${scss[`${options.fontSize.en}-font`]}`}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat
        voluptatem inventore, explicabo fuga velit voluptate, totam, nulla
        quibusdam est quam culpa vel excepturi ut similique deleniti cumque
        fugit. Harum, exercitationem?Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Nemo quo sunt nulla soluta dolore! Accusantium
        cupiditate reprehenderit repellendus, quae quasi, maiores explicabo iste
        unde fuga rerum velit earum iusto repellat.
      </p> */}

      {/* <Toaster position="top-right" reverseOrder={false} /> */}
    </div>
  );
};

export default ReportDataPage;
