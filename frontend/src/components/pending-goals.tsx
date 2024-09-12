import { Plus } from "lucide-react";
import { OutlineButton } from "./ui/outline-button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingGoals } from "../http/get-pending-goals";
import { createGoalCompletion } from "../http/create-goal-completion";

export function PendingGoals() {
  const queryClient = useQueryClient();

  const { data: pendingGoals } = useQuery({
    queryKey: ["pending-goals"],
    queryFn: getPendingGoals,
    staleTime: 1000 * 60,
  });

  if (!pendingGoals) return null;

  async function handleCompleteGoal(goalId: string) {
    await createGoalCompletion(goalId);

    queryClient.invalidateQueries({ queryKey: ["summary"] });
    queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
  }

  return (
    <div className="flex flex-wrap gap-3">
      {pendingGoals.map((pendingGoal) => {
        return (
          <OutlineButton
            key={pendingGoal.id}
            disabled={
              pendingGoal.completionCount >= pendingGoal.desiredWeeklyFrequency
            }
            onClick={() => handleCompleteGoal(pendingGoal.id)}
          >
            <Plus className="size-4 text-zinc-600" />
            {pendingGoal.title}
          </OutlineButton>
        );
      })}
    </div>
  );
}
