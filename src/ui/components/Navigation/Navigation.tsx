import React from "react";
import { NavLink } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import scss from "./Navigation.module.scss";

const userData = {
  userName: "Konrad Konik",
  isAdmin: true,
};

export const Navigation: React.FC = () => {
  return (
    <nav className={scss["navigation-main-container"]}>
      <div className={scss["navigation-container"]}>
        <div className={scss["logo-container"]}>
          <h5 className={scss[""]}>Bilancio</h5>
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
        <div>
          <p className={scss["user-label"]}> USER:</p>
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
