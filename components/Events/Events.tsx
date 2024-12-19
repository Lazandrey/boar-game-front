import React from "react";
import styles from "./styles.module.css";
import { EventType } from "../../types/game.types";
import Event from "../Event/Event";

type EventProps = {
  events: EventType[];
};

const Events = ({ events }: EventProps) => {
  return (
    <div className={styles.main}>
      {events.map((e) => (
        <Event key={e.id} {...e} />
      ))}
    </div>
  );
};

export default Events;
