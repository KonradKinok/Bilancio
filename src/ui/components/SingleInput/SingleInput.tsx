import React, { useEffect, useRef, useState } from "react";
import scss from "./SingleInput.module.scss";
import { RxCross1 } from "react-icons/rx";
import { RxLetterCaseUppercase } from "react-icons/rx";

interface SingleInputInterface {
  inputType?: string;
  inputName: string;
  required?: boolean;
  singleInputValue: string;
  // setSingleInputValue: React.Dispatch<React.SetStateAction<string>>;
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
  // setSingleInputValue,
  inputPlaceholder,
  iconLeft = <RxLetterCaseUppercase size={24} />,
  singleInputError = "",
  handleSingleInputChange,
  required = false,
  classNameInputContainer = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null); // Ref do inputa

  const handleIconClick = () => {
    // setSingleInputValue("");

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
            className={`${scss["input"]} ${singleInputError ? scss["input-error"] : ""}`}
          />
          <span className={scss["input-placeholder"]}>{inputPlaceholder}</span>
          <span className={`${scss["icons-input-left"]} `}>{iconLeft}</span>
          {inputRef.current?.value && (
            <span
              className={`${scss["icons-input-right"]} `}
              onClick={handleIconClick}>
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

//  //SingleInputDataInParentComponent
//   const [singleInputValue, setSingleInputValue] = useState<string>("");
//   const [singleInputError, setSingleInputError] = useState<string>("");

//   const handleSingleInputChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const currentValue = event.target.value;
//     const currentName = event.target.name;
//     let errorTextInput = "";

//     if (currentName === "firstSingleInputName") {
//       setSingleInputValue(currentValue);
//       if (currentValue.length === 1) {
//         errorTextInput = "Za mało liter";
//       } else if (!currentValue) {
//         errorTextInput = "Musisz wypełnić te pole";
//       }
//       setSingleInputError(errorTextInput);
//     }
//   };

//  //SingleInputDataInParentComponent
//  <SingleInput
//    inputName="firstSingleInputName"
//    singleInputValue={singleInputValue}
//    handleSingleInputChange={handleSingleInputChange}
//    inputPlaceholder="Enter your text"
//    iconLeft={<FaUser size={16} />}
//    singleInputError={singleInputError}
//    required={false}
//    classNameInputContainer={scss["custom-input-container"]}
//  />;

interface SingleInputInterfaceB {
  inputType?: string;
  inputName?: string;
  required?: boolean;
  singleInputValue: string;
  setSingleInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputPlaceholder: string;
  iconLeft?: React.ReactNode;
  singleInputError?: string;
  // setSingleInputError?: React.Dispatch<React.SetStateAction<string>>;
  // handleSingleInputChange: any;
  classNameInputContainer?: string;
}

export const SingleInputB: React.FC<SingleInputInterfaceB> = ({
  inputType = "text",
  inputName = "defaultInputName",
  singleInputValue,
  setSingleInputValue,
  inputPlaceholder,
  iconLeft = <RxLetterCaseUppercase size={24} />,
  singleInputError = "",
  // setSingleInputError = null,
  // handleSingleInputChange,
  required = false,
  classNameInputContainer = "",
}) => {
  const inputRef1 = useRef<HTMLInputElement>(null); // Ref do inputa

  const handleIconClick = () => {
    setSingleInputValue((prevState) => "");
  };

  const handleSingleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const currentValue = event.target.value;
    setSingleInputValue(currentValue);
  };

  // Ustawienie dynamicznej klasy
  const containerClassName =
    `${classNameInputContainer} ${scss["input-container"]}`.trim();

  return (
    <>
      <div className={containerClassName}>
        <label className={scss["input-label"]}>
          <input
            ref={inputRef1}
            type={inputType}
            name={inputName}
            placeholder=" "
            value={singleInputValue}
            onChange={handleSingleInputChange}
            required={required}
            className={`${scss["input"]} ${singleInputError ? scss["input-error"] : ""}`}
          />
          <span className={scss["input-placeholder"]}>{inputPlaceholder}</span>
          <span className={`${scss["icons-input-left"]} `}>{iconLeft}</span>
          {singleInputValue && (
            <span
              className={`${scss["icons-input-right"]} `}
              onClick={handleIconClick}>
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
