import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const [kindeUser] = await Promise.all([getUser()]);

    if (!kindeUser) {
      return NextResponse.redirect("/auth/error");
    }

    await prisma.user.upsert({
      where: { kindeId: kindeUser.id },
      update: {
        email: kindeUser.email || "",
        firstName: kindeUser.given_name || "",
        lastName: kindeUser.family_name || "",
        lastLogin: new Date(),
        picture: kindeUser.picture || "",
      },
      create: {
        kindeId: kindeUser.id,
        email: kindeUser.email || "",
        firstName: kindeUser.given_name || "",
        lastName: kindeUser.family_name || "",
        picture: kindeUser.picture || "",
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/profil`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Auth callback error:", error.stack);
    } else {
      console.error("Auth callback error:", error);
    }
    const errorRedirectUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(new URL("/auth/error", errorRedirectUrl));
  }
}
