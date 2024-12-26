import React from "react";
import styles from "./styles.module.css";
import { GameType } from "../../types/game.types";
import GameCard from "../GameCard/GameCard";

type CardProps = {
  games: GameType[];
  setSelectedGame: (game: GameType | null) => void;
  setIsOpen: (isOpen: boolean) => void;
};

const OverlayGameCards = ({ games, setSelectedGame, setIsOpen }: CardProps) => {
  return (
    <div className={styles.main}>
      {games.map((g) => (
        <div
          onClick={() => {
            setSelectedGame(g);
            setIsOpen(false);
          }}
          key={g.id}
        >
          <GameCard game={g} isOverlay={true} />
        </div>
      ))}
    </div>
  );
};

export default OverlayGameCards;
