import { getBondeUsersWithUser } from "@/data-access/bondeUser";
import { getClubWithUsers } from "@/data-access/clubs";
import { BondeUserWithUser, ClubWithUsers } from "types/types";
import { ClubMemberCard } from "./ClubMemberCard";
import { ClubAddMember } from "./ClubAddMember";
import { getUserIdFromKindeId } from "@/lib/authUtils";

export default async function ClubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const club: ClubWithUsers | null = await getClubWithUsers(
    Number(resolvedParams.id)
  );

  const bondeUsers: BondeUserWithUser[] = await getBondeUsersWithUser();
  const userId = await getUserIdFromKindeId();

  if (!club) {
    return <div className="container mx-auto py-8">Klubb ikke funnet</div>;
  }
  const isCreator = club.creatorId === userId;

  return (
    <div className="container mx-auto py-4 sm:py-8 space-y-4 sm:space-y-8">
      <div className="px-2 sm:px-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {club.name}
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm sm:text-base mx-auto sm:mx-0">
          {club.description ?? "Ingen beskrivelse"}
        </p>
      </div>
      <div className="sm:px-4 w-full">
        <div className="flex flex-col gap-2 mb-2 sm:mb-4 px-2 sm:px-0 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Medlemmer
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 px-2 sm:px-0 mb-4 justify-center sm:justify-start">
          {club.bondeUserClub.map((member) => (
            <ClubMemberCard key={member.id} user={member.bondeUser} />
          ))}
        </div>
        <div className="flex justify-center sm:justify-start">
          {isCreator && <ClubAddMember club={club} bondeUsers={bondeUsers} />}
        </div>
      </div>
    </div>
  );
}
