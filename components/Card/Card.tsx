import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css";
import { GameType } from "../../types/game.types";

const Card = (game: GameType) => {
  return (
    <Link href={`/games/${game.id}`} style={{ textDecoration: "none" }}>
      <div className={styles.main}>
        <h2>{game.title}</h2>
        <div className={styles.imageWrapper}>
          <Image
            src={game.gameImageUrl}
            alt={game.title}
            fill={true}
            sizes="50vw"
            priority={true}
          />
        </div>
        <div className={styles.gameInfo}>
          <p>Difficulty: {game.weight}</p>
          <p>Rating: {game.rating}</p>
          <p>Rated qty: {game.usersrated}</p>
          <p>
            Players: {game.minPlayers} - {game.maxPlayers}
          </p>
          <p>
            Time: {game.minPlayTime} - {game.maxPlayTime}
          </p>
          <p>Age: {game.age}</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;