import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";

import styles from "./styles.module.css";

import { GameType } from "../../types/game.types";
import BackButton from "../../components/BackButton/BackButton";
import Spinner from "../../components/Spinner/Spinner";

const Game = () => {
  const router = useRouter();
  const { id } = router.query;
  const [game, setGame] = React.useState<GameType | null>(null);
  useEffect(() => {
    try {
      const GetGameById = async (id: string) => {
        const response = await axios.get(`http://localhost:3002/game/${id}`);

        setGame(response.data.game);
      };
      if (id !== undefined && id !== null) {
        GetGameById(id as string);
      }
    } catch (error) {
      console.error(error);
    }
  }, [id, game]);

  return (
    <>
      {game ? (
        <div className={styles.card}>
          <h1>{game?.title}</h1>
          <div className={styles.imageWrapper}>
            <Image
              src={game?.gameImageUrl}
              alt={game?.title}
              fill={true}
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
            <p>Description: {game.description}</p>
          </div>
          <BackButton />
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Game;
