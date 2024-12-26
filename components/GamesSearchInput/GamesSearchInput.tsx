import React from "react";
import styles from "./styles.module.css";

export type SortGameFileds =
  | "rating"
  | "usersrated"
  | "minPlayers"
  | "maxPlayers"
  | "minPlayTime"
  | "maxPlayTime"
  | "weight"
  | "age";

type GamesInputProps = {
  setSearchTitle: (searchText: string) => void;
  foundGamesQty: number;
  sortField: SortGameFileds;
  setSortField: (sortKey: SortGameFileds) => void;
  gamesOnPage: number | "All";
  setGamesOnPage: (gamesOnPage: number | "All") => void;
};

const GamesSearchInput = ({
  setSearchTitle,
  foundGamesQty,
  sortField,
  setSortField,
  gamesOnPage,
  setGamesOnPage,
}: GamesInputProps) => {
  return (
    <div className={styles.main}>
      <input
        placeholder="Search..."
        type="text"
        onChange={(e) => setSearchTitle(e.target.value)}
      />
      <p>Found games: {foundGamesQty}</p>
      <select
        className={styles.sortSelect}
        name="options"
        id="options"
        value={sortField}
        onChange={(e) => setSortField(e.target.value as SortGameFileds)}
      >
        <option value="rating">Rating</option>
        <option value="usersrated">Rated by users</option>
        <option value="minPlayers">Minimal players qty</option>
        <option value="maxPlayers">Maximal players qty</option>
        <option value="minPlayTime">Minimal play time</option>
        <option value="maxPlayTime">Maximal play time</option>
        <option value="weight">Difficulty</option>
        <option value="age">Age</option>
      </select>
      <label htmlFor="noOfPages">Number of games on page: </label>
      <select
        className={styles.pagesSelect}
        name="noOfPages"
        id="noOfPages"
        value={gamesOnPage}
        onChange={(e) => setGamesOnPage(e.target.value as number | "All")}
      >
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={"All"}>All</option>
      </select>
    </div>
  );
};

export default GamesSearchInput;
