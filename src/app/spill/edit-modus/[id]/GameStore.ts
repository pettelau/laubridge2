import { create } from "zustand";
import { GameWithRelations } from "@/data-access/games";

type GameStore = {
  game?: GameWithRelations;
  setGame: (game: GameWithRelations) => void;
};

export const useGameStore = create<GameStore>()((set) => ({
  game: undefined,
  setGame: (game) => set({ game }),
}));

export const useGame = () => useGameStore((state) => state.game);
