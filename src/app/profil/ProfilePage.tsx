import { User, BondeUser } from "@prisma/client";
import Image from "next/image";
import { ProfileStats } from "./ProfileStats";
import { ConnectUserToBundeUser } from "./ConnectUserToBundeUser";
import { LogoutComponent } from "./LogoutComponent";
import { getAvailableBondeUsers } from "@/data-access/bondeUser";

interface ProfileClientProps {
  user: User & { bondeUser: BondeUser | null };
}

const ProfilePage = async ({ user }: ProfileClientProps) => {
  //   const [isEditing, setIsEditing] = useState(false);

  const bondeUsers = await getAvailableBondeUsers();

  return (
    <div className="py-8 w-full sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header section */}
          <div className="relative h-40 bg-gradient-to-r from-gray-700 to-gray-900">
            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                {user.picture ? (
                  <Image
                    src={user.picture}
                    alt="Profilbilde"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <svg
                      className="h-16 w-16"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile info */}
          <div className="pt-20 pb-8 px-8">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <LogoutComponent />
              </div>

              {/* Status/Thought Bubble */}
              <div className="bg-blue-50 p-4 rounded-lg relative">
                <div className="absolute -top-2 left-4 w-4 h-4 bg-blue-50 transform rotate-45"></div>
                <p className="text-gray-700 italic">
                  &quot;På jakt etter den neste store gevinsten! 🎲&quot;
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Oppdatert for 2 timer siden
                </p>
              </div>
            </div>

            {user.bondeUser ? (
              <ProfileStats />
            ) : (
              <div className="flex justify-center">
                <ConnectUserToBundeUser bondeUsers={bondeUsers} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfilePage };
