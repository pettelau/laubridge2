"use client";

import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { NewMultiSelect } from "@/components/ui/new-multi-select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { BondeUser } from "@prisma/client";
import { GamesResponse } from "../api/games/route";
import { GameWithPlayers } from "types/types";
import { DateRange as DayPickerDateRange } from "react-day-picker";
import {
  CalendarIcon,
  CoinsIcon,
  ArrowUpIcon,
  EyeIcon,
  FilePenIcon,
} from "lucide-react";
import { nb } from "date-fns/locale";
import { calculateWinnerPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { PlayerWithClubs } from "../api/players/route";

export default function SpillPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DayPickerDateRange | undefined>();
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const fetchGames = async ({
    pageParam = 1,
    sortOrder,
    dateRange,
    selectedPlayers,
  }: {
    pageParam: number;
    sortOrder: string;
    dateRange?: DayPickerDateRange;
    selectedPlayers?: number[];
  }) => {
    const params = new URLSearchParams({
      page: pageParam.toString(),
      sortOrder,
    });

    if (dateRange?.from) {
      params.set("startDate", dateRange.from.toISOString());
    }
    if (dateRange?.to) {
      params.set("endDate", dateRange.to.toISOString());
    }
    if (selectedPlayers?.length) {
      params.set("playerIds", selectedPlayers.join(","));
    }

    const response = await fetch(`/api/games?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: GamesResponse = await response.json();

    return {
      ...data,
      nextPage: data.hasMore ? pageParam + 1 : undefined,
    };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["games", dateRange, selectedPlayers, sortOrder],
      queryFn: ({ pageParam }) =>
        fetchGames({ pageParam, sortOrder, dateRange, selectedPlayers }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });

  const games = data?.pages.flatMap((page) => page.games) ?? [];

  const { data: players } = useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const response = await fetch("/api/players");
      return response.json();
    },
  });

  const playerOptions =
    players?.map((player: PlayerWithClubs) => ({
      label: player.nickname,
      value: player.id.toString(),
    })) || [];

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="space-y-4 mb-8">
        <div className="grid gap-4 md:grid-cols-3 items-start">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">
              Tidsperiode
            </label>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Sortering
            </label>
            <Select
              value={sortOrder}
              onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Sorter etter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Nyeste først</SelectItem>
                <SelectItem value="asc">Eldste først</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-3">
            <label className="text-sm font-medium text-muted-foreground">
              Spillere
            </label>
            <NewMultiSelect
              options={playerOptions}
              onValueChange={(values) =>
                setSelectedPlayers(values.map((v) => parseInt(v)))
              }
              defaultValue={selectedPlayers.map((id) => id.toString())}
              placeholder="Filtrer på spillere"
              maxCount={5}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game: GameWithPlayers) => (
          <Card
            key={game.id}
            className="relative hover:shadow-lg border-2 border-gray-200"
          >
            <div
              className={`absolute top-0 right-0 w-2 h-full rounded-r-lg ${
                game.status === "FINISHED" ? "bg-blue-950" : "bg-blue-500"
              }`}
            />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">
                  BB #{game.id}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {game.status === "FINISHED" ? (
                    <Badge variant="default" className="font-medium">
                      Fullført
                    </Badge>
                  ) : (
                    <Badge variant="default" className="font-medium">
                      Pågående
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {format(new Date(game.createdOn), "PPP HH:mm", {
                    locale: nb,
                  })}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-muted-foreground text-sm gap-2">
                    <CoinsIcon className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium flex items-center">
                      x {Number(game.moneyMultiplier)} (
                      <ArrowUpIcon className="w-4 h-4 text-green-700 inline" />
                      {game.extraCostLoser},<span> </span>
                      <ArrowUpIcon className="w-4 h-4 text-green-400 inline" />
                      {game.extraCostSecondLast})
                    </span>
                  </div>
                  {(game.extraCostLoser || game.extraCostSecondLast) && (
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      {game.extraCostLoser && (
                        <div className="flex items-center gap-2">
                          <span className="w-4 text-center">🥇</span>
                          <span>
                            {calculateWinnerPrice(
                              Math.max(...game.gamePlayers.map((p) => p.score)),
                              Math.min(...game.gamePlayers.map((p) => p.score)),
                              Number(game.moneyMultiplier),
                              game.extraCostLoser
                            )}{" "}
                            kr
                          </span>
                        </div>
                      )}
                      {game.extraCostSecondLast && (
                        <div className="flex items-center gap-2">
                          <span className="w-4 text-center">🥈</span>
                          <span>
                            {calculateWinnerPrice(
                              [...game.gamePlayers].sort(
                                (a, b) => b.score - a.score
                              )[1]?.score,
                              [...game.gamePlayers].sort(
                                (a, b) => a.score - b.score
                              )[1]?.score,
                              Number(game.moneyMultiplier),
                              game.extraCostSecondLast
                            )}{" "}
                            kr
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {game.gamePlayers
                      .sort((a, b) => b.score - a.score)
                      .map((gp, index, array) => (
                        <Badge
                          key={gp.id}
                          className={`flex items-center gap-1 justify-center ${
                            index === array.length - 1 && array.length % 2 === 1
                              ? "col-span-2"
                              : ""
                          }`}
                          variant={"outline"}
                        >
                          <span className="font-light">
                            {gp.bondeUser.nickname}
                          </span>
                          <span className="font-bold">{gp.score}</span>
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 items-center justify-center">
              <Button
                className="w-full"
                size="sm"
                variant="outline"
                onClick={() => router.push(`/spill/se-modus/${game.id}`)}
              >
                <span className="flex text-sm items-center gap-2">
                  <EyeIcon className="w-4 h-4 mr-2" />
                  Se på
                </span>
              </Button>
              <Button className="w-full" size="sm">
                <span className="flex text-sm items-center gap-2">
                  <FilePenIcon className="w-4 h-4 mr-2" />
                  Skrive
                </span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {hasNextPage && (
        <div className="mt-8 text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isLoading || isFetchingNextPage}
          >
            Last flere
          </Button>
        </div>
      )}
    </div>
  );
}
