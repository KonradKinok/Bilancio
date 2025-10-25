import React from "react";
import { NavLink } from "react-router-dom";
import scss from "./NavigationReports.module.scss";

export const NavigationReports: React.FC = () => {
  return (
    <ul className={scss["reports-navigation"]}>
      <li>
        <NavLink
          to="reportsStandardDocumentsPage"
          className={(navData) => (navData.isActive ? scss.active : "")}
        >
          Dokumenty
        </NavLink>
      </li>
      <li>
        <NavLink
          to="reportsStandardInvoicesPage"
          className={(navData) => (navData.isActive ? scss.active : "")}
        >
          Faktury
        </NavLink>
      </li>
    </ul>
  );
};
