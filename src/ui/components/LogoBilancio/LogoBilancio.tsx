import scss from "./LogoBilancio.module.scss";

interface LogoBilancioProps {
  classNameIconContainer?: string;
}

export const LogoBilancio: React.FC<LogoBilancioProps> = (
  classNameIconContainer
) => {
  // Ustawienie dynamicznej klasy
  const containerClassName =
    `${classNameIconContainer} ${scss["container-logo"]}`.trim();

  return (
    <div className={containerClassName}>
      <div className={scss["btn"]}>
        <strong className={scss["strong"]}>BILANCIO</strong>
        <div id={scss["container-stars"]}>
          <div id={scss["stars"]}></div>
        </div>

        <div id={scss["glow"]}>
          <div className={scss["circle"]}></div>
          <div className={scss["circle"]}></div>
        </div>
      </div>
    </div>
  );
};
