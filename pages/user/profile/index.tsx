import React, { useEffect, useState } from "react";

import styles from "./styles.module.css";

import { GetUserContext } from "@/components/Context";
import { UserUpdate } from "@/utils/fetches";
import LoginModal from "@/components/LoginModal/LoginModal";

const RegisterForm = () => {
  const userContext = GetUserContext();

  const OnUpdate = async () => {
    try {
      if (userContext.isLoggedIn === false) {
        setShowLoginModal(true);
      }
      const user = await UserUpdate({
        id: userId,
        name: username,
        email,
        password,
        newPassword,
      });

      if (user.responseStatus === 200) {
        userContext.SetUserContext(
          true,
          user.username,
          user.email,
          user.userId
        );
        setSuccess(true);

        return;
      }
      if (user.responseStatus === 401) {
        setError("Invalid password");
        setUpdated(false);
        setSuccess(false);

        return;
      }

      setError(user.responseMessage as string);
      setUpdated(false);
      setSuccess(false);
    } catch (error) {
      console.error("error", error);
    }
  };
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (updated) {
      if (newPassword !== password2) {
        setError("Passwords don't match");
        setUpdated(false);
        return;
      } else setError("");

      OnUpdate();
      setUpdated(false);
    }
  }, [updated]);

  useEffect(() => {
    if (userContext.userId) {
      setUserId(userContext.userId);
    }
    if (userContext.name) {
      setUsername(userContext.name);
    }
    if (userContext.email) {
      setEmail(userContext.email);
    }
  }, [userContext]);

  return (
    <>
      {showLoginModal && (
        <LoginModal isOpen={showLoginModal} setIsOpen={setShowLoginModal} />
      )}
      <div className={styles.main}>
        <h1>User profile</h1>
        <h2>Please input current password for confirmation</h2>
        <div className={styles.form}>
          <label htmlFor="username">User name/Nickname:</label>
          <input
            type="text"
            placeholder="Username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder="Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="currentPassword">Current password:</label>
          <input
            type="password"
            placeholder="Password"
            id="currentPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="New password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Repeat new password"
            id="repeatPassword"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          {error && <h3 className={styles.errorMessage}>{error}</h3>}
          {success && <h3 className={styles.successMessage}>User updated</h3>}
        </div>
        <button onClick={() => setUpdated(true)}>Update user profile</button>
      </div>
    </>
  );
};

export default RegisterForm;
