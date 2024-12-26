import React from "react";
import styles from "./styles.module.css";

export type ModalProps = {
  text: string;
  isOpen: boolean;
  onCloseModal: () => void;
  onConfirm: () => void;
};
const Modal = ({ text, isOpen, onCloseModal, onConfirm }: ModalProps) => {
  return (
    <>
      {isOpen && (
        <dialog className={styles.wrapper}>
          <h3>{text}</h3>
          <div className={styles.buttonWrapper}>
            <button onClick={onConfirm}>Ok</button>
            <button onClick={onCloseModal}>Cancel</button>
          </div>
        </dialog>
      )}
    </>
  );
};

export default Modal;
