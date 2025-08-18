import React from "react";
import { NavLink } from "react-router-dom";
import scss from "./NavigationSettings.module.scss";

export const NavigationSettings: React.FC = () => {
  return (
    <ul className={scss["settings-navigation"]}>
      <li>
        <NavLink
          to="documentsPage"
          className={(navData) => (navData.isActive ? scss.active : "")}
        >
          Dokumenty
        </NavLink>
      </li>
      <li>
        <NavLink
          to="usersPage"
          className={(navData) => (navData.isActive ? scss.active : "")}
        >
          Użytkownicy
        </NavLink>
      </li>
    </ul>
  );
};
