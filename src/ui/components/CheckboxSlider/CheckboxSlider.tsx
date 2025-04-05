import scss from "./CheckboxSlider.module.scss";

interface CheckboxSliderProps {
  textLabel: string;
  type: string;
  name: string;
  id: string;
  classMainContainer?: string;
  classLabel?: string;
}

export const CheckboxSlider: React.FC<CheckboxSliderProps> = ({
  textLabel,
  type,
  name,
  id,
  classMainContainer,
  classLabel,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, id } = e.target;
  };
  return (
    <div
      className={`
        ${scss["checkbox-main-container"]} 
      ${classMainContainer || ""}
      `}
    >
      <label className={`${classLabel || ""}`} htmlFor={name}>
        <p className={scss["custom-title"]}>{textLabel}</p>
      </label>
      <input
        type={type}
        name={name}
        id={id}
        className={scss["toggle-switch"]}
        // checked={formValues.detailedData}
        onChange={handleChange}
      />
    </div>
  );
};
