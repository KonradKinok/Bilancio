// import React from "react";
// import { NavLink } from "react-router-dom";
// import { useMainDataContext } from "../Context/useMainDataContext";
// import scss from "./NavigationReportStandard.module.scss";

// export const NavigationReportStandard: React.FC = () => {
//   const { auth } = useMainDataContext();

//   return (
//     <ul className={scss["reportStandard-navigation"]}>
//       <li>
//         <NavLink
//           to="reportsStandardInvoicesPage"
//           className={(navData) => (navData.isActive ? scss.active : "")}
//         >
//           Faktury
//         </NavLink>
//       </li>

//       <li>
//         <NavLink
//           to="reportsCustomDocumentsPage"
//           className={(navData) => (navData.isActive ? scss.active : "")}
//         >
//           Dokumenty
//         </NavLink>
//       </li>
//     </ul>
//   );
// };
