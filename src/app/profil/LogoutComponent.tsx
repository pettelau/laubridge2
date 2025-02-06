"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

const LogoutComponent = () => {
  return (
    <LogoutLink className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm">
      Logg ut
    </LogoutLink>
  );
};

export { LogoutComponent };
