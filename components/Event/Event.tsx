import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useGeolocation from "react-hook-geolocation";
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
  const geolocation = useGeolocation();

  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const degToRad = (deg: number) => deg * (Math.PI / 180);
    const R = 6371; // Radius of the earth in km
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) *
        Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

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
  }, [event]);
  return (
    <Link href={`/events/${event.id}`} style={{ textDecoration: "none" }}>
      <div className={styles.main}>
        <div className={styles.host}>
          {isHost && <p>Host</p>}
          {isPlayer && <p>Player</p>}
        </div>
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
        <h3>Number of players: {event.number_persons}</h3>
        <h3>Host: {event.host.name}</h3>
        <h3>Address: {event.address.street}</h3>
        <h3>City: {event.address.city}</h3>
        <h3>Country: {event.address.country}</h3>
        <h3>
          Distance:{" "}
          {getDistance(
            geolocation.latitude,
            geolocation.longitude,
            event.geolocation.location.latitude,
            event.geolocation.location.longitude
          ).toFixed(2)}{" "}
          km
        </h3>
        <h3>Date: {date.toLocaleDateString("lt-LT")}</h3>
        <h3>Time: {date.toLocaleTimeString("lt-LT")}</h3>
        <h3>Description: {event.description}</h3>
        <h3>Price: {event.price}</h3>
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
