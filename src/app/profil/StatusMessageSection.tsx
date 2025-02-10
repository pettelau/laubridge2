"use client";

import { useState } from "react";
import { formatTimeAgoNorwegian } from "@/lib/utils";
import { PencilIcon } from "lucide-react";
import { updateStatusMessage } from "@/data-access/profile";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface StatusMessageSectionProps {
  userId: number;
  initialMessage: string | null;
  updatedAt: Date | null;
}

export function StatusMessageSection({
  userId,
  initialMessage,
  updatedAt,
}: StatusMessageSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(
    initialMessage ?? "På jakt etter den neste store gevinsten! 🎲"
  );
  const [lastUpdated, setLastUpdated] = useState(updatedAt);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStatusMessage(userId, message);

      setLastUpdated(new Date());
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update status message:", error);
    }
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg relative">
      <div className="absolute -top-2 left-4 w-4 h-4 bg-blue-50 transform rotate-45" />

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 rounded border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            rows={2}
          />
          <div className="flex gap-2">
            <Button type="submit">Lagre</Button>
            <Button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Avbryt
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <p className="text-gray-700 italic">{message}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {lastUpdated
              ? `Oppdatert ${formatTimeAgoNorwegian(lastUpdated)}`
              : ""}
          </p>
        </>
      )}
    </div>
  );
}
