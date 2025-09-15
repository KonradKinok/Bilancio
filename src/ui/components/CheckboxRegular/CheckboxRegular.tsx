import scss from "./CheckboxRegular.module.scss";

interface CheckboxRegularProps {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
}

export const CheckboxRegular: React.FC<CheckboxRegularProps> = ({
  checked,
  setChecked,
  name,
}) => {
  return (
    <div className={scss["checkboxRegular-main-container"]}>
      <label className={scss["checkbox-container"]}>
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span className={scss["checkmark"]}></span>
      </label>
    </div>
  );
};
