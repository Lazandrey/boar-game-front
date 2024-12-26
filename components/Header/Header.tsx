import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";
import { GetUserContext } from "@/components/Context";
import burgerBtn from "../../assets/img/burgerBtn.svg";
import cookie from "js-cookie";
import LoginModal from "../LoginModal/LoginModal";

const Header = () => {
  const userContext = GetUserContext();
  const [isBurgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const token = cookie.get("authToken");
    if (token) {
      userContext.SetUserContext(
        true,
        cookie.get("userName")!,
        cookie.get("userEmail")!,
        cookie.get("userId")!
      );
    }
  }, []);

  const logout = () => {
    cookie.remove("authToken");
    cookie.remove("userName");
    cookie.remove("userEmail");
    cookie.remove("userId");

    userContext.SetUserContext(false, "", "");
  };

  const navMenu = (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/events">Events</Link>
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
  );

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.desktopNav}>{navMenu}</nav>
        <button
          className={styles.burgerBtn}
          onClick={() => setBurgerMenuOpen(!isBurgerMenuOpen)}
        >
          <Image src={burgerBtn.src} alt="Burger button" fill={true} />
        </button>
        <div
          className={`${styles.burgerMenuOverlay} ${
            isBurgerMenuOpen && styles.burgerMenuOverlayOpen
          }`}
          onClick={() => setBurgerMenuOpen(false)}
        >
          <nav className={styles.mobileNav}>{navMenu}</nav>
        </div>
        <div className={styles.user}>
          {userContext.isLoggedIn ? (
            <p onClick={() => setUserMenuOpen(!isUserMenuOpen)}>
              {userContext.name}
            </p>
          ) : (
            // <Link href="/login">Login </Link>
            <p onClick={() => setShowLoginModal(true)}>Login</p>
          )}
          <div
            className={`${styles.userMenuOverlay} ${
              isUserMenuOpen && styles.userMenuOverlayOpen
            }`}
            onClick={() => setUserMenuOpen(false)}
          >
            <ul>
              <li>
                <Link href="/events/userevents">Your events</Link>
              </li>
              <li>
                <Link href="/events/addevent">Add event</Link>
              </li>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <Link onClick={() => logout()} href="#">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
      {showLoginModal && (
        <LoginModal
          text={"Please login"}
          isOpen={showLoginModal}
          setIsOpen={setShowLoginModal}
        />
      )}
    </>
  );
};

export default Header;
