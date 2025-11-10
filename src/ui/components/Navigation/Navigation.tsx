import { NavLink } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { IoSettingsSharp } from "react-icons/io5";
import { FaDatabase } from "react-icons/fa";
import { RxFontSize } from "react-icons/rx";
import { useMainDataContext } from "../Context/useMainDataContext";
import { useCheckStatusDatabase } from "../../hooks/useCheckStatusDatabase";
import { LogoBilancio } from "../LogoBilancio/LogoBilancio";
import scss from "./Navigation.module.scss";

const sizes: Lang[] = [
  { en: "small", pl: "mała" },
  { en: "medium", pl: "średnia" },
  { en: "large", pl: "duża" },
];

export const Navigation: React.FC = () => {
  const { auth, options, setOptions } = useMainDataContext();
  const { userDb } = auth;
  const {
    data: dataStatusDatabase,
    loading: loadingStatusDatabase,
    error: errorStatusDatabase,
    checkStatusDatabase,
  } = useCheckStatusDatabase();

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

  return (
    <nav className={scss["navigation-main-container"]}>
      <div className={scss["navigation-container"]}>
        <div className={scss["logo-container"]}>
          <LogoBilancio />{" "}
        </div>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? scss.active : "")}
        >
          Faktury
        </NavLink>

        <NavLink
          to="reportsPage"
          className={({ isActive }) => (isActive ? scss.active : "")}
        >
          Raporty
        </NavLink>
      </div>

      <div className={scss["status-container"]}>
        <div
          className={scss["icon-container"]}
          data-tooltip-id={"tooltip-navigation-settings"}
          data-tooltip-content={tooltipNavigationSettings()}
        >
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
          data-tooltip-content={tooltipNavigationFontSize(
            options.fontSize.pl || "nieznany"
          )}
        >
          <RxFontSize />
        </div>
        <div
          onClick={checkStatusDatabase}
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
        <div className={scss["user-label-container"]}>
          <p className={`${scss["user-label"]}`}>
            <span className={`${scss["first-span"]} ${scss["animate"]}`}>
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
            <span className={`${scss["first-span"]} ${scss["animate"]}`}>
              Hostname:
            </span>{" "}
            <span className={scss["second-span"]}>
              {userDb?.Hostname || "None"}
            </span>
          </p>
        </div>
      </div>
      <Tooltip
        id="tooltip-navigation-settings"
        className={`${scss["tooltip"]}`}
      />
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

//Tooltip Ustawienia
function tooltipNavigationSettings(): string {
  const text = `🛠️ Ustawienia`;
  return text;
}

//Tooltip Wielkość czcionki
function tooltipNavigationFontSize(fontSizeText: string) {
  const text = `🔁 Wielkość czcionki: ${fontSizeText}`;
  return text;
}

//Tooltip Status bazy danych
function tooltipNavigationDatabaseStatus(
  dataStatusDatabase: ReturnStatusDbMessage | null,
  errorStatusDatabase: string | null
) {
  let text = ``;
  if (dataStatusDatabase) {
    switch (dataStatusDatabase.status) {
      case 0:
        text = `🟠 Status bazy danych: Błąd połączenia.`;
        break;
      case 1:
        text = `🟡 Status bazy danych: Tylko do odczytu.`;
        break;
      case 2:
        text = `🟢 Status bazy danych: OK.`;
        break;
      default:
        text = `🟠 Status bazy danych: Nieznany.`;
        break;
    }
  }
  const finalText = `${text}
  ${dataStatusDatabase?.message || errorStatusDatabase || ""}`;
  return finalText.replace(/\n/g, "<br/>");
}
