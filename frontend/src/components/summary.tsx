import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { InOrbitIcon } from "./in-orbit-icon";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../http/get-summary";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-BR";
import { PendingGoals } from "./pending-goals";

dayjs.locale(ptBR);

export function Summary() {
  const { data: summary } = useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
    staleTime: 1000 * 60,
  });

  if (!summary) return null;

  const fistDayOfWeek = dayjs().startOf("week").format("D MMM");
  const lastDayOfWeek = dayjs().endOf("week").format("D MMM");
  const completedPercentage = Math.round(
    (summary?.completed * 100) / summary?.total
  );

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-bold capitalize">
            {fistDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>

        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>
      <div className="flex flex-col gap-3">
        <Progress value={8} max={15}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{" "}
            <span className="text-zinc-100">{summary?.completed}</span> de{" "}
            <span className="text-zinc-100">{summary?.total}</span> metas nessa
            semana.
          </span>
          <span>{completedPercentage}%</span>
        </div>
      </div>
      <Separator />
      <PendingGoals />
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Sua semana</h2>
        {Object.entries(summary.goalsPerDay).map(([date, goals]) => {
          const weekDay = dayjs(date).format("dddd");
          const formattedDate = dayjs(date).format("D [de] MMMM");

          return (
            <div className="flex flex-col gap-4" key={date}>
              <h3 className="font-bold">
                <span className="capitalize">{weekDay} </span>
                <span className="text-zinc-400 text-xs">({formattedDate})</span>
              </h3>

              <ul className="flex flex-col gap-3">
                {goals.map((goal) => {
                  const time = dayjs(goal.completedAt).format("HH:mm[h]");

                  return (
                    <li className="flex items-center gap-2" key={goal.id}>
                      <CheckCircle2 className="size-4 text-pink-500" />
                      <span className="text-sm text-zinc-400">
                        Você completou "
                        <span className="text-zinc-100">{goal.title}</span>" as{" "}
                        <span className="text-zinc-100">{time}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
