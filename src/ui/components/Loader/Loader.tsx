import React from "react";
import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";
import scss from "./Loader.module.scss";

export const Loader: React.FC = () => {
  return (
    <div className={scss["container"]}>
      <LineSpinner size="96" stroke="15" speed="1" color="rgb(50, 205, 50)" />
    </div>
  );
};
