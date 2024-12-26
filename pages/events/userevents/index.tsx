import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { EventType } from "../../../types/game.types";
import { GetEvents } from "@/utils/fetches";
import { GetUserContext } from "@/components/Context";
import Spinner from "@/components/Spinner/Spinner";
import Events from "@/components/Events/Events";

const UserEvents = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [fetchError, setFetchError] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isShowPastEvents, setShowPastEvents] = useState(false);
  const [isShowCanceledEvents, setShowCanceledEvents] = useState(false);
  const userContext = GetUserContext();
  useEffect(() => {
    if (typeof window !== "undefined") {
      // const queryParameters = new URLSearchParams(window.location.search);
      let firstDate;
      if (isShowPastEvents) {
        firstDate = undefined;
      } else {
        firstDate = new Date();
      }

      if (!showLoginModal) {
        GetEvents({
          gameTitle: "",
          dateTime: firstDate,
          hostId: userContext.userId,
          isCanceled: isShowCanceledEvents,
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
  }, [
    fetchError,
    userContext,
    showLoginModal,
    isShowPastEvents,
    isShowCanceledEvents,
  ]);

  return (
    <div className={styles.main}>
      <h1>Events</h1>
      <div className={styles.pastEvents}>
        <h3>Show past events?</h3>
        <input
          type="checkbox"
          checked={isShowPastEvents}
          onChange={() => setShowPastEvents(!isShowPastEvents)}
        />
        <h3>Show canceled events?</h3>
        <input
          type="checkbox"
          checked={isShowCanceledEvents}
          onChange={() => setShowCanceledEvents(!isShowCanceledEvents)}
        />
      </div>
      {events ? <Events events={events} /> : <Spinner />}
    </div>
  );
};

export default UserEvents;
