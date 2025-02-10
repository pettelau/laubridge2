"use server";

import { isUserModifyingSelf } from "@/lib/authUtils";
import prisma from "@/lib/prisma";

export async function updateStatusMessage(userId: number, message: string) {
  await isUserModifyingSelf(userId);

  await prisma.user.update({
    where: { id: userId },
    data: { statusMessage: message, statusMessageUpdatedAt: new Date() },
  });
}
