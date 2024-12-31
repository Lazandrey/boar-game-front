import React, { useEffect, useState } from "react";

import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { GetUserContext } from "@/components/Context";
import { UserRegister } from "@/utils/fetches";

const RegisterForm = () => {
  const router = useRouter();
  const userContext = GetUserContext();

  const OnRegister = async () => {
    try {
      const user = await UserRegister({ name: username, email, password });
      console.log(user);
      if (user.responseStatus === 201) {
        userContext.SetUserContext(
          true,
          user.username,
          user.email,
          user.userId
        );
        router.back();
      } else if (user.responseMessage) {
        setError(user.responseMessage as string);
        setRegistered(false);
      }
    } catch (error) {
      console.error("error", error);
    }
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (registered) {
      if (password !== password2) {
        setError("Passwords don't match");
        setRegistered(false);
        return;
      } else setError("");

      OnRegister();
      setRegistered(false);
    }
  }, [registered]);

  return (
    <div className={styles.main}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
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
      <input
        type="password"
        placeholder="Repeat password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
      />
      {error && <h3 className={styles.errorMessage}>{error}</h3>}

      <button onClick={() => setRegistered(true)}>Register</button>
    </div>
  );
};

export default RegisterForm;
