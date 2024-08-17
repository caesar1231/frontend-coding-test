import React from "react";
import ReactDOM from "react-dom/client";

import App from "@/App.tsx";

import "./index.css";

(async () => {
  const { worker } = await import("./mocks/worker");
  await worker.start({
    onUnhandledRequest: "bypass",
  });

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();
