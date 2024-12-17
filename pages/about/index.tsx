import React from "react";
import styles from "./styles.module.css";

import LoginModal from "@/components/LoginModal/LoginModal";
const About = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = () => {
    setIsOpen(true);
  };
  return (
    <div className={styles.main}>
      <h1>About</h1>
      <h3>{isOpen.toString()}</h3>
      <button onClick={() => openModal()}>Open Modal</button>
      {isOpen && (
        <LoginModal text={"Some text"} isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
};

export default About;
