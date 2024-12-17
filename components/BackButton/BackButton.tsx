import React from "react";
import styles from "./styles.module.css";
import router from "next/router";

const BackButton = () => {
  return (
    <button
      className={styles.button90}
      role="button"
      onClick={() => router.back()}
    >
      Back
    </button>
  );
};

export default BackButton;
