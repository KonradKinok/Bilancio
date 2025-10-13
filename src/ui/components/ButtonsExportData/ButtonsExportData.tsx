import { BsFileEarmarkArrowUp } from "react-icons/bs";
import { BsFiletypeXlsx } from "react-icons/bs";
import { useMainDataContext } from "../Context/useMainDataContext";
import { ButtonUniversal } from "../ButtonUniversal/ButtonUniversal";
import scss from "./ButtonsExportData.module.scss";

const buttons = [
  {
    name: "exportToSystemStorage",
    text: "Skopiuj do schowka",
    icon: <BsFileEarmarkArrowUp />,
    className: "button-export-clipboard",
  },
  {
    name: "exportToXls",
    text: "Excel",
    icon: <BsFiletypeXlsx />,
    className: "button-export-xlsx",
  },
];

interface ButtonsExportDataProps {
  handleExportButtonClick: (btnName: string) => void;
  isRaportGenerating: boolean;
}

export const ButtonsExportData = ({
  handleExportButtonClick,
  isRaportGenerating,
}: ButtonsExportDataProps) => {
  const { options } = useMainDataContext();

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
              buttonDisabled={isRaportGenerating}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
