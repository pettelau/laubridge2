import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BondeUserWithUser } from "types/types";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

export const ClubMemberCard = ({ user }: { user: BondeUserWithUser }) => {
  const isVerified = !!user.user;

  return (
    <Card className="relative inline-flex items-center p-2 min-w-[200px] sm:w-auto w-full h-14">
      <div className="flex items-center gap-2 flex-1">
        {isVerified && user.user?.picture && (
          <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={user.user.picture}
              alt={`${user.user.firstName}'s profile`}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div>
          <CardTitle className="text-sm font-medium">{user.nickname}</CardTitle>
          {isVerified && (
            <p className="text-xs text-muted-foreground">
              {user.user?.firstName} {user.user?.lastName}
            </p>
          )}
        </div>
      </div>
      {isVerified && (
        <CheckCircle className="h-4 w-4 text-blue-500 ml-2 flex-shrink-0" />
      )}
    </Card>
  );
};
