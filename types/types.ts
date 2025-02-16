import { Prisma } from "@prisma/client";

export enum UserRole {
  ADMIN = "ADMIN",
  PLAYER = "PLAYER",
}

export type BondeUserWithUser = Prisma.BondeUserGetPayload<{
  include: {
    user: true;
  };
}>;

export type ClubWithBondeUsers = Prisma.ClubGetPayload<{
  include: {
    bondeUserClub: {
      include: {
        bondeUser: true;
      };
    };
  };
}>;

export type ClubWithUsers = Prisma.ClubGetPayload<{
  include: {
    bondeUserClub: {
      include: {
        bondeUser: {
          include: {
            user: true;
          };
        };
      };
    };
  };
}>;

export type GameWithPlayers = Prisma.GameGetPayload<{
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
  };
}>;

export type RoundWithRelations = Prisma.RoundGetPayload<{
  include: {
    playerScores: true;
  };
}>;
