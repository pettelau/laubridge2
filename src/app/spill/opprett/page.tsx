"use client";

import { useState, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewMultiSelect } from "@/components/ui/new-multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BondeUser } from "@prisma/client";
import { Dice1Icon, DicesIcon } from "lucide-react";
import { PlayerWithClubs } from "@/app/api/players/route";
import { createGame } from "@/data-access/games";
import { useRouter } from "next/navigation";

import { toast, useToast } from "@/hooks/use-toast";

export default function OpprettSpillPage() {
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [selectedClub, setSelectedClub] = useState<string>("");
  const [multiplier, setMultiplier] = useState("2");
  const [extraCostLoser, setExtraCostLoser] = useState("100");
  const [extraCostSecondLast, setExtraCostSecondLast] = useState("50");
  const [firstDealer, setFirstDealer] = useState("");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const { toast } = useToast();

  const { data: players, isLoading } = useQuery<PlayerWithClubs[]>({
    queryKey: ["players"],
    queryFn: async () => {
      const response = await fetch("/api/players");
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!players) {
    return <div>No players found</div>;
  }

  // Extract unique clubs from players
  const allClubs = Array.from(
    new Set(
      players.flatMap((player) =>
        player.clubs.map((club) =>
          JSON.stringify({
            id: club.club.id.toString(),
            name: club.club.name,
          })
        )
      )
    )
  ).map((club) => JSON.parse(club));

  // Filter players based on selected club
  const filteredPlayers =
    selectedClub && selectedClub !== "all"
      ? players.filter((player) =>
          player.clubs.some((club) => club.club.id.toString() === selectedClub)
        )
      : players;

  const playerOptions = filteredPlayers.map((player) => ({
    label: player.nickname,
    value: player.id.toString(),
  }));

  const selectedPlayerObjects = players.filter((player: BondeUser) =>
    selectedPlayers.includes(player.id)
  );

  const isValid =
    selectedPlayers.length >= 4 &&
    selectedPlayers.length <= 5 &&
    multiplier !== "" &&
    extraCostLoser !== "" &&
    extraCostSecondLast !== "" &&
    firstDealer !== "";

  const randomizeDealer = () => {
    if (selectedPlayerObjects?.length > 0) {
      const randomPlayer =
        selectedPlayerObjects[
          Math.floor(Math.random() * selectedPlayerObjects.length)
        ];
      setFirstDealer(randomPlayer.id.toString());
    }
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    // Handle game creation here
    console.log({
      players: selectedPlayers,
      multiplier,
      extraCostLoser,
      extraCostSecondLast,
      firstDealer,
    });

    startTransition(async () => {
      const game = await createGame({
        players: selectedPlayers,
        multiplier: parseInt(multiplier),
        extraCostLoser: parseInt(extraCostLoser),
        extraCostSecondLast: parseInt(extraCostSecondLast),
        firstDealer: parseInt(firstDealer),
      });

      if (game) {
        router.push(`/spill/se-modus/${game.id}`);
      } else {
        toast({
          variant: "destructive",
          title: "Feil ved opprettelse av spill",
          description: "Vennligst prøv igjen",
        });
      }
    });
  };

  return (
    <div className="max-w-lg w-full mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Kun spillere fra klubb</h2>
        <Select value={selectedClub} onValueChange={setSelectedClub}>
          <SelectTrigger>
            <SelectValue placeholder="Velg klubb" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle klubber</SelectItem>
            {allClubs.map((club) => (
              <SelectItem key={club.id} value={club.id}>
                {club.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Legg til spillere</h2>
        <NewMultiSelect
          options={playerOptions}
          onValueChange={(values) =>
            setSelectedPlayers(values.map((v) => parseInt(v)))
          }
          defaultValue={selectedPlayers.map((id) => id.toString())}
          placeholder="Velg spillere"
          maxCount={5}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Differanse ganges med</label>
          <Input
            type="number"
            value={multiplier}
            onChange={(e) => setMultiplier(e.target.value)}
            placeholder="2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Sum {selectedPlayers.length === 5 ? "5" : "4"}. plass til 1. plass
          </label>
          <Input
            type="number"
            value={extraCostLoser}
            onChange={(e) => setExtraCostLoser(e.target.value)}
            placeholder="100"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Sum {selectedPlayers.length === 5 ? "4" : "3"}. plass til 2. plass
          </label>
          <Input
            type="number"
            value={extraCostSecondLast}
            onChange={(e) => setExtraCostSecondLast(e.target.value)}
            placeholder="50"
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm mb-1">Dealer første runde</label>
            <Select
              disabled={selectedPlayers.length < 4}
              value={firstDealer}
              onValueChange={setFirstDealer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg dealer" />
              </SelectTrigger>
              <SelectContent>
                {selectedPlayerObjects?.map((player: BondeUser) => (
                  <SelectItem key={player.id} value={player.id.toString()}>
                    {player.nickname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            disabled={selectedPlayers.length < 4}
            variant="outline"
            className="self-end"
            onClick={randomizeDealer}
          >
            Random <DicesIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={!isValid || isPending}
      >
        {isPending ? "Oppretter spill..." : "Opprett spill"}
      </Button>
    </div>
  );
}
