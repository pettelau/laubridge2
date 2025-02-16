"use client";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <KindeProvider>{children}</KindeProvider>
    </QueryClientProvider>
  );
};
