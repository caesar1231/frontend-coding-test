import { Navigate, Route, Routes } from "react-router-dom";

import { HouseholdsPage } from "@/pages/HouseholdsPage";
import { CreateHouseholdPage } from "./pages/CreateHouseholdPage";
import { EditHouseholdPage } from "./pages/EditHouseholdPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/households" />} />
      <Route path="/households" element={<HouseholdsPage />} />
      <Route path="/households/new" element={<CreateHouseholdPage />} />
      <Route path="/households/:householdUid" element={<EditHouseholdPage />} />
    </Routes>
  );
}

export default App;
