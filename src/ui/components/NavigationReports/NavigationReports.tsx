import React from "react";
import { NavLink } from "react-router-dom";
import { useMainDataContext } from "../Context/useMainDataContext";
import scss from "./NavigationReports.module.scss";

export const NavigationReports: React.FC = () => {
  const { auth } = useMainDataContext();

  return (
    <ul className={scss["reports-navigation"]}>
      <li>
        <NavLink
          to="reportsStandardPage"
          className={(navData) => (navData.isActive ? scss.active : "")}
        >
          Raporty standardowe
        </NavLink>
      </li>

      <li>
        <NavLink
          to="reportsCustomPage"
          className={(navData) => (navData.isActive ? scss.active : "")}
        >
          Raporty niestandardowe
        </NavLink>
      </li>
    </ul>
  );
};
