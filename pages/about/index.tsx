import React from "react";
import styles from "./styles.module.css";

import LoginModal from "@/components/LoginModal/LoginModal";
import { GetUserContext } from "@/components/Context";
const About = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const userContext = GetUserContext();
  const openModal = () => {
    setIsOpen(true);
  };
  return (
    <div className={styles.main}>
      <h1>About</h1>
      <h2>User name : {userContext.name}</h2>
      <h3>{isOpen.toString()}</h3>
      <button onClick={() => openModal()}>Open Modal</button>
      {isOpen && <LoginModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
};

export default About;
