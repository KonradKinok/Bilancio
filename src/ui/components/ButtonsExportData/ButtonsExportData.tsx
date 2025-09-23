import { useMainDataContext } from "../Context/useMainDataContext";
import { getFormatedDate } from "../GlobalFunctions/GlobalFunctions";
import scss from "./ButtonsExportData.module.scss";
import { useEffect, useState } from "react";
import { ButtonUniversal } from "../ButtonUniversal/ButtonUniversal";
import { FaFilePdf } from "react-icons/fa";
import { BsFiletypePdf } from "react-icons/bs";
import { BsFiletypeDoc } from "react-icons/bs";
import { BsFiletypeXls } from "react-icons/bs";

interface ButtonsExportDataProps {
  handleExportButtonClick: () => void;
}

export const ButtonsExportData = ({
  handleExportButtonClick,
}: ButtonsExportDataProps) => {
  const { options } = useMainDataContext();

  const onButtonClick = () => {
    handleExportButtonClick();
  };
  return (
    <div className={`${scss["buttonsExportData-main-container"]}`}>
      <div
        className={`${scss["buttonsExportData-container"]} ${
          scss[`${options.fontSize.en}-font`]
        }`}
      >
        <p>Export raportu:</p>
        <div className={`${scss["buttonsExportData-buttons-container"]}`}>
          <ButtonUniversal
            buttonName="exportToPdf"
            buttonText="PDF"
            buttonClick={onButtonClick}
            buttonIcon={<BsFiletypePdf />}
            classNameButtonContainer={scss["button-export-report"]}
          />
          <ButtonUniversal
            buttonName="exportToDoc"
            buttonText="Word"
            buttonClick={onButtonClick}
            buttonIcon={<BsFiletypeDoc />}
            classNameButtonContainer={scss["button-export-report"]}
          />
          <ButtonUniversal
            buttonName="exportToXls"
            buttonText="Excell"
            buttonClick={onButtonClick}
            buttonIcon={<BsFiletypeXls />}
            classNameButtonContainer={scss["button-export-report"]}
          />
        </div>
      </div>
    </div>
  );
};
