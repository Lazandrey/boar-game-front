import React, { use, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { GetUserContext } from "@/components/Context";
import { EventType } from "@/types/game.types";
import LoginModal from "@/components/LoginModal/LoginModal";
import {
  CancelRegistrationToEvent,
  GetEventById,
  isUserRegisteredtoEvent,
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
  const [fetchResponce, setFetchResponce] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState("");
  const [addUser, setAddUser] = useState<boolean | null>(null);
  const [isShowAddUserButton, setIsShowAddUserButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id !== undefined && id !== null) {
      if (addUser) {
        RegisterToEvent({
          eventId: id as string,
          setFetchResponce,
          setFetchError,
          setIsRegistered,
          setIsShowAddUserButton,
        });
      } else if (!isLoading) {
        console.log("CancelRegistrationToEvent", id, isRegistered);
        CancelRegistrationToEvent({
          eventId: id as string,
          setFetchResponce,
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

  useEffect(() => {
    if (
      id !== undefined &&
      id !== null &&
      isRegistered === "" &&
      userContext.isLoggedIn
    ) {
      // console.log("isUserRegisteredtoEvent", id, isRegistered, userContext);
      isUserRegisteredtoEvent({
        eventId: id as string,
        setIsRegistered,
        setFetchError,
        setIsShowAddUserButton,
      });
    }

    if (fetchError) {
      if (fetchError === 400) {
        setIsRegistered("");
      }
      if (fetchError === 401) {
        setShowLoginModal(true);
        setFetchError(null);
        console.log("fetch null 1");
        userContext.SetUserContext(false);
      }
    }
  }, [id, fetchError, isRegistered, userContext]);

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
      setIsLoading(false);
      if (event.accepted_persons_ids.length === event.number_persons) {
        setIsShowAddUserButton(false);
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
              <div className={styles.playersListLine} key={p.user._id}>
                <h3 className={styles.playersListLineElement}>{p.user.name}</h3>
                <h3 className={styles.playersListLineElement}>
                  {new Date(p.addedAt).toLocaleString("lt-LT")}
                </h3>
                {isRegistered === p.user._id ? (
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
      ;
    </>
  );
};

export default Event;
