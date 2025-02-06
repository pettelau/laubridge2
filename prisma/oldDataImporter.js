import { GameStatus, PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new PrismaClient();

await db.bondeUser.deleteMany();
await db.game.deleteMany();
await db.gamePlayer.deleteMany();
await db.round.deleteMany();
await db.playerScore.deleteMany();

async function resetIdSequences() {
  const tables = ["BondeUser", "Game", "GamePlayer", "Round", "PlayerScore"];
  await Promise.all(
    tables.map((table) =>
      db.$executeRawUnsafe(`ALTER SEQUENCE "${table}_id_seq" RESTART WITH 1;`),
    ),
  );
}

resetIdSequences();

let userIdMap = {};
let gameIdMap = {};
let gamePlayerIdMap = {};
let roundIdMap = {};

const parseSection = (lines, parseLine) => {
  return lines.map((line) => parseLine(line.split("\t")));
};

const isTriumphRound = (round, nextRound) => {
  if (!nextRound) {
    return true;
  }

  if (round.oldGameId !== nextRound.oldGameId) {
    return true;
  }

  return (
    round.numCards + 1 === nextRound.numCards &&
    round.oldGameId === nextRound.oldGameId
  );
};

const importData = async () => {
  const dumpPath = path.join(__dirname, "dump_laubet_06_02_25.sql");
  const dumpContent = fs.readFileSync(dumpPath, "utf-8");
  const sections = dumpContent.split("\n\n");

  for (const section of sections) {
    const lines = section.split("\n");
    const header = lines[0];
    const dataLines = lines.slice(1);

    if (header.startsWith("COPY public.bonde_users")) {
      console.log("Section: users");
      const users = parseSection(dataLines, (parts) => ({
        oldUserId: parts[0],
        nickname: parts[1],
        isFavorite: parts[2] === "t",
      }));

      for (const user of users) {
        const bondeUser = await db.bondeUser.create({
          data: {
            nickname: user.nickname,
            isFavorite: user.isFavorite,
          },
        });
        userIdMap[user.oldUserId] = bondeUser.id;
      }
    } else if (header.startsWith("COPY public.games")) {
      console.log("Section: games");
      const games = parseSection(dataLines, (parts) => ({
        oldGameId: parts[0],
        status: GameStatus.FINISHED,
        moneyMultiplier: parseFloat(parts[2]),
        extraCostLoser: parts[3] ? parseInt(parts[3], 10) : 0,
        extraCostSecondLast: parts[4] ? parseInt(parts[4], 10) : 0,
        createdOn: new Date(parts[5]),
      }));

      for (const game of games) {
        const { oldGameId, ...createData } = game;
        const newGame = await db.game.create({
          data: createData,
        });
        gameIdMap[game.oldGameId] = newGame.id;
      }
    } else if (header.startsWith("COPY public.game_players")) {
      console.log("Section: game players");
      const gamePlayers = parseSection(dataLines, (parts) => ({
        oldGamePlayerId: parts[0], // Used for mapping, not inserted
        oldGameId: parts[1], // Used to find new gameId, not inserted
        oldUserId: parts[2], // Used to find new playerId, not inserted
        score: parseInt(parts[3], 10),
        bleedings: parts[4] ? parseInt(parts[4], 10) : null,
        warnings: parts[5] ? parseInt(parts[5], 10) : null,
      }));

      for (const player of gamePlayers) {
        const gamePlayer = await db.gamePlayer.create({
          data: {
            gameId: parseInt(gameIdMap[player.oldGameId], 10), // Use mapped gameId
            playerId: parseInt(userIdMap[player.oldUserId], 10), // Use mapped playerId
            score: player.score,
            bleedings: player.bleedings,
            warnings: player.warnings,
            
          },
        });
        gamePlayerIdMap[player.oldGamePlayerId] = gamePlayer.id; // Keep track of new ID for reference
      }
    } else if (header.startsWith("COPY public.rounds")) {
      console.log("Section: rounds");
      const rounds = parseSection(dataLines, (parts) => ({
        oldRoundId: parts[0],
        oldGameId: parts[1],
        numCards: parseInt(parts[2], 10),
        dealerIndex: parseInt(parts[3], 10),
      }));

      for (const [i, round] of rounds.entries()) {
        console.log(round.oldRoundId);
        const newRound = await db.round.create({
          data: {
            numCards: round.numCards,
            dealerIndex: round.dealerIndex,
            isSettled: true,
            isTriumphRound: isTriumphRound(round, rounds[i + 1]),
            gameId: parseInt(gameIdMap[round.oldGameId], 10),
          },
        });
        roundIdMap[round.oldRoundId] = newRound.id;
      }
    } else if (header.startsWith("COPY public.player_scores")) {
      console.log("Section: player scores");
      const playerScores = parseSection(dataLines, (parts) => ({
        oldRoundId: parts[1],
        numTricks: parseInt(parts[2], 10),
        stand: parts[3] === "t",
        oldGamePlayerId: parts[4],
      }));

      for (const playerScore of playerScores) {
        await db.playerScore.create({
          data: {
            roundId: parseInt(roundIdMap[playerScore.oldRoundId], 10),
            gamePlayerId: parseInt(
              gamePlayerIdMap[playerScore.oldGamePlayerId],
              10,
            ),
            numTricks: playerScore.numTricks,
            stand: playerScore.stand,
          },
        });
      }
    }
  }
};

importData().catch((error) => {
  console.error("Error importing data:", error);
  process.exit(1);
});
