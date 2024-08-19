import { useParams } from "react-router-dom";

import { HouseholdEditComponent } from "@/components/householdEditComponent";
import useHouseholdMembers from "@/hooks/useHouseholdMembers";

export function EditHouseholdPage() {
  const { householdUid } = useParams();
  const householdData = useHouseholdMembers(householdUid);
  
  return (
    <HouseholdEditComponent {...householdData} />
  );
}
