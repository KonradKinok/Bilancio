import { Tooltip } from "react-tooltip";
import scss from "./IconInfo.module.scss";
import { FaInfoCircle } from "react-icons/fa";

interface IconInfoProps {
  tooltipInfoTextHtml: string;
  tooltipId: string;
  icon?: React.ReactNode;
  classNameIconContainer?: string;
}
export const IconInfo: React.FC<IconInfoProps> = ({
  tooltipId,
  tooltipInfoTextHtml,
  icon = <FaInfoCircle />,
  classNameIconContainer = "",
}) => {
  // Ustawienie dynamicznej klasy
  const containerClassName =
    `${classNameIconContainer} ${scss["container-icon"]}`.trim();
  return (
    <>
      <div
        className={containerClassName}
        data-tooltip-id={tooltipId}
        data-tooltip-html={tooltipInfoTextHtml}
      >
        {icon}
        <Tooltip id={tooltipId} className={scss["tooltip"]} />
      </div>
    </>
  );
};

// Tooltip in other components is used like this:
// <Tooltip id="tooltip-formAddInvoice" className={scss["tooltip"]} />;
// <Tooltip id="tooltip-error-date" className={`${scss["tooltip"]} ${scss["tooltip-error"]}`} />;
// Tooltip class:
// .tooltip {
//    z-index: 2;
//  }
