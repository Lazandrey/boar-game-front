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

    SetUserContext: (
      isLoggedIn: boolean,
      name?: string,
      email?: string,
      userId?: string
    ) =>
      setCurrentUser({
        isLoggedIn,
        name,
        email,
        userId,

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

        SetUserContext: currentUser.SetUserContext,
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  );
}
