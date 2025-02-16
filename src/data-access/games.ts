"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

export async function getGame(id: string) {
  const game: GameWithRelations | null = await prisma.game.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      gamePlayers: {
        orderBy: {
          id: "asc",
        },
        include: {
          bondeUser: {
            include: {
              user: true,
            },
          },
        },
      },
      rounds: {
        include: {
          playerScores: {
            orderBy: {
              gamePlayerId: "asc",
            },
          },
        },
      },
    },
  });

  return game;
}

export type GameCreateInput = {
  players: number[];
  multiplier: number;
  extraCostLoser: number;
  extraCostSecondLast: number;
  firstDealer: number;
};

export async function createGame(game: GameCreateInput) {
  return await prisma.$transaction(async (tx) => {
    // Create game first
    const createdGame = await tx.game.create({
      data: {
        moneyMultiplier: game.multiplier,
        extraCostLoser: game.extraCostLoser,
        extraCostSecondLast: game.extraCostSecondLast,
      },
    });

    // Create game players first
    await tx.gamePlayer.createMany({
      data: game.players.map((playerId) => ({
        gameId: createdGame.id,
        playerId,
      })),
    });

    // Get the created game players to have their IDs
    const createdGamePlayers = await tx.gamePlayer.findMany({
      where: { gameId: createdGame.id },
      orderBy: { id: "asc" },
    });

    const numPlayers = game.players.length;
    const maxCards = numPlayers === 4 ? 13 : 10;

    // Helper function to calculate dealer index
    const calculateDealerIndex = (roundIndex: number) => {
      return (game.firstDealer + roundIndex) % numPlayers;
    };

    let roundCounter = 0;

    // Create all rounds first
    await tx.round.createMany({
      data: [
        // Going down
        ...Array.from({ length: maxCards - 1 }, (_, i) => {
          const cards = maxCards - i;
          if (numPlayers === 5 && cards === 10) {
            return [
              {
                numCards: cards,
                dealerIndex: calculateDealerIndex(roundCounter++),
                isTriumphRound: false,
                gameId: createdGame.id,
              },
              {
                numCards: cards,
                dealerIndex: calculateDealerIndex(roundCounter++),
                isTriumphRound: false,
                gameId: createdGame.id,
              },
              {
                numCards: cards,
                dealerIndex: calculateDealerIndex(roundCounter++),
                isTriumphRound: false,
                gameId: createdGame.id,
              },
            ];
          }
          if (numPlayers === 5 && cards === 9) {
            return [
              {
                numCards: cards,
                dealerIndex: calculateDealerIndex(roundCounter++),
                isTriumphRound: false,
                gameId: createdGame.id,
              },
              {
                numCards: cards,
                dealerIndex: calculateDealerIndex(roundCounter++),
                isTriumphRound: false,
                gameId: createdGame.id,
              },
            ];
          }
          return [
            {
              numCards: cards,
              dealerIndex: calculateDealerIndex(roundCounter++),
              isTriumphRound: false,
              gameId: createdGame.id,
            },
          ];
        }).flat(),
        // Going up
        ...Array.from({ length: maxCards - 1 }, (_, i) => {
          const cards = i + 2;
          if (numPlayers === 5 && cards === 9) {
            return [
              {
                numCards: cards,
                dealerIndex: calculateDealerIndex(roundCounter++),
                isTriumphRound: true,
                gameId: createdGame.id,
              },
              {
                numCards: cards,
                dealerIndex: calculateDealerIndex(roundCounter++),
                isTriumphRound: true,
                gameId: createdGame.id,
              },
            ];
          }
          if (numPlayers === 5 && cards === 10) {
            return [
              {
                numCards: cards,
                dealerIndex: calculateDealerIndex(roundCounter++),
                isTriumphRound: true,
                gameId: createdGame.id,
              },
              {
                numCards: cards,
                dealerIndex: calculateDealerIndex(roundCounter++),
                isTriumphRound: true,
                gameId: createdGame.id,
              },
              {
                numCards: cards,
                dealerIndex: calculateDealerIndex(roundCounter++),
                isTriumphRound: true,
                gameId: createdGame.id,
              },
            ];
          }
          return [
            {
              numCards: cards,
              dealerIndex: calculateDealerIndex(roundCounter++),
              isTriumphRound: true,
              gameId: createdGame.id,
            },
          ];
        }).flat(),
      ],
    });

    // Get all created rounds
    const createdRounds = await tx.round.findMany({
      where: { gameId: createdGame.id },
      orderBy: { id: "asc" },
    });

    // Create player scores for each round using the actual gamePlayer IDs
    await tx.playerScore.createMany({
      data: createdRounds.flatMap((round) =>
        createdGamePlayers.map((gamePlayer) => ({
          roundId: round.id,
          gamePlayerId: gamePlayer.id,
        }))
      ),
    });

    return await tx.game.findUnique({
      where: { id: createdGame.id },
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
        rounds: {
          include: {
            playerScores: true,
          },
        },
      },
    });
  });
}
