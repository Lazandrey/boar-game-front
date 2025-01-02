import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserContext, UserContextType } from "@/components/Context";
import { useState } from "react";

import Layout from "@/components/Layout/Layout";

export default function App({ Component, pageProps }: AppProps) {
  const [currentUser, setCurrentUser] = useState<UserContextType>({
    isLoggedIn: false,
    name: "",
    email: "",
    userId: "",
    location: { lat: 0, lng: 0 },

    SetUserContext: (
      isLoggedIn?: boolean,
      name?: string,
      email?: string,
      userId?: string,
      lat?: number,
      lng?: number
    ) =>
      setCurrentUser({
        isLoggedIn,
        name,
        email,
        userId,
        location: { lat: lat!, lng: lng! },

        SetUserContext: currentUser.SetUserContext,
      }),
  });
  // const [currentUser, setCurrentUser] = useState<UserContextType>();

  return (
    <UserContext.Provider
      value={{
        isLoggedIn: currentUser.isLoggedIn,
        name: currentUser.name,
        email: currentUser.email,
        userId: currentUser.userId,
        location: currentUser.location,
        SetUserContext: currentUser.SetUserContext,
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  );
}
