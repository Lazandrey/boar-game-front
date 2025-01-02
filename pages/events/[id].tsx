import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { GetUserContext } from "@/components/Context";
import useGeolocation from "react-hook-geolocation";
import { EventType } from "@/types/game.types";
import LoginModal from "@/components/LoginModal/LoginModal";
import {
  CancelRegistrationToEvent,
  GetEventById,
  RegisterToEvent,
} from "@/utils/fetches";
import Spinner from "@/components/Spinner/Spinner";
import BackButton from "@/components/BackButton/BackButton";
import Link from "next/link";

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
    if (event) {
      if (event.isCanceled) {
        router.push("/events/userevents");
      }
      setIsLoading(false);
      if (
        event.accepted_persons_ids.length === event.number_persons ||
        event.isCanceled === true ||
        event.date_time < new Date()
      ) {
        setIsShowAddUserButton(false);

        return;
      }

      if (
        event.host.id === userContext.userId &&
        event.isCanceled === false &&
        new Date(event.date_time) > new Date()
      ) {
        setIsShowEditButton(true);
        return;
      }

      if (
        userContext.userId &&
        event.accepted_persons_ids.some((p) => p.user.id === userContext.userId)
      ) {
        setIsRegistered(userContext.userId);
      } else {
        setIsRegistered("");

        setIsShowAddUserButton(true);
        return;
      }
    }
  }, [event]);

  const date = new Date(event?.date_time as Date);

  return (
    <>
      {showLoginModal && (
        <LoginModal isOpen={showLoginModal} setIsOpen={setShowLoginModal} />
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
          <h3>Address: {event.address.street}</h3>
          <h3>City: {event.address.city}</h3>
          <h3>Country: {event.address.country}</h3>
          <h3>
            Distance:{" "}
            {getDistance(
              userContext.location.lat,
              userContext.location.lng,
              event.geolocation.coordinates[1],
              event.geolocation.coordinates[0]
            ).toFixed(2)}{" "}
            km
          </h3>
          <Link
            className={styles.googleMapsLink}
            href={`https://www.google.com/maps/dir/${userContext.location.lat},${userContext.location.lng}/${event.geolocation.coordinates[1]},${event.geolocation.coordinates[0]}`}
            target="_blank"
          >
            Plan your route on Google Maps
          </Link>
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
