import { useMainDataContext } from "../Context/useMainDataContext";
import { getFormatedDate } from "../GlobalFunctions/GlobalFunctions";
import scss from "./ButtonsExportData.module.scss";
import { useEffect, useState } from "react";
import { ButtonUniversal } from "../ButtonUniversal/ButtonUniversal";
import { BsFileEarmarkArrowUp } from "react-icons/bs";
import { BsFiletypeXlsx } from "react-icons/bs";

const buttons = [
  {
    name: "exportToSystemStorage",
    text: "Skopiuj do schowka",
    icon: <BsFileEarmarkArrowUp />,
    className: "button-export-clipboard",
  },
  {
    name: "exportToXls",
    text: "Excell",
    icon: <BsFiletypeXlsx />,
    className: "button-export-xlsx",
  },
];

interface ButtonsExportDataProps {
  handleExportButtonClick: (btnName: string) => void;
}

export const ButtonsExportData = ({
  handleExportButtonClick,
}: ButtonsExportDataProps) => {
  const { options } = useMainDataContext();

  // const onButtonClick = () => {
  //   handleExportButtonClick();
  // };
  return (
    <div className={`${scss["buttonsExportData-main-container"]}`}>
      <div
        className={`${scss["buttonsExportData-container"]} ${
          scss[`${options.fontSize.en}-font`]
        }`}
      >
        <p>Export raportu:</p>
        <div className={`${scss["buttonsExportData-buttons-container"]}`}>
          {buttons.map((btn) => (
            <ButtonUniversal
              key={btn.name}
              buttonName={btn.name}
              buttonText={btn.text}
              buttonClick={() => handleExportButtonClick(btn.name)}
              buttonIcon={btn.icon}
              classNameButtonContainer={scss[btn.className]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
