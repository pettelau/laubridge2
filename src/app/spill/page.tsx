import prisma from "@/lib/prisma";

export default async function SpillPage() {
  const users = await prisma.user.findMany();
  console.log(users);
  return <div>{JSON.stringify(users)}</div>;
}
