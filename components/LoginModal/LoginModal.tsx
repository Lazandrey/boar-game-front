import React, { useState } from "react";
import axios from "axios";
import cookie from "js-cookie";
import styles from "./styles.module.css";
import { GetUserContext } from "../Context";

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
      const response = await axios.post("http://localhost:3002/user/login", {
        email,
        password,
      });
      console.log(response);
      if (response.status === 200) {
        cookie.set("authToken", response.data.token);
        userContext.SetUserContext(true, response.data.userName, email);

        console.log(response.data.userName);
        setIsOpen(false);
        console.log("close");
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
