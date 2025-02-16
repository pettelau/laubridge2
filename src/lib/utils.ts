import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, isAfter, subMonths } from "date-fns";
import { nb } from "date-fns/locale";
import { GameWithRelations } from "@/data-access/games";
import { RoundWithRelations } from "types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgoNorwegian(date: Date | null): string {
  if (!date) return "-";

  if (!isAfter(date, subMonths(new Date(), 1))) {
    return "mer enn en måned siden";
  }

  const timeAgo =
    "for " +
    formatDistanceToNow(date, {
      locale: nb,
      addSuffix: true,
    });

  // Return "akkurat nå" if less than a minute ago
  if (timeAgo.includes("ett minutt siden")) {
    return "akkurat nå";
  }

  return timeAgo
    .replace("cirka", "ca.")
    .replace("mindre enn", "under")
    .replace("over", "mer enn");
}

export const calculateWinnerPrice = (
  winnerScore: number,
  loserScore: number,
  moneyMultiplier: number,
  extraCostLoser: number
): number => {
  if (winnerScore === loserScore) {
    return 0;
  }
  const scoreDifference = winnerScore - loserScore;
  return scoreDifference * moneyMultiplier + extraCostLoser;
};

export const getUniquePlayerInitials = (
  dealer: GameWithRelations["gamePlayers"][0],
  allPlayers: GameWithRelations["gamePlayers"]
): string => {
  const firstLetter = dealer.bondeUser.nickname.charAt(0);
  const hasOtherPlayerWithSameInitial = allPlayers.some(
    (player) =>
      player.id !== dealer.id &&
      player.bondeUser.nickname.charAt(0).toLowerCase() ===
        firstLetter.toLowerCase()
  );

  return hasOtherPlayerWithSameInitial
    ? dealer.bondeUser.nickname.slice(0, 2)
    : firstLetter;
};

export const getStandColor = (consecutiveStands: number): string => {
  if (consecutiveStands === 0) {
    return "#ffadad"; // light red
  }

  // Define bonus level thresholds and their corresponding colors
  const bonusLevels = [
    { threshold: 8, color: "#86efac" }, // light green
    { threshold: 12, color: "#0ed7f2" }, // light cyan
    { threshold: 16, color: "#c4b5fd" }, // light purple
    { threshold: 20, color: "#fcd34d" }, // light amber
    { threshold: 24, color: "#f472b6" }, // light pink
  ];

  // Find current bonus level
  const currentLevelIndex = bonusLevels.findIndex(
    (level, index, array) =>
      consecutiveStands < level.threshold || index === array.length - 1
  );

  // If we're at the max level (24+)
  if (currentLevelIndex === -1 || consecutiveStands >= 24) {
    return bonusLevels[bonusLevels.length - 1].color;
  }

  const previousThreshold =
    currentLevelIndex === 0 ? 0 : bonusLevels[currentLevelIndex - 1].threshold;
  const currentThreshold = bonusLevels[currentLevelIndex].threshold;

  // Calculate progress within current level (0 to 1)
  const progress =
    (consecutiveStands - previousThreshold) /
    (currentThreshold - previousThreshold);

  const isFirstLevel = currentLevelIndex === 0;
  // Start very light (0.9) for first level and go to 0.1, other levels start at 0.3
  const startingLightness = isFirstLevel ? 0.7 : 0.5;
  const targetColor = bonusLevels[currentLevelIndex].color;
  const lightenedColor = lightenHexColor(
    targetColor,
    startingLightness - (isFirstLevel ? progress * 0.8 : progress * 0.25)
  );

  return lightenedColor;
};

// Helper function to lighten a hex color
const lightenHexColor = (hex: string, amount: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const lightenChannel = (channel: number) => {
    return Math.round(channel + (255 - channel) * amount);
  };

  const rr = lightenChannel(r).toString(16).padStart(2, "0");
  const gg = lightenChannel(g).toString(16).padStart(2, "0");
  const bb = lightenChannel(b).toString(16).padStart(2, "0");

  return `#${rr}${gg}${bb}`;
};

export const calculatePlayerScore = (
  rounds: RoundWithRelations[],
  gamePlayerId: number,
  upToIndex?: number
) => {
  let score = 0;
  let consecutiveStands = 0;
  let consecutiveBusts = 0;

  const roundsToCalculate =
    upToIndex !== undefined ? rounds.slice(0, upToIndex) : rounds;

  roundsToCalculate
    .filter((round) => round.isSettled)
    .forEach((round, idx) => {
      const playerScore = round.playerScores.find(
        (score) => score.gamePlayerId === gamePlayerId
      );

      if (!playerScore) return;

      // Base score calculation
      if (playerScore.stand) {
        const baseScore = playerScore.numTricks * playerScore.numTricks + 10;
        score += baseScore;
      }

      // Handle consecutive stands
      if (playerScore.stand) {
        consecutiveStands++;
        consecutiveBusts = 0;

        // Add bonus for consecutive stands
        if (consecutiveStands === 8) score += 30;
        if (consecutiveStands === 12) score += 30;
        if (consecutiveStands === 16) score += 30;
        if (consecutiveStands === 20) score += 30;
        if (consecutiveStands === 24) score += 30;
      } else {
        consecutiveStands = 0;
        consecutiveBusts++;

        // Add penalties for consecutive non-stands
        if (consecutiveBusts === 3) score -= 10;
        if (consecutiveBusts === 6) score -= 30;
        if (consecutiveBusts === 9) score -= 50;
        if (consecutiveBusts >= 12) {
          const extraPenalties = Math.floor((consecutiveBusts - 9) / 3);
          score -= extraPenalties * 20;
        }
      }
    });

  return score;
};
