import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { ClubWithBondeUsers } from "types/types";
import Link from "next/link";

type Props = {
  club: ClubWithBondeUsers;
};

export const ClubCard = ({ club }: Props) => {
  return (
    <Link href={`/klubber/${club.id}`}>
      <Card
        key={club.id}
        className="hover:shadow-lg transition-shadow cursor-pointer"
      >
        <CardHeader>
          <CardTitle>{club.name}</CardTitle>
          <CardDescription>
            {club.description || "Ingen beskrivelse"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Members count */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{club.bondeUserClub.length} medlemmer</span>
            </div>

            {/* Mock Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Totalt spilt for
                </p>
                <p className="text-xl font-semibold">12 450 kr</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Antall spill</p>
                <p className="text-xl font-semibold">45</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Største pot</p>
                <p className="text-xl font-semibold">890 kr</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Aktive spillere</p>
                <p className="text-xl font-semibold">8</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
