import {
  getKindeServerSession,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../../prisma/prisma";
import { ProfilePage } from "./ProfilePage";

async function getUser(kindeId: string) {
  return await prisma.user.findUnique({
    where: { kindeId },
    include: {
      bondeUser: true,
    },
  });
}

export default async function ProfilPage() {
  const { getUser: getKindeUser } = getKindeServerSession();
  const kindeUser = await getKindeUser();

  if (!kindeUser) {
    redirect("/api/auth/login");
  }

  const user = await getUser(kindeUser.id);

  if (!user) {
    return <LoginLink>Logg inn</LoginLink>;
  }

  return <ProfilePage user={user} />;
}
