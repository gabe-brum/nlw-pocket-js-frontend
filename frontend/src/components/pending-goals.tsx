import { Plus } from "lucide-react";
import { OutlineButton } from "./ui/outline-button";
import { useQuery } from "@tanstack/react-query";
import { getPendingGoals } from "../http/get-pending-goals";

export function PendingGoals() {
  const { data: pendingGoals } = useQuery({
    queryKey: ["pending-goals"],
    queryFn: getPendingGoals,
    staleTime: 1000 * 60,
  });

  if (!pendingGoals) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {pendingGoals.map((pendingGoal) => {
        return (
          <OutlineButton
            key={pendingGoal.id}
            disabled={
              pendingGoal.completionCount >= pendingGoal.desiredWeeklyFrequency
            }
          >
            <Plus className="size-4 text-zinc-600" />
            {pendingGoal.title}
          </OutlineButton>
        );
      })}
    </div>
  );
}
