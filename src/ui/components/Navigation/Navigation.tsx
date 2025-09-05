import { use, useEffect, useState } from "react";
import { NavLink, redirect, useNavigate } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import { FaDatabase } from "react-icons/fa";
import { RxFontSize } from "react-icons/rx";
import { LogoBilancio } from "../LogoBilancio/LogoBilancio";
import { useMainDataContext } from "../Context/useMainDataContext";
import scss from "./Navigation.module.scss";
import { useCheckStatusDatabase } from "../../hooks/useCheckStatusDatabase";
import { Tooltip } from "react-tooltip";
import { ConditionalWrapper } from "../ConditionalWrapper/ConditionalWrapper";

const sizes: Lang[] = [
  { en: "small", pl: "mała" },
  { en: "medium", pl: "średnia" },
  { en: "large", pl: "duża" },
];

export const Navigation: React.FC = () => {
  console.log("Rendering Navigation");
  const { auth, options, setOptions } = useMainDataContext();
  const { userDb } = auth;
  const {
    data: dataStatusDatabase,
    loading: loadingStatusDatabase,
    error: errorStatusDatabase,
    checkStatusDatabase,
  } = useCheckStatusDatabase();
  const [animation, setAnimation] = useState(true);

  const handleOptionFontSizeChange = () => {
    setOptions((prev) => {
      if (sizes.length > 0) {
        const currentIndex = sizes.findIndex(
          (size) => size.en === prev.fontSize.en
        );
        const nextIndex = (currentIndex + 1) % sizes.length;
        return { ...prev, fontSize: sizes[nextIndex] };
      }
      return prev;
    });
  };

  useEffect(() => {
    console.log("dataStatusDatabase: ", dataStatusDatabase);
  }, [dataStatusDatabase, loadingStatusDatabase]);

  useEffect(() => {
    function triggerAnimation() {
      setAnimation(true);
      setTimeout(() => {
        setAnimation(false);
      }, 8000); // Usuń klasę po 2 sekundach (czas trwania animacji)
    }

    triggerAnimation(); // Uruchom od razu po załadowaniu
    const interval = setInterval(triggerAnimation, 12000); // Uruchamiaj co 12 sekund

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
        <div
          onClick={handleOptionFontSizeChange}
          className={`${scss["icon-container-font-size"]}`}
          data-tooltip-id={"tooltip-navigation-font-size"}
          data-tooltip-content={tooltipNavigationFontSize(options.fontSize.pl)}
        >
          <RxFontSize />
        </div>
        {/* <ConditionalWrapper isLoading={loadingStatusDatabase}> */}
        <div
          className={`${scss["icon-container-db"]}`}
          data-status={dataStatusDatabase?.status}
          data-tooltip-id={"tooltip-navigation-database-status"}
          data-tooltip-html={tooltipNavigationDatabaseStatus(
            dataStatusDatabase,
            errorStatusDatabase
          )}
        >
          <FaDatabase />
        </div>
        {/* </ConditionalWrapper> */}
      </div>

      <Tooltip
        id="tooltip-navigation-font-size"
        className={`${scss["tooltip"]}`}
      />
      <Tooltip
        id="tooltip-navigation-database-status"
        className={`${scss["tooltip"]}`}
      />
    </nav>
  );
};
function tooltipNavigationFontSize(fontSizeText: string) {
  const text = `Wielkość czcionki: ${fontSizeText}`;
  return text.replace(/\n/g, "<br/>");
}

function tooltipNavigationDatabaseStatus(
  dataStatusDatabase: ReturnStatusDbMessage | null,
  errorStatusDatabase: string | null
) {
  let text = ``;
  if (dataStatusDatabase) {
    switch (dataStatusDatabase.status) {
      case 0:
        text = `Status bazy danych: Błąd połączenia.`;
        break;
      case 1:
        text = `Status bazy danych: Tylko do odczytu.`;
        break;
      case 2:
        text = `Status bazy danych: OK.`;
        break;
      default:
        text = `Status bazy danych: Nieznany.`;
        break;
    }
  }
  const finalText = `${text}
  ${dataStatusDatabase?.message || errorStatusDatabase || ""}`;
  return finalText.replace(/\n/g, "<br/>");
}
