import { use, useEffect, useState } from "react";
import { NavLink, redirect, useNavigate } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import { FaDatabase } from "react-icons/fa";
import { LogoBilancio } from "../LogoBilancio/LogoBilancio";
import { useMainDataContext } from "../Context/useMainDataContext";
import scss from "./Navigation.module.scss";
import { useCheckStatusDatabase } from "../../hooks/useCheckStatusDatabase";

export const Navigation: React.FC = () => {
  const { auth } = useMainDataContext();
  const { userDb } = auth;
  const {
    data: dataStatusDatabase,
    loading: loadingStatusDatabase,
    error: errorStatusDatabase,
    checkStatusDatabase,
  } = useCheckStatusDatabase();
  const [animation, setAnimation] = useState(true);
  useEffect(() => {
    console.log(dataStatusDatabase);
  }, [dataStatusDatabase, loadingStatusDatabase]);

  useEffect(() => {
    function triggerAnimation() {
      setAnimation(true);
      setTimeout(() => {
        setAnimation(false);
      }, 8000); // Usuń klasę po 2 sekundach (czas trwania animacji)
    }

    triggerAnimation(); // Uruchom od razu po załadowaniu
    const interval = setInterval(triggerAnimation, 12000); // Uruchamiaj co 10 minut

    // Czyszczenie interwału przy odmontowaniu komponentu
    return () => clearInterval(interval);
  }, []); // Pusty dependency array, aby useEffect wykonał się tylko raz

  return (
    <nav className={scss["navigation-main-container"]}>
      <div className={scss["navigation-container"]}>
        <div className={scss["logo-container"]}>{/* <LogoBilancio /> */}</div>
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
          <p className={`${scss["user-label"]}`}>
            <span
              className={`${scss["first-span"]} ${
                animation ? scss["animate"] : ""
              }`}
            >
              {userDb?.UserRole
                ? userDb?.UserRole === "admin"
                  ? "Admin:"
                  : "User:"
                : "None:"}
            </span>
            <span className={scss["second-span"]}>
              {userDb?.UserDisplayName || "None"}
            </span>
          </p>
          <p className={scss["user-label"]}>
            <span
              className={`${scss["first-span"]} ${
                animation ? scss["animate"] : ""
              }`}
            >
              Hostname:
            </span>{" "}
            <span className={scss["second-span"]}>
              {userDb?.Hostname || "None"}
            </span>
          </p>
        </div>
        <div className={scss["icon-container"]}>
          <NavLink
            to="settingsPage"
            className={({ isActive }) => (isActive ? scss.active : "")}
          >
            <IoSettingsSharp />
          </NavLink>
        </div>

        {!loadingStatusDatabase && (
          <div
            className={`${scss["icon-container-db"]}`}
            data-status={dataStatusDatabase?.status}
          >
            <FaDatabase />
          </div>
        )}
      </div>
    </nav>
  );
};
