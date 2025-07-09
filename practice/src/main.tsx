import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import UsingProp from "./UsingProp.tsx";
import { ConfigProvider } from "antd";
import antTheme from "./theme/antTheme.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={antTheme}>
      <App />
    </ConfigProvider>
  </StrictMode>
);
