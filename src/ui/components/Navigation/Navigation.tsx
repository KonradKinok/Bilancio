import React from "react";
import { NavLink } from "react-router-dom";
import scss from "./Navigation.module.scss";

export const Navigation: React.FC = () => {
  return (
    <nav className={scss["nav-navigation"]}>
      <div>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? scss.active : "")}
        >
          Wykresy
        </NavLink>

        <NavLink
          to="reportDataPage"
          className={({ isActive }) => (isActive ? scss.active : "")}
        >
          Raporty
        </NavLink>
      </div>
    </nav>
  );
};
