import React, { useState } from "react";
import axios from "axios";
import cookie from "js-cookie";

import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { GetUserContext } from "@/components/Context";

const LoginForm = () => {
  const router = useRouter();
  const userContext = GetUserContext();
  const OnLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3002/user/login", {
        email,
        password,
      });
      if (response.status === 200) {
        cookie.set("authToken", response.data.token);
        userContext.SetUserContext(true, response.data.userName, email);
        router.push("/");
      }
      console.log(response.data.userName);
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
