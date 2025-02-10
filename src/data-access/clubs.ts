"use server";

import { getUserIdFromKindeId } from "@/lib/authUtils";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const getClubs = async () => {
  const clubs = await prisma.club.findMany();
  return clubs;
};

export const createClub = async (name: string, description: string) => {
  const userId = await getUserIdFromKindeId();

  if (!userId) {
    throw new Error("User not found");
  }

  const club = await prisma.club.create({
    data: { name, description, creatorId: userId },
  });
  revalidatePath("/klubber");
  return club;
};

export const getClubsWithBondeUsers = async () => {
  const clubs = await prisma.club.findMany({
    include: {
      bondeUserClub: {
        include: {
          bondeUser: true,
        },
      },
    },
  });
  return clubs;
};

export const getClubWithUsers = async (clubId: number) => {
  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: {
      creator: true,
      bondeUserClub: {
        include: {
          bondeUser: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
  return club;
};

export const addMemberToClub = async (clubId: number, bondeUserId: number) => {
  const member = await prisma.bondeUserClub.create({
    data: {
      clubId,
      bondeUserId,
      isAccepted: true,
    },
  });
  revalidatePath(`/klubber/${clubId}`);
  return member;
};
