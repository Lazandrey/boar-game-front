import React, { forwardRef } from "react";
import styles from "./styles.module.css";

export type ModalProps = {
  text: string;
  setIsOpen: (state: boolean) => void;
};
const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  ({ text, setIsOpen }, ref) => {
    const onClose = () => {
      if (ref && "current" in ref && ref.current) {
        console.log(ref.current);
        setIsOpen(false);
        // ref.current.close();
      }
    };
    return (
      <dialog className={styles.wrapper} ref={ref}>
        <h3>Modal</h3>
        <p>{text}</p>

        <button autoFocus onClick={onClose}>
          Close
        </button>
      </dialog>
    );
  }
);
Modal.displayName = "Modal";
export default Modal;
