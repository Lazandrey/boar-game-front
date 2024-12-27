import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { GetUserContext } from "@/components/Context";
import { EventType } from "@/types/game.types";
import LoginModal from "@/components/LoginModal/LoginModal";
import {
  CancelRegistrationToEvent,
  GetEventById,
  RegisterToEvent,
} from "@/utils/fetches";
import Spinner from "@/components/Spinner/Spinner";
import BackButton from "@/components/BackButton/BackButton";

const Event = () => {
  const router = useRouter();
  const { id } = router.query;
  const userContext = GetUserContext();
  const [event, setEvent] = useState<EventType | null>(null);
  const [fetchError, setFetchError] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState("");
  const [addUser, setAddUser] = useState<boolean | null>(null);
  const [isShowAddUserButton, setIsShowAddUserButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowEditButton, setIsShowEditButton] = useState(false);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      if (addUser) {
        RegisterToEvent({
          eventId: id as string,
          setFetchError,
          setIsRegistered,
          setIsShowAddUserButton,
        });
      } else if (!isLoading) {
        console.log("CancelRegistrationToEvent", id, isRegistered);
        CancelRegistrationToEvent({
          eventId: id as string,
          setFetchError,
          setIsRegistered,
          setIsShowAddUserButton,
        });
      }
      if (fetchError) {
        if (fetchError === 401) {
          setShowLoginModal(true);
          setFetchError(null);
          userContext.SetUserContext(false);
        }
      }
      setIsLoading(false);
    }
  }, [addUser]);

  // useEffect(() => {
  //   if (
  //     id !== undefined &&
  //     id !== null &&
  //     isRegistered === "" &&
  //     userContext.isLoggedIn &&
  //     event
  //   ) {
  //     if (
  //       userContext.userId &&
  //       event.accepted_persons_ids.some((p) => p.user.id === userContext.userId)
  //     ) {
  //       console.log("userContext.userId", userContext.userId);
  //       setIsRegistered(userContext.userId);
  //     }
  //   }

  //   if (fetchError) {
  //     if (fetchError === 400) {
  //       setIsRegistered("");
  //     }
  //     if (fetchError === 401) {
  //       setShowLoginModal(true);
  //       setFetchError(null);
  //       console.log("fetch null 1");
  //       userContext.SetUserContext(false);
  //     }
  //   }
  //   if (!userContext.isLoggedIn) {
  //     setIsShowAddUserButton(true);
  //   }
  // }, [id, fetchError, isRegistered, userContext]);

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
  }, [id, showLoginModal, fetchError, userContext, isRegistered]);

  useEffect(() => {
    if (event) {
      console.log("event", event);
      if (event.isCanceled) {
        router.push("/events/userevents");
      }
      setIsLoading(false);
      if (
        event.accepted_persons_ids.length === event.number_persons &&
        event.isCanceled === false &&
        event.date_time > new Date()
      ) {
        setIsShowAddUserButton(false);
        console.log("isShowAddUserButton", isShowAddUserButton);
      }

      if (
        event.host.id === userContext.userId &&
        event.isCanceled === false &&
        new Date(event.date_time) > new Date()
      ) {
        setIsShowEditButton(true);
      }
      console.log(userContext.userId);
      console.log(
        event.accepted_persons_ids.some((p) => p.user.id === userContext.userId)
      );
      if (
        userContext.userId &&
        event.accepted_persons_ids.some((p) => p.user.id === userContext.userId)
      ) {
        console.log("userContext.userId", userContext.userId);
        setIsRegistered(userContext.userId);
      } else {
        setIsRegistered("");
        setIsShowAddUserButton(true);
      }
    }
  }, [event]);

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
          {isShowEditButton && (
            <button
              className={styles.editBtn}
              onClick={() => router.push(`/events/edit/${event.id}`)}
            >
              Edit event
            </button>
          )}
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
          {isShowAddUserButton && (
            <button
              className={styles.registerBtn}
              onClick={() => setAddUser(true)}
            >
              Want to play?
            </button>
          )}
          <div className={styles.playersList}>
            <div className={styles.playersListLine}>
              <h3 className={styles.playersListLineElement}>User name</h3>
              <h3 className={styles.playersListLineElement}>Registered at</h3>
              <h3 className={styles.playersListLineElement}>Action</h3>
            </div>
            {event.accepted_persons_ids.map((p) => (
              <div className={styles.playersListLine} key={p.user.id}>
                <h3 className={styles.playersListLineElement}>{p.user.name}</h3>
                <h3 className={styles.playersListLineElement}>
                  {new Date(p.addedAt).toLocaleString("lt-LT")}
                </h3>

                {isRegistered === p.user.id &&
                event.isCanceled === false &&
                new Date(event.date_time) > new Date() ? (
                  <div className={styles.playersListLineElement}>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setAddUser(false)}
                    >
                      Cancel
                    </button>{" "}
                  </div>
                ) : (
                  <h3 className={styles.playersListLineElement}></h3>
                )}
              </div>
            ))}
          </div>
          <BackButton />
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Event;
