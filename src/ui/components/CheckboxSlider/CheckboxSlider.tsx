import scss from "./CheckboxSlider.module.scss";

interface CheckboxSliderProps {
  textLabel: string;
  inputType: string;
  inputName: string;
  inputId: string;
  classMainContainer?: string;
  classLabel?: string;
  radioButtonIsDeleted: 0 | 1;
  setRadioButtonIsDeleted: React.Dispatch<React.SetStateAction<0 | 1>>;
}

export const CheckboxSlider: React.FC<CheckboxSliderProps> = ({
  textLabel,
  inputType,
  inputName,
  inputId,
  classMainContainer,
  classLabel,
  radioButtonIsDeleted,
  setRadioButtonIsDeleted,
}) => {
  const handleChange = () => {
    setRadioButtonIsDeleted((prevData) => (prevData === 1 ? 0 : 1));
  };

  return (
    <div
      className={`
        ${scss["checkbox-main-container"]} 
      ${classMainContainer || ""}
      `}
    >
      <label className={`${classLabel || ""}`} htmlFor={inputName}>
        <p className={scss["custom-title"]}>{textLabel}</p>
      </label>
      <input
        type={inputType}
        name={inputName}
        id={inputId}
        className={scss["toggle-switch"]}
        checked={radioButtonIsDeleted === 1}
        onChange={handleChange}
      />
    </div>
  );
};
