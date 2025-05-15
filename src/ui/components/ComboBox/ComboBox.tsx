import { StylesConfig } from "react-select";

export interface ComboBoxOption {
  label: string;
  value: number;
}

export const customStylesComboBox: StylesConfig<ComboBoxOption, false> = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "var(--combobox-text-selected-background)" // Kolor dla wybranej opcji
      : state.isFocused
      ? "var(--combobox-text-hover-color)" // kolor tła przy hover
      : undefined,
    cursor: "pointer",

    color: state.isSelected
      ? "var(--combobox-text-color)"
      : "var(--combobox-text-color)", // Kolor tekstu dla opcji wybranej i reszty
    ":active": {
      backgroundColor: "var(--combobox-text-hover-background)", // Kolor tła, gdy opcja jest kliknięta
      color: "var(--combobox-text-color)",
    },
  }),
  control: (provided) => ({
    ...provided,
    cursor: "pointer",

    backgroundColor: "var(--combobox-control-background)",
    borderColor: "var(--combobox-control-border)", // Kolor obramowania kontrolki
    ":hover": {
      borderColor: "var(--combobox-control-border-hover)", // Kolor obramowania przy hover na select
    },
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "var(--combobox-text-color)", // Kolor tekstu wybranej wartości w kontrolce
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }), // 👈 super ważne
  placeholder: (base) => ({
    ...base,
    color: "#0000ff80", // Zmień na pożądany kolor, np. '#999999'
  }),
};
