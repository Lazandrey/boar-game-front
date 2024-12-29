import React, { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import styles from "./styles.module.css";

import GamesSearchOverlay from "@/components/GameSearchOverlay/GameSearchOverlay";

import { EventType, GameType } from "@/types/game.types";
import router from "next/router";
import { GetUserContext } from "@/components/Context";
import { SaveEvent } from "@/utils/fetches";

const AddEvent = () => {
  const [isGamesSearchOverlayOpen, setGamesSearchOverlayOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [playersQty, setPlayersQty] = useState(0);
  const [gamePrice, setGamePrice] = useState(0);
  const [gameAddressCountry, setGameAddressCountry] = useState("Lietuva");
  const [gameAddressCity, setGameAddressCity] = useState("");
  const [gameAddressStreet, setGameAddressStreet] = useState("");
  const [gameDate, setGameDate] = useState(new Date().toISOString());
  const [gameDescription, setGameDescription] = useState("");
  const [isHostWillPlay, setHostWillPlay] = useState(false);
  const [isConfirmed, setConfirmed] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [fetchError, setFetchError] = useState<number | null>(null);
  const [descriptionError, setDescriptionError] = useState("");

  const userContext = GetUserContext();
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const today = now.toISOString().slice(0, 16);

  const onCancel = () => {
    router.back();
  };
  const playersQtySelector = (minPlayers: number, maxPlayers: number) => {
    return (
      <select
        className={styles.playerQtySelect}
        value={playersQty}
        onChange={(e) => setPlayersQty(Number(e.target.value))}
      >
        {[...Array(maxPlayers - minPlayers + 1)].map((_, index) => (
          <option key={index} value={minPlayers + index}>
            {minPlayers + index}
          </option>
        ))}
      </select>
    );
  };

  useEffect(() => {
    setGameDate(today);
  }, []);

  useEffect(() => {
    if (selectedGame) {
      setPlayersQty(selectedGame.maxPlayers as number);
    }
  }, [selectedGame]);

  useEffect(() => {
    if (isConfirmed) {
      if (!gameAddressStreet) {
        setAddressError("Street is required");
        setConfirmed(false);
        return;
      } else setAddressError("");

      if (!gameAddressCity) {
        setAddressError("City is required");
        setConfirmed(false);
        return;
      } else setAddressError("");

      if (!gameAddressCountry) {
        setAddressError("Country is required");
        setConfirmed(false);
        return;
      } else setAddressError("");
      if (gameDescription == "") {
        setDescriptionError("Description is required");
        setConfirmed(false);
        return;
      } else setDescriptionError("");

      const newEvrent: EventType = {
        id: uuidv4(),
        host: { name: userContext?.name ?? "", id: userContext?.userId ?? "" },
        game: selectedGame as GameType,
        number_persons: playersQty,
        date_time: new Date(gameDate),
        description: gameDescription,
        price: gamePrice,
        accepted_persons_ids: [],
        isCanceled: false,
        address: {
          street: gameAddressStreet,
          city: gameAddressCity,
          country: gameAddressCountry,
        },
        geolocation: {
          address: "",
          location: { longitude: 0, latitude: 0 },
        },
      };
      if (isHostWillPlay) {
        newEvrent.accepted_persons_ids.push({
          user: {
            name: userContext?.name ?? "",
            id: userContext?.userId ?? "",
          },
          user_id: userContext?.userId ?? "",
          addedAt: new Date(),
        });
      }
      // console.log(newEvrent);
      SaveEvent({ event: newEvrent, setFetchError });

      if (fetchError) {
        if (fetchError === 401) {
          // setShowLoginModal(true);
          setFetchError(null);
          userContext.SetUserContext(false);
        } else {
          console.error(fetchError);
        }
        setConfirmed(false);
      }

      window.location.href = "/events/userevents";
    }
  }, [isConfirmed]);

  return (
    <div className={styles.main}>
      <h1>Add Event</h1>
      <button onClick={() => setGamesSearchOverlayOpen(true)}>
        Select game from list
      </button>
      {selectedGame && (
        <div className={styles.gameWrapper}>
          <h2>Selected game: {selectedGame?.title}</h2>
          <h3>
            Play time, min: {selectedGame?.minPlayTime}-
            {selectedGame?.maxPlayTime}
          </h3>
          <h3>
            Players qty:{" "}
            {playersQtySelector(
              selectedGame?.minPlayers as number,
              selectedGame?.maxPlayers as number
            )}
          </h3>
          <h3>
            Price for 1 person, €:{" "}
            <input
              className={styles.priceInput}
              type="number"
              placeholder="Price for 1 person"
              value={gamePrice}
              onChange={(e) => setGamePrice(Number(e.target.value))}
            />
          </h3>
          {descriptionError && (
            <h2 className={styles.error}>{descriptionError}</h2>
          )}
          <textarea
            className={styles.gameDescriptionInput}
            name="gameDescription"
            placeholder="Description"
            value={gameDescription}
            onChange={(e) => setGameDescription(e.target.value)}
          />
          <h3>
            Date and time:
            <input
              className={styles.dateTimeInput}
              type="datetime-local"
              placeholder="Date and time"
              min={gameDate}
              value={gameDate}
              onChange={(e) => setGameDate(e.target.value)}
            />
          </h3>

          <div className={styles.addressInputWrapper}>
            <h3>Address:</h3>
            {addressError && <h2 className={styles.error}>{addressError}</h2>}
            <input
              type="text"
              placeholder="Street and house number"
              value={gameAddressStreet}
              onChange={(e) => setGameAddressStreet(e.target.value)}
            />
            <input
              type="text"
              placeholder="City"
              value={gameAddressCity}
              onChange={(e) => setGameAddressCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Country"
              required={true}
              value={gameAddressCountry}
              onChange={(e) => setGameAddressCountry(e.target.value)}
            />
          </div>

          <div className={styles.hostWillPlayWrapper}>
            <h3>Will You also play?</h3>
            <input
              type="radio"
              name="play"
              value="yes"
              onChange={() => setHostWillPlay(true)}
              checked={isHostWillPlay}
            />
            <label htmlFor="yes">Yes</label>
            <input
              type="radio"
              name="play"
              value="no"
              onChange={() => setHostWillPlay(false)}
              checked={!isHostWillPlay}
            />
            <label htmlFor="no">No</label>
          </div>
          <div className={styles.bottomBtnWrapper}>
            <button
              className={styles.addEventButton}
              onClick={() => setConfirmed(true)}
            >
              Add event
            </button>
            <button className={styles.cancelBtn} onClick={() => onCancel()}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {isGamesSearchOverlayOpen && (
        <GamesSearchOverlay
          setIsOpen={setGamesSearchOverlayOpen}
          setSelectedGame={setSelectedGame}
        />
      )}
    </div>
  );
};

export default AddEvent;
