import { Tooltip } from "react-tooltip";
import scss from "./ButtonUniversal.module.scss";
import { RiDeleteBin6Line } from "react-icons/ri";

type ButtonType = "button" | "submit" | "reset" | undefined;

interface ButtonUniversalProps {
  buttonType?: ButtonType;
  buttonName: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  buttonDisabled?: boolean;
  buttonClick: React.MouseEventHandler<HTMLButtonElement>;
  classNameButtonContainer?: string;
  toolTipId?: string;
  toolTipContent?: string;
  toolTipClassName?: string;
}

export const ButtonUniversal: React.FC<ButtonUniversalProps> = ({
  buttonType = "button",
  buttonName,
  buttonText,
  buttonIcon = <RiDeleteBin6Line />,
  buttonDisabled = false,
  buttonClick,
  classNameButtonContainer = "",
  toolTipId,
  toolTipContent,
  toolTipClassName,
}) => {
  const containerClassName =
    `${classNameButtonContainer} ${scss["button-6"]}`.trim();

  return (
    <button
      className={containerClassName}
      name={buttonName}
      id={buttonName}
      type={buttonType}
      onClick={buttonClick}
      disabled={buttonDisabled}
      data-tooltip-id={toolTipId}
      data-tooltip-html={toolTipContent ? toolTipContent : undefined}
    >
      <span className={scss["text"]}>{buttonText}</span>
      <span className={scss["icon-container"]}>{buttonIcon}</span>
      <Tooltip
        id={toolTipId}
        // className={`${scss["tooltip"]} ${scss["tooltip-error"]}`}
        className={toolTipClassName}
      />
    </button>
  );
};
