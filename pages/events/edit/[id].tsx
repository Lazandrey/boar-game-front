import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { GetUserContext } from "@/components/Context";
import { EventType } from "@/types/game.types";
import LoginModal from "@/components/LoginModal/LoginModal";
import { GetEventById, UpdateEventById } from "@/utils/fetches";
import Spinner from "@/components/Spinner/Spinner";
import Modal from "@/components/Modal/Modal";

const Event = () => {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState<EventType | null>(null);
  const [fetchError, setFetchError] = useState<number | null>(null);
  const [response, setResponse] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // const [isLoading, setIsLoading] = useState(true);

  const [playersQty, setPlayersQty] = useState(0);
  const [gamePrice, setGamePrice] = useState(0);
  const [gameAddressCountry, setGameAddressCountry] = useState("Lietuva");
  const [gameAddressCity, setGameAddressCity] = useState("");
  const [gameAddressStreet, setGameAddressStreet] = useState("");
  const [gameDate, setGameDate] = useState(new Date().toISOString());
  const [gameDescription, setGameDescription] = useState("");
  const [addressError, setAddressError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [declineUser, setDeclineUser] = useState<number>(-1);
  const [isConfirmed, setConfirmed] = useState(false);
  const [isCancelled, setCancelled] = useState(false);
  const [isReturned, setReturned] = useState(false);
  const [isShowModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  const [modalConfirmFunc, setModalConfirmFunc] = useState<() => void>(
    () => {}
  );
  const [isDescriptionChanged, setDescriptionChanged] = useState(false);

  const userContext = GetUserContext();

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
    if (declineUser >= 0) {
      event?.accepted_persons_ids.splice(declineUser, 1);
      setDeclineUser(-1);
    }
  }, [declineUser]);

  useEffect(() => {
    if (isReturned) {
      setModalText("Are you sure you want to return without save?");

      setModalConfirmFunc(() => () => {
        setShowModal(false);
        router.back();
      });
      setShowModal(true);
    }
  }, [isReturned]);

  useEffect(() => {
    if (isCancelled) {
      setShowModal(true);
      setModalText("Are you sure you want to cancel event?");
    }

    setModalConfirmFunc(() => () => {
      if (event) {
        if (!isDescriptionChanged) {
          console.log("isDescriptionChanged", isDescriptionChanged);
          // setShowModal(false);
          // setCancelled(false);
          setModalText("Please add to description why event is canceled");
          setModalConfirmFunc(() => () => {
            setShowModal(false);
            setCancelled(false);
          });

          setShowModal(true);
        } else {
          setShowModal(false);
          event.isCanceled = true;
          UpdateEventById({
            id: id as string,
            event: event,
            setResponse,
            setFetchError,
          });

          if (fetchError) {
            if (fetchError === 401) {
              setShowLoginModal(true);
              setFetchError(null);

              userContext.SetUserContext(false);
            }
          }
        }
      }
      if (response === 200) {
        router.back();
      }
    });
  }, [isCancelled]);

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
      if (event) {
        event.number_persons = playersQty;
        event.price = gamePrice;
        event.address.country = gameAddressCountry;
        event.address.city = gameAddressCity;
        event.address.street = gameAddressStreet;
        event.date_time = new Date(gameDate);
        event.description = gameDescription;
      }
      setShowModal(true);
      setModalText("Are you sure you want to confirm event?");
    }

    setModalConfirmFunc(() => () => {
      if (event) {
        UpdateEventById({
          id: id as string,
          event: event,
          setResponse,
          setFetchError,
        });

        if (fetchError) {
          if (fetchError === 401) {
            setShowLoginModal(true);
            setFetchError(null);

            userContext.SetUserContext(false);
          }
        }
      }
    });
  }, [isConfirmed]);

  useEffect(() => {
    if (response === 200) {
      router.back();
    }
  }, [response]);

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

  useEffect(() => {
    if (event) {
      // setIsLoading(false);

      const eventDate = new Date(event.date_time);
      eventDate.setMinutes(
        eventDate.getMinutes() - eventDate.getTimezoneOffset()
      );
      const eventDateTime = eventDate.toISOString().slice(0, 16);
      setPlayersQty(event.number_persons);
      setGamePrice(event.price);
      setGameAddressCountry(event.address.country);
      setGameAddressCity(event.address.city);
      setGameAddressStreet(event.address.street);
      setGameDate(eventDateTime);
      setGameDescription(event.description);
    }
  }, [event]);

  return (
    <>
      {isShowModal && (
        <Modal
          text={modalText}
          isOpen={isShowModal}
          onCloseModal={() => {
            setShowModal(false);
            setReturned(false);
            setCancelled(false);
            setConfirmed(false);
          }}
          onConfirm={() => {
            modalConfirmFunc();
          }}
        />
      )}

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
          <div className={styles.gameWrapper}>
            <h3>Host :{event.host.name}</h3>

            <h3>
              Players qty:{" "}
              {playersQtySelector(
                event.game.minPlayers as number,
                event.game.maxPlayers as number
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
              onChange={(e) => {
                setGameDescription(e.target.value);
                setDescriptionChanged(true);
              }}
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

            <h3>Accepted players : {event.accepted_persons_ids.length}</h3>
          </div>

          <div className={styles.playersList}>
            <div className={styles.playersListLine}>
              <h3 className={styles.playersListLineElement}>User name</h3>
              <h3 className={styles.playersListLineElement}>Registered at</h3>
              <h3 className={styles.playersListLineElement}>Action</h3>
            </div>
            {event.accepted_persons_ids.map((p, index) => (
              <div className={styles.playersListLine} key={p.user.id}>
                <h3 className={styles.playersListLineElement}>{p.user.name}</h3>
                <h3 className={styles.playersListLineElement}>
                  {new Date(p.addedAt).toLocaleString("lt-LT")}
                </h3>

                <div className={styles.playersListLineElement}>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => {
                      setDeclineUser(index);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.buttonWrapper}>
            <button
              className={styles.confirmEventButton}
              onClick={() => setConfirmed(true)}
            >
              Confirm changes
            </button>
            <button
              className={styles.cancelEventButton}
              onClick={() => setCancelled(true)}
            >
              Cancel event
            </button>
            <button
              className={styles.returnEventButton}
              onClick={() => setReturned(true)}
            >
              Return
            </button>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Event;
