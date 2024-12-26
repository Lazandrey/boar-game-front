import React from "react";

export type UserContextType = {
  isLoggedIn: boolean;
  name?: string;
  email?: string;
  userId?: string;

  SetUserContext: (
    isLoggedIn: boolean,
    name?: string,
    email?: string,
    userId?: string
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
