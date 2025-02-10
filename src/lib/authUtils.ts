"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "./prisma";

export const isUserModifyingSelf = async (userId: number) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const userFromDb = await prisma.user.findUnique({
    where: {
      kindeId: user.id,
    },
  });

  if (!userFromDb) {
    throw new Error("User not found");
  }

  const isModifyingSelf = userFromDb.id === userId;

  if (!isModifyingSelf) {
    throw new Error("User is not modifying self");
  }

  return isModifyingSelf;
};

export const getUserIdFromKindeId = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const userFromDb = await prisma.user.findUnique({
    where: { kindeId: user.id },
  });

  if (!userFromDb) {
    return null;
  }

  return userFromDb.id;
};
