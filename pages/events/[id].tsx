import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { GetUserContext } from "@/components/Context";
import { EventType } from "@/types/game.types";
import LoginModal from "@/components/LoginModal/LoginModal";
import { GetEventById } from "@/utils/fetches";
import Spinner from "@/components/Spinner/Spinner";

const Event = () => {
  const router = useRouter();
  const { id } = router.query;
  const userContext = GetUserContext();
  const [event, setEvent] = useState<EventType | null>(null);
  const [fetchError, setFetchError] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      if (!showLoginModal) {
        GetEventById({ id: id as string, setEvent, setFetchError });
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

  const date = new Date(event?.date_time as Date);

  return (
    <>
      {showLoginModal && (
        <LoginModal
          text={"Please login"}
          isOpen={showLoginModal}
          setIsOpen={setShowLoginModal}
        />
      )}
      {event ? (
        <div className={styles.eventWrapper}>
          <h1>Event</h1>
          <h3>{event.game.title}</h3>
          <div className={styles.imageWrapper}>
            <Image
              src={event.game.gameImageUrl}
              alt={event.game.title}
              fill={true}
              priority={true}
            />
          </div>
          <h3>Number of players :{event.number_persons}</h3>
          <h3>Host :{event.host.name}</h3>
          <h3>Location :{event.address.city}</h3>
          <h3>Date :{date.toLocaleDateString("lt-LT")}</h3>
          <h3>Time :{date.toLocaleTimeString("lt-LT")}</h3>
          <h3>Description :{event.description}</h3>
          <h3>Price :{event.price}</h3>
          <h3>Accepted players : {event.accepted_persons_ids.length}</h3>
          <div className={styles.playersList}>
            <div className={styles.playersListLine}>
              <h3>User name</h3>
              <h3>Registered at</h3>
            </div>
            {event.accepted_persons_ids.map((p) => (
              <div className={styles.playersListLine} key={p.user_id}>
                <h3>{p.user.name}</h3>
                <h3>{new Date(p.addedAt).toLocaleString("lt-LT")}</h3>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
      ;
    </>
  );
};

export default Event;
