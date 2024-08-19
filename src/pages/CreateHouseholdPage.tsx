import { HouseholdEditComponent } from "@/components/householdEditComponent";
import useHouseholdMembers from "@/hooks/useHouseholdMembers";

export function CreateHouseholdPage() {
  const householdData = useHouseholdMembers();

  return (
    <HouseholdEditComponent pageTitle="世帯新規追加" {...householdData} />
  );
}
