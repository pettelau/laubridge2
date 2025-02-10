"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { BondeUserWithUser, ClubWithUsers } from "types/types";
import { useState } from "react";
import { addMemberToClub } from "@/data-access/clubs";

type Props = {
  club: ClubWithUsers;
  bondeUsers: BondeUserWithUser[];
};

export const ClubAddMember = ({ club, bondeUsers }: Props) => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // Get existing member IDs from the club
  const existingMemberIds = club.bondeUserClub.map((membership) =>
    membership.bondeUserId.toString()
  );

  // Create items array for Combobox, marking existing members as disabled
  const comboboxItems = bondeUsers.map((user) => ({
    value: user.id.toString(),
    label: user.nickname,
    disabled: existingMemberIds.includes(user.id.toString()),
  }));

  const handleAddMember = async () => {
    const bondeUserId = Number(selectedUserId);
    await addMemberToClub(club.id, bondeUserId);
    setIsOpen(false);
    setSelectedUserId("");
  };

  return (
    <>
      <Button className="max-w-36" onClick={() => setIsOpen(true)}>Legg til medlem</Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Legg til medlem</h2>
            <p>Velg en bonde-bruker for å legge til som medlem av klubben.</p>
            <Combobox
              className="w-full"
              items={comboboxItems}
              value={selectedUserId}
              onChange={(value) => {
                setSelectedUserId(value);
              }}
              placeholder="Velg bruker..."
              searchPlaceholder="Søk etter bruker..."
              notFoundText="Ingen brukere funnet"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Avbryt
              </Button>
              <Button onClick={handleAddMember} disabled={!selectedUserId}>
                Legg til
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
