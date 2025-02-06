"use client";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { connectUserToBondeUser } from "@/data-access/bondeUser";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { BondeUser } from "@prisma/client";
import { useState, useTransition } from "react";

const ConnectUserToBundeUser = ({
  bondeUsers,
}: {
  bondeUsers: BondeUser[];
}) => {
  const [selectedUser, setSelectedUser] = useState<BondeUser | null>(null);
  const [isPending, startTransition] = useTransition();

  const { user } = useKindeBrowserClient();

  const handleConnectUser = () => {
    if (!selectedUser || !user) return;
    startTransition(async () => {
      await connectUserToBondeUser(user.id, selectedUser.id);
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Koble bruker til eksisterende bonde-bruker
      </h2>
      <div className="flex flex-col gap-4">
        <Combobox
          placeholder="Velg en bonde-bruker..."
          searchPlaceholder="Søk ..."
          notFoundText="Ingen bonde-bruker funnet."
          items={bondeUsers.map((user) => ({
            value: user.id.toString(),
            label: user.nickname,
          }))}
          value={selectedUser?.id.toString() ?? ""}
          onChange={(value) => {
            const user = bondeUsers.find(
              (user) => user.id.toString() === value
            );
            setSelectedUser(user ?? null);
          }}
        />
        <ConfirmationModal
          type="warning"
          title="Koble til bruker"
          description={`Er du sikker på at du vil koble brukeren din til bonde-brukeren ${selectedUser?.nickname}?`}
          actionText="Koble til bruker"
          onAction={handleConnectUser}
        >
          <Button disabled={!selectedUser || isPending}>
            Koble til bruker
          </Button>
        </ConfirmationModal>
      </div>
    </div>
  );
};

export { ConnectUserToBundeUser };
