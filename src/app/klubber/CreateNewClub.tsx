"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClub } from "@/data-access/clubs";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export const CreateNewClub = () => {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { user } = useKindeBrowserClient();

  const handleCreateClub = async () => {
    if (!user) {
      return;
    }

    startTransition(async () => {
      await createClub(name, description);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={!user} asChild>
        <Button>
          {user ? "Opprett ny klubb" : "Logg inn for å opprette klubb"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Opprett ny klubb</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Navn</Label>
            <Input
              disabled={isPending}
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Beskrivelse</Label>
            <Textarea
              disabled={isPending}
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Avbryt</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleCreateClub}>
            Opprett
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
