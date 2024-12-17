import React from "react";
import styles from "./styles.module.css";
import { GameType } from "../../types/game.types";
import Card from "../Card/Card";

type CardProps = {
  games: GameType[];
};

const Cards = ({ games }: CardProps) => {
  return (
    <div className={styles.main}>
      {games.map((g) => (
        <Card key={g.id} {...g} />
      ))}
    </div>
  );
};

export default Cards;
