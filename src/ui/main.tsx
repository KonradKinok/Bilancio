import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ElectronProvider } from "./components/Context/ElectronProvider";
import "./index.css";
import App from "./App/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ElectronProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ElectronProvider>
  </StrictMode>
);
