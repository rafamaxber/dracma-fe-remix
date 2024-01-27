import React, { useContext } from "react";
import { UserDataType } from "~/data/auth/user-auth-cookie";

const UserDataContext = React.createContext<UserDataType | null>(null);

export function useUserData() {
  const context = useContext(UserDataContext);

  if (!context) {
    throw new Error('useUserData must be used within an UserDataProvider');
  }

  return context;
}

export function UserDataProvider({ children, userData }: { children: React.ReactNode, userData: UserDataType }) {
  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  );
}
