import React, { useRef } from "react";
import { Tooltip } from "react-tooltip";
import scss from "./TextInput.module.scss";

interface TextInputInterface {
  inputType?: string; // Typ inputa (text, number, email itd.)
  inputName: string; // Nazwa inputa, używana w id i htmlFor
  required?: boolean; // Czy pole jest wymagane
  singleInputValue: string; // Aktualna wartość inputa
  handleKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void; // Opcjonalny handler dla zdarzenia keydown
  handleOnPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void; // Opcjonalny handler dla wklejania
  inputPlaceholder: string; // Placeholder w input
  inputLabelText?: string; // Tekst labelki
  singleInputError?: string; // Komunikat błędu do wyświetlenia
  handleSingleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Handler zmiany wartości
  classNameInputContainer?: string; // Opcjonalna klasa dla kontenera
}

export const TextInput: React.FC<TextInputInterface> = ({
  inputType = "text",
  inputName = "defaultInputName",
  singleInputValue,
  inputPlaceholder,
  inputLabelText,
  singleInputError = "",
  handleSingleInputChange,
  handleKeyDown,
  handleOnPaste,
  required = false,
  classNameInputContainer = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null); // Ref do inputa

  // Ustawienie dynamicznej klasy
  const containerClassName =
    `${classNameInputContainer} ${scss["input-container"]}`.trim();

  return (
    <div className={containerClassName}>
      {inputLabelText && (
        <label htmlFor={inputName} className={scss["input-label"]}>
          {inputLabelText}
        </label>
      )}
      <input
        ref={inputRef}
        type={inputType}
        name={inputName}
        id={inputName}
        placeholder={inputPlaceholder}
        value={singleInputValue}
        onChange={handleSingleInputChange}
        onKeyDown={handleKeyDown} // Obsługa zdarzenia onKeyDown
        onPaste={handleOnPaste} // Obsługa zdarzenia onPaste
        required={required}
        className={`${scss["input"]} ${
          singleInputError ? scss["input-error"] : ""
        }`}
        data-tooltip-id={singleInputError ? inputName : undefined}
        data-tooltip-content={singleInputError ? singleInputError : undefined}
      />
      <Tooltip
        id={inputName}
        className={`${scss["tooltip"]} ${scss["tooltip-error"]}`}
        isOpen={!!singleInputError}
      />
    </div>
  );
};
