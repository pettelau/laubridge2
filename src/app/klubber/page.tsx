import { getClubsWithBondeUsers } from "@/data-access/clubs";
import { ClubWithBondeUsers } from "types/types";
import { Card } from "@/components/ui/card";
import { CreateNewClub } from "./CreateNewClub";
import { ClubCard } from "./ClubCard";

export default async function KlubberPage() {
  const clubs: ClubWithBondeUsers[] = await getClubsWithBondeUsers();

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header Section */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold tracking-tight">Klubber</h1>
          <CreateNewClub />
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Klubber lar deg organisere spillelag og holde oversikt over intern
          statistikk og regnskap. I tillegg blir det enklere å opprette nye
          spill. Du kan være medlem av flere klubber samtidig. Her får du en
          oversikt over alle klubber, i tillegg kan du opprette en ny klubb
          eller bli med i en eksisterende.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-3 sm:px-0">
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
      {clubs.length === 0 && (
        <Card className="p-8 text-center">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Ingen klubber ennå</h3>
            <p className="text-muted-foreground">
              Hvorfor ikke være den første til å opprette en klubb?
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
