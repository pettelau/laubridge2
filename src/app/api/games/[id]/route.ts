import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getGame } from "@/data-access/games";

// Define the type based on your query
export type GameWithRelations = Prisma.GameGetPayload<{
  include: {
    gamePlayers: {
      include: {
        bondeUser: {
          include: {
            user: true;
          };
        };
      };
    };
    rounds: {
      include: {
        playerScores: true;
      };
    };
  };
}>;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  const game = await getGame(id);

  if (!game) {
    return NextResponse.json({ error: "Spill ikke funnet" }, { status: 404 });
  }

  return NextResponse.json(game);
}
