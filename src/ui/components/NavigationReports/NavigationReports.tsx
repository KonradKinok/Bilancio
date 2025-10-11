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
          to="reportsStandardInvoicesPage"
          className={(navData) => (navData.isActive ? scss.active : "")}
        >
          Faktury
        </NavLink>
      </li>
      <li>
        <NavLink
          to="reportsStandardDocumentsPage"
          className={(navData) => (navData.isActive ? scss.active : "")}
        >
          Dokumenty
        </NavLink>
      </li>
    </ul>
  );
};
