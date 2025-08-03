import React from "react";
import { NavLink } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import scss from "./Navigation.module.scss";
import { LogoBilancio } from "../LogoBilancio/LogoBilancio";
import { useMainDataContext } from "../Context/useOptionsImage";

export const Navigation: React.FC = () => {
  const { auth } = useMainDataContext();
  const { userDb } = auth;

  return (
    <nav className={scss["navigation-main-container"]}>
      <div className={scss["navigation-container"]}>
        <div className={scss["logo-container"]}>
          <LogoBilancio />
        </div>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? scss.active : "")}
        >
          Faktury
        </NavLink>

        <NavLink
          to="reportDataPage"
          className={({ isActive }) => (isActive ? scss.active : "")}
        >
          Raporty
        </NavLink>
      </div>
      <div className={scss["status-container"]}>
        <div className={scss["user-label-container"]}>
          <p className={`${scss["gold-text"]} ${scss["input-container"]}`}>
            {" "}
            USER:
          </p>
          {/* <p className={scss["admin-label"]}>ADMIN:</p> */}
        </div>
        <div className={scss["icon-container"]}>
          <NavLink
            to="settingsPage"
            className={({ isActive }) => (isActive ? scss.active : "")}
          >
            <IoSettingsOutline />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
