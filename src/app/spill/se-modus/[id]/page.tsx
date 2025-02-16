import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { ClientInterface } from "./components/client-interface";
import { getGame } from "@/data-access/games";

export default async function SpillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const game = await getGame(resolvedParams.id);

  if (!game) {
    return <div>Kunne ikke finne spill</div>;
  }

  return <ClientInterface game={game} />;
}
