import React, { useRef } from "react";
import { RxCross1 } from "react-icons/rx";
import { RxLetterCaseUppercase } from "react-icons/rx";
import scss from "./SingleInput.module.scss";

interface SingleInputInterface {
  inputType?: string;
  inputName: string;
  required?: boolean;
  singleInputValue: string;
  inputPlaceholder: string;
  iconLeft?: React.ReactNode;
  singleInputError?: string;
  handleSingleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  classNameInputContainer?: string;
}

export const SingleInput: React.FC<SingleInputInterface> = ({
  inputType = "text",
  inputName = "defaultInputName",
  singleInputValue,
  inputPlaceholder,
  iconLeft = <RxLetterCaseUppercase size={24} />,
  singleInputError = "",
  handleSingleInputChange,
  required = false,
  classNameInputContainer = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null); // Ref do inputa

  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      const fakeEvent = {
        target: inputRef.current,
      } as React.ChangeEvent<HTMLInputElement>;
      handleSingleInputChange(fakeEvent);
    }
  };

  // Ustawienie dynamicznej klasy
  const containerClassName =
    `${classNameInputContainer} ${scss["input-container"]}`.trim();

  return (
    <>
      <div className={containerClassName}>
        <label className={scss["input-label"]}>
          <input
            ref={inputRef}
            type={inputType}
            name={inputName}
            placeholder=" "
            value={singleInputValue}
            onChange={handleSingleInputChange}
            required={required}
            className={`${scss["input"]} ${
              singleInputError ? scss["input-error"] : ""
            }`}
          />
          <span className={scss["input-placeholder"]}>{inputPlaceholder}</span>
          <span className={`${scss["icons-input-left"]} `}>{iconLeft}</span>
          {inputRef.current?.value && (
            <span
              className={`${scss["icons-input-right"]} `}
              onClick={handleIconClick}
            >
              <RxCross1 className={scss["icon"]} />
            </span>
          )}
          {singleInputError && (
            <div className={`${scss["tooltip"]} ${scss["error"]}`}>
              {singleInputError}
            </div>
          )}
        </label>
      </div>
    </>
  );
};
