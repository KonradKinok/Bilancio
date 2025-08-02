import React, { useState } from "react";
import footerLogoText from "../../../assets/footer/3KLogo.png";
import footerLogoImage from "../../../assets/footer/konikMaly24x24Squoosh.png";
import packageJson from "../../../../package.json";
import scss from "./Footer.module.scss";

export const Footer: React.FC = () => {
  const [version] = useState(packageJson.version);
  const [applicationName] = useState(
    packageJson.displayName || packageJson.name.toLocaleUpperCase()
  );

  return (
    <footer className={scss["footer"]}>
      <div className={scss["footer-container"]}>
        <div className={scss["footer-logo"]}>
          <img src={footerLogoImage} alt="logoImage" width="24" />
          <img src={footerLogoText} alt="logoText" />
        </div>
        <address className={scss["footer-address"]}>
          <a href="mailto:3k.nexgen@gmail.com">3K.nexgen@gmail.com</a>
        </address>
      </div>
      <div className={scss["footer-info"]}>
        <span>
          © 2025 {applicationName} v.{version}
        </span>
        <span>22 lipca 2025r.</span>
      </div>
    </footer>
  );
};
