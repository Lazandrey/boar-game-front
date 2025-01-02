import React from "react";

export type UserContextType = {
  isLoggedIn?: boolean;
  name?: string;
  email?: string;
  userId?: string;
  location: { lat: number; lng: number };

  SetUserContext: (
    isLoggedIn?: boolean,
    name?: string,
    email?: string,
    userId?: string,
    lat?: number,
    lng?: number
  ) => void;
};

export const UserContext = React.createContext<UserContextType | null>(null);

export const GetUserContext = () => {
  const userContext = React.useContext(UserContext);
  if (!userContext) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return userContext;
};
