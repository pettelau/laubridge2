import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { GameWithPlayers } from "types/types";

export type GamesResponse = {
  games: GameWithPlayers[];
  hasMore: boolean;
  totalCount: number;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const playerIds = searchParams.get("playerIds")?.split(",").map(Number) || [];
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

  const pageSize = 10;

  const where = {
    AND: [
      startDate
        ? {
            createdOn: {
              gte: new Date(startDate),
            },
          }
        : {},
      endDate
        ? {
            createdOn: {
              lte: new Date(endDate),
            },
          }
        : {},
      playerIds.length > 0
        ? {
            AND: playerIds.map((playerId) => ({
              gamePlayers: {
                some: {
                  playerId: playerId,
                },
              },
            })),
          }
        : {},
    ],
  };

  const [games, totalCount] = await Promise.all([
    prisma.game.findMany({
      where,
      include: {
        gamePlayers: {
          include: {
            bondeUser: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdOn: sortOrder,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.game.count({ where }),
  ]);

  return NextResponse.json<GamesResponse>({
    games: games,
    hasMore: page * pageSize < totalCount,
    totalCount,
  });
}
