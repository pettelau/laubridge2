"use server";
import prisma from "../../prisma/prisma";

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
  userId: number,
  bondeUserId: number
) => {
  return await prisma.bondeUser.update({
    where: { id: bondeUserId },
    data: { userId },
  });
};
