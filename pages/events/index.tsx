import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { EventType } from "../../types/game.types";
import { GetEvents } from "@/utils/fetches";
import { GetUserContext } from "@/components/Context";
import Spinner from "@/components/Spinner/Spinner";
import Events from "@/components/Events/Events";

const Main = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [fetchError, setFetchError] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const userContext = GetUserContext();
  useEffect(() => {
    if (typeof window !== "undefined") {
      // const queryParameters = new URLSearchParams(window.location.search);

      if (!showLoginModal) {
        GetEvents({
          gameTitle: "",
          dateTime: new Date(),
          isCanceled: false,
          setEvents,
          setFetchError,
        });
      }
    }

    if (fetchError) {
      if (fetchError === 401) {
        setShowLoginModal(true);
        setFetchError(null);
        userContext.SetUserContext(false);
      }
    }
  }, [fetchError, userContext, showLoginModal]);

  return (
    <div className={styles.main}>
      <h1>Events</h1>
      {events ? <Events events={events} /> : <Spinner />}
    </div>
  );
};

export default Main;
