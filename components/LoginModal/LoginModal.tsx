import React, { useState } from "react";

import styles from "./styles.module.css";
import { GetUserContext } from "../Context";
import { UserLogin } from "@/utils/fetches";
import Link from "next/link";

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
};
const LoginModal = ({ isOpen, setIsOpen }: ModalProps) => {
  const onClose = () => {
    setIsOpen(false);
  };

  const userContext = GetUserContext();

  const OnLogin = async () => {
    try {
      const User = await UserLogin({ email, password });

      if (User.responseStatus === 200) {
        userContext.SetUserContext(
          true,
          User.username,
          User.email,
          User.userId
        );

        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    isOpen && (
      <dialog className={styles.wrapper}>
        <h3>Please Login</h3>
        <h4>
          Do not have an account?{"  "}
          <Link
            href="/register"
            className={styles.registerLink}
            onClick={onClose}
          >
            Register here
          </Link>{" "}
        </h4>

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
        <div className={styles.buttonsWrapper}>
          <button onClick={OnLogin}>Login</button>
          <button autoFocus onClick={onClose}>
            Cancel
          </button>
        </div>
      </dialog>
    )
  );
};
export default LoginModal;
