import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import styles from "./styles.module.css";

import { GameType } from "../../types/game.types";
import BackButton from "../../components/BackButton/BackButton";
import Spinner from "../../components/Spinner/Spinner";
import { GetGameById } from "@/utils/fetches";
import { GetUserContext } from "@/components/Context";
import LoginModal from "../../components/LoginModal/LoginModal";

const Game = () => {
  const router = useRouter();
  const userContext = GetUserContext();
  const { id } = router.query;
  const [game, setGame] = useState<GameType | null>(null);
  const [fetchError, setFetchError] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      if (!showLoginModal) {
        GetGameById({ id: id as string, setGame, setFetchError });
      }

      if (fetchError) {
        if (fetchError === 401) {
          setShowLoginModal(true);
          setFetchError(null);
          userContext.SetUserContext(false);
        }
      }
    }
  }, [id, showLoginModal, fetchError, userContext]);

  return (
    <>
      {showLoginModal && (
        <LoginModal isOpen={showLoginModal} setIsOpen={setShowLoginModal} />
      )}
      {game ? (
        <div className={styles.main}>
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
              <p>Description:</p>
              <p dangerouslySetInnerHTML={{ __html: game.description }}></p>
            </div>
            <BackButton />
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Game;
