import React from "react";
import { RotatingLines } from "react-loader-spinner";
import scss from "./Loader.module.scss";

export const Loader: React.FC = () => {
  return (
    <>
      <div className={scss["container"]}>
        <RotatingLines
          visible={true}
          width="96"
          strokeColor="rgba(0, 100, 0, 1)"
          strokeWidth="5"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    </>
  );
};
