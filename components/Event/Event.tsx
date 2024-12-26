import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css";
import { EventType } from "../../types/game.types";
import { useRouter } from "next/router";
import { GetUserContext } from "../Context";

const Event = (event: EventType) => {
  const date = new Date(event.date_time);
  const router = useRouter();
  const [isHost, setHost] = useState(false);
  const [isPlayer, setPlayer] = useState(false);

  const userContext = GetUserContext();

  useEffect(() => {
    if (event && userContext.userId) {
      if (event.host.id === userContext.userId) {
        setHost(true);
      }

      if (
        event.accepted_persons_ids.some((p) => p.user.id === userContext.userId)
      ) {
        setPlayer(true);
      }
    }

    console.log("host", isHost, "player", isPlayer);
  }, [event]);
  return (
    <Link href={`/events/${event.id}`} style={{ textDecoration: "none" }}>
      <div className={styles.main}>
        <div
          className={styles.gameWrapper}
          onClick={(e) => {
            router.push(`/games/${event.game.id}`);
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <h2>Game :{event.game.title}</h2>
          <div className={styles.imageWrapper}>
            <Image
              src={event.game.gameImageUrl}
              alt={event.game.title}
              fill={true}
              sizes="50vw"
              priority={true}
            />
          </div>
        </div>
        <h3>Number of players :{event.number_persons}</h3>
        <h3>Host :{event.host.name}</h3>
        <h3>Location :{event.address.city}</h3>
        <h3>Date :{date.toLocaleDateString("lt-LT")}</h3>
        <h3>Time :{date.toLocaleTimeString("lt-LT")}</h3>
        <h3>Description :{event.description}</h3>
        <h3>Price :{event.price}</h3>
        <h3
          className={`${
            event.number_persons - event.accepted_persons_ids.length <= 0 &&
            styles.fullPlayerList
          }`}
        >
          Accepted players : {event.accepted_persons_ids.length}
        </h3>
      </div>
    </Link>
  );
};

export default Event;
