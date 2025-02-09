"use server";
import prisma from "@/lib/prisma";
export const getBondeUser = async (userId: number) => {
  return await prisma.bondeUser.findUnique({
    where: { userId },
  });
};

export const getBondeUsers = async () => {
  return await prisma.bondeUser.findMany();
};

export const getAvailableBondeUsers = async () => {
  return await prisma.bondeUser.findMany({
    where: {
      userId: null,
    },
  });
};

export const connectUserToBondeUser = async (
  kindeUserId: string,
  bondeUserId: number
) => {
  const userId = await prisma.user.findUnique({
    where: {
      kindeId: kindeUserId,
    },
    select: {
      id: true,
    },
  });

  if (!userId) {
    throw new Error("User not found");
  }

  return await prisma.bondeUser.update({
    where: { id: bondeUserId },
    data: { userId: userId.id },
  });
};
