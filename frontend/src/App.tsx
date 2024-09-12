import { Dialog } from "./components/ui/dialog";
import { CreateGoal } from "./components/create-goal";
import { EmptyGoals } from "./components/empty-goals";
import { Summary } from "./components/summary";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "./http/get-summary";

export function App() {
  const { data: summary } = useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
    staleTime: 1000 * 60,
  });

  function renderContent() {
    if (!summary) return null;

    if (summary.total > 0) return <Summary />;

    return <EmptyGoals />;
  }

  return (
    <Dialog>
      {renderContent()}
      <CreateGoal />
    </Dialog>
  );
}
