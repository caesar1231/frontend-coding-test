import { Navigate, Route, Routes } from "react-router-dom";

import { HouseholdsPage } from "@/pages/HouseholdsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/households" />} />
      <Route path="/households" element={<HouseholdsPage />} />
    </Routes>
  );
}

export default App;
