import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export type PlayerWithClubs = Prisma.BondeUserGetPayload<{
  include: {
    user: true;
    clubs: {
      include: {
        club: true;
      };
    };
  };
}>;

export async function GET() {
  const players = await prisma.bondeUser.findMany({
    include: {
      user: true,
      clubs: {
        include: {
          club: true,
        },
      },
    },
    orderBy: {
      nickname: "asc",
    },
  });

  return NextResponse.json(players);
}
