import React from "react";
import styles from "./styles.module.css";
import { GameType } from "../../types/game.types";
import GameCard from "../GameCard/GameCard";

type CardProps = {
  games: GameType[];
};

const GameCards = ({ games }: CardProps) => {
  return (
    <div className={styles.main}>
      {games.map((g) => (
        <GameCard key={g.id} game={g} />
      ))}
    </div>
  );
};

export default GameCards;
