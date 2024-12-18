import React, { useState } from "react";

import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { GetUserContext } from "@/components/Context";
import { UserLogin } from "@/utils/login";

const LoginForm = () => {
  const router = useRouter();
  const userContext = GetUserContext();

  const OnLogin = async () => {
    try {
      const User = await UserLogin({ email, password });
      console.log(User);

      if (User.responseStatus === 200) {
        userContext.SetUserContext(true, User.username, email);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.main}>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={OnLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
