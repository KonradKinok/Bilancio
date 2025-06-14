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
}

export const ButtonUniversal: React.FC<ButtonUniversalProps> = ({
  buttonType = "button",
  buttonName,
  buttonText,
  buttonIcon = <RiDeleteBin6Line />,
  buttonDisabled = false,
  buttonClick,
  classNameButtonContainer = "",
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
    >
      <span className={scss["text"]}>{buttonText}</span>
      <span className={scss["icon-container"]}>{buttonIcon}</span>
    </button>
  );
};
