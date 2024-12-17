import React from "react";

import styles from "./styles.module.css";
import { GetUserContext } from "@/components/Context";

const Main = () => {
  const user = GetUserContext();

  return (
    <div className={styles.main}>
      <h1>Welcome to games</h1>
      {!user.isLoggedIn ? (
        <h2>Please login</h2>
      ) : (
        <h2>User name : {user.name}</h2>
      )}
    </div>
  );
};

export default Main;
