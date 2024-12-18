import React from "react";

import styles from "./styles.module.css";
import { GetUserContext } from "@/components/Context";

const Main = () => {
  const userContext = GetUserContext();

  return (
    <div className={styles.main}>
      <h1>Welcome to games</h1>
      {!userContext.isLoggedIn ? (
        <h2>Please login</h2>
      ) : (
        <h2>User name : {userContext.name}</h2>
      )}
    </div>
  );
};

export default Main;
