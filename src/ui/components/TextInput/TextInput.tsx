import React, { useEffect, useRef, useState } from "react";
import scss from "./TextInput.module.scss";
import { RxCross1 } from "react-icons/rx";
import { RxLetterCaseUppercase } from "react-icons/rx";
import { Tooltip } from "react-tooltip";

interface TextInputInterface {
  inputType?: string;
  inputName: string;
  required?: boolean;
  singleInputValue: string;
  // setSingleInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputPlaceholder: string;
  inputLabelText: string;
  singleInputError?: string;
  handleSingleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  classNameInputContainer?: string;
}

export const TextInput: React.FC<TextInputInterface> = ({
  inputType = "text",
  inputName = "defaultInputName",
  singleInputValue,
  // setSingleInputValue,
  inputPlaceholder,
  inputLabelText,
  singleInputError = "",
  handleSingleInputChange,
  required = false,
  classNameInputContainer = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null); // Ref do inputa

  // Ustawienie dynamicznej klasy
  const containerClassName =
    `${classNameInputContainer} ${scss["input-container"]}`.trim();

  return (
    <>
      <div className={containerClassName}>
        <label htmlFor={inputName} className={scss["input-label"]}>
          {inputLabelText}
        </label>
        <input
          ref={inputRef}
          type={inputType}
          name={inputName}
          id={inputName}
          placeholder={inputPlaceholder}
          value={singleInputValue}
          onChange={handleSingleInputChange}
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
    </>
  );
};
