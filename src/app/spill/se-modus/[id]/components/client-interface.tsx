"use client";

import { Button } from "@/components/ui/button";
import { GameWithRelations } from "@/data-access/games";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, RefreshCcwIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getStandColor,
  getUniquePlayerInitials,
  calculatePlayerScore,
} from "@/lib/utils";
import React from "react";

export const ClientInterface = ({
  game: initialGame,
}: {
  game: GameWithRelations;
}) => {
  const [game, setGame] = useState<GameWithRelations | null>(initialGame);
  const { data, isLoading, refetch } = useQuery<GameWithRelations>({
    queryKey: ["game", initialGame.id],
    queryFn: () =>
      fetch(`/api/games/${initialGame.id}`).then((res) => res.json()),
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (data) {
      setGame(data);
    }
  }, [data]);

  if (!game) {
    return <div>Kunne ikke finne spill</div>;
  }

  const halfwayIndex = Math.floor(game.rounds.length / 2);

  return (
    <div className="flex mt-4 flex-col w-full mb-6 px-2 max-w-screen-lg mx-auto gap-4">
      <div className="flex w-full relative items-center">
        <Link className="flex items-center gap-2 absolute left-0" href="/spill">
          <ArrowLeftIcon className="w-4 h-4" />
          Tilbake
        </Link>
        <h2 className="text-xl font-bold w-full text-center">
          Spill {game.id}
        </h2>
        <Button
          onClick={() => refetch()}
          className="absolute right-0"
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCcwIcon
            className={`w-4 h-4 ${
              isLoading ? "animate-spin direction-reverse" : ""
            }`}
          />
        </Button>
      </div>
      <div className="w-full border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[1.5rem] min-w-[1.5rem] text-center text-xs sm:text-sm">
                #
              </TableHead>
              {game.gamePlayers.map((player) => (
                <TableHead
                  key={player.id}
                  className="max-w-0 w-[calc((100%-12rem)/var(--num-players))] text-center text-xs sm:text-sm"
                  style={
                    {
                      "--num-players": game.gamePlayers.length,
                    } as React.CSSProperties
                  }
                >
                  <div className="truncate">{player.bondeUser.nickname}</div>
                </TableHead>
              ))}
              <TableHead className="w-[1.5rem] sm:w-[3rem] sm:min-w-[3rem] text-center text-xs sm:text-sm">
                +/-
              </TableHead>
              <TableHead className="w-[1.5rem] sm:w-[3rem] sm:min-w-[3rem] text-left text-xs sm:text-sm">
                D♠
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {game.rounds.map((round, index) => {
              const dealerPlayer = game.gamePlayers[round.dealerIndex];
              const underOver =
                round.playerScores.reduce(
                  (acc, score) => acc + score.numTricks,
                  0
                ) - round.numCards;

              return (
                <React.Fragment key={round.id}>
                  {index === halfwayIndex && (
                    <TableRow
                      key={`halfway-${round.id}`}
                      className="bg-gray-50 border-gray-600 border-b border-t"
                    >
                      <TableCell className="text-center font-semibold">
                        =
                      </TableCell>
                      {game.gamePlayers.map((player) => (
                        <TableCell
                          key={player.id}
                          className="text-center font-semibold"
                        >
                          {calculatePlayerScore(
                            game.rounds,
                            player.id,
                            halfwayIndex
                          )}
                        </TableCell>
                      ))}
                      <TableCell />
                      <TableCell />
                    </TableRow>
                  )}
                  <TableRow key={round.id}>
                    <TableCell className="text-center text-gray-700 text-xs sm:text-sm">
                      {round.numCards}
                    </TableCell>
                    {game.gamePlayers.map((player) => {
                      const score = round.playerScores.find(
                        (score) => score.gamePlayerId === player.id
                      );
                      if (!score || !round.isSettled) {
                        return <TableCell key={player.id} />;
                      }
                      const isStand = score.stand;
                      let consecutiveStands = 0;
                      if (score.stand) {
                        // Count backwards from current round to find consecutive stands
                        for (let i = index; i >= 0; i--) {
                          const previousScore = game.rounds[
                            i
                          ].playerScores.find(
                            (s) => s.gamePlayerId === player.id
                          );
                          if (previousScore?.stand) {
                            consecutiveStands++;
                          } else {
                            break;
                          }
                        }
                      }

                      return (
                        <TableCell
                          key={player.id}
                          className={`max-w-0 w-[calc((100%-12rem)/var(--num-players))] text-center`}
                          style={
                            {
                              backgroundColor: getStandColor(
                                isStand ? consecutiveStands : 0
                              ),
                              "--num-players": game.gamePlayers.length,
                            } as React.CSSProperties
                          }
                        >
                          <div className="truncate">
                            {score.numTricks * score.numTricks + 10}
                          </div>
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-1 py-1 rounded-lg text-xs ${
                          underOver > 0 ? "bg-amber-100" : "bg-blue-100"
                        }`}
                      >
                        {Math.abs(underOver)}
                        {underOver > 0 ? "+" : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-left text-gray-700 text-xs sm:text-sm">
                      {dealerPlayer
                        ? getUniquePlayerInitials(
                            dealerPlayer,
                            game.gamePlayers
                          )
                        : ""}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
            <TableRow className="bg-gray-100">
              <TableCell className="text-center font-semibold">=</TableCell>
              {game.gamePlayers.map((player) => (
                <TableCell
                  key={player.id}
                  className="text-center font-semibold"
                >
                  {calculatePlayerScore(game.rounds, player.id)}
                </TableCell>
              ))}
              <TableCell />
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
