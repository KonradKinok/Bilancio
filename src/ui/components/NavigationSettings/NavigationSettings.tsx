import React from "react";
import { NavLink } from "react-router-dom";
import { useMainDataContext } from "../Context/useMainDataContext";
import scss from "./NavigationSettings.module.scss";
import { useCheckStatusDatabase } from "../../hooks/useCheckStatusDatabase";

export const NavigationSettings: React.FC = () => {
  const { auth } = useMainDataContext();
  const { userDb } = auth;
  const isAdmin = userDb?.UserRole === "admin";

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
      {isAdmin && (
        <li>
          <NavLink
            to="usersPage"
            className={(navData) => (navData.isActive ? scss.active : "")}
          >
            Użytkownicy
          </NavLink>
        </li>
      )}
    </ul>
  );
};
