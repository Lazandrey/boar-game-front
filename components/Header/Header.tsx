import React from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import { GetUserContext } from "@/components/Context";

const Header = () => {
  const userContext = GetUserContext();

  return (
    <header className={styles.header}>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/games">Games</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.user}>
        {userContext.isLoggedIn ? (
          userContext.name
        ) : (
          <Link href="/login">Login </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
