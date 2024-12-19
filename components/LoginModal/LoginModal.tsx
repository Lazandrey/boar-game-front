import React, { useState } from "react";

import styles from "./styles.module.css";
import { GetUserContext } from "../Context";
import { UserLogin } from "@/utils/fetches";

export type ModalProps = {
  text: string;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
};
const LoginModal = ({ text, isOpen, setIsOpen }: ModalProps) => {
  const onClose = () => {
    setIsOpen(false);
  };

  const userContext = GetUserContext();

  const OnLogin = async () => {
    try {
      const User = await UserLogin({ email, password });
      console.log(User);

      if (User.responseStatus === 200) {
        userContext.SetUserContext(true, User.username, email);

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
        <h3>Login</h3>
        <p>{text}</p>
        <p>isOpen: {isOpen.toString()}</p>
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
