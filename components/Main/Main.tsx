import React, { useEffect, useState } from "react";

import styles from "./styles.module.css";
import { GetUserContext } from "@/components/Context";
import { EventType } from "@/types/game.types";
import { GetEvents } from "@/utils/fetches";
import useGeolocation from "react-hook-geolocation";
import Events from "../Events/Events";
import Spinner from "../Spinner/Spinner";

const Main = () => {
  const userContext = GetUserContext();
  const geolocation = useGeolocation();

  const [events, setEvents] = useState<EventType[] | null>(null);
  const [fetchError, setFetchError] = useState<number | null>(null);
  const [eventDistancesKm, setEventDistancesKm] = useState<number>(20);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!userContext.location.lat) {
      if (geolocation) {
        userContext.SetUserContext(
          userContext.isLoggedIn,
          userContext.name,
          userContext.email,
          userContext.userId,
          geolocation.latitude,
          geolocation.longitude
        );
      }
    }
    if (typeof window !== "undefined" && userContext.location.lat) {
      GetEvents({
        gameTitle: "",
        dateTime: new Date(),
        isCanceled: false,
        setEvents,
        setFetchError,
        userGeolocation: {
          longitude: userContext.location.lng,
          latitude: userContext.location.lat,
        },
        distance: eventDistancesKm,
      });
      if (fetchError) {
        if (fetchError === 401) {
          setShowLoginModal(true);
          setFetchError(null);
          userContext.SetUserContext(false);
        }
      }
    }
  }, [eventDistancesKm, fetchError, geolocation, showLoginModal]);

  return (
    <div className={styles.main}>
      <div className={styles.eventsWrapper}>
        <h1>
          Incoming events in{" "}
          <input
            className={styles.distanceInput}
            type="number"
            value={eventDistancesKm.toFixed(0)}
            onChange={(e) => setEventDistancesKm(Number(e.target.value))}
          />{" "}
          km
        </h1>
        {events ? <Events events={events} /> : <Spinner />}
      </div>
    </div>
  );
};

export default Main;
