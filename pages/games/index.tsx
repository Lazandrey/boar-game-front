import React, { useEffect, useState } from "react";

import styles from "./styles.module.css";

import Cards from "../../components/Cards/Cards";
import SearchInput from "../../components/SearchInput/SearchInput";
import Spinner from "../../components/Spinner/Spinner";
import GamesNavigation from "../../components/GamesNavigation/GamesNavigation";
import LoginModal from "../../components/LoginModal/LoginModal";

import { SortGameFileds } from "../../components/SearchInput/SearchInput";
import { GameType } from "../../types/game.types";
import { GetGames } from "../../utils/fetches";
import { useRouter } from "next/router";
import { GetUserContext } from "@/components/Context";

type GamesOnPage = number | "All";

const Main = () => {
  const [games, setGames] = useState<GameType[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [sortField, setSortField] = useState<SortGameFileds>("rating");
  const [gamesOnPage, setGamesOnPage] = useState<GamesOnPage>(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredGamesQty, setFilteredGamesQty] = useState(0);
  const [fetchError, setFetchError] = useState<number | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const router = useRouter();
  const userContext = GetUserContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParameters = new URLSearchParams(window.location.search);

      const page = queryParameters.get("page");
      const onPage = queryParameters.get("onPage");

      if (page) setCurrentPage(parseInt(page));
      if (onPage)
        if (onPage === "All") setGamesOnPage("All");
        else setGamesOnPage(parseInt(onPage));

      const startIndex =
        (currentPage - 1) * (gamesOnPage === "All" ? 1 : gamesOnPage);

      const offset = gamesOnPage === "All" ? 1 : gamesOnPage;
      if (!showLoginModal) {
        GetGames({
          gameSearchProps: {
            title: searchTitle,
            sortField,
            startIndex: startIndex,
            offset: offset,
          },
          setGames,
          setFilteredGamesQty,
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
    currentPage,
    gamesOnPage,
    searchTitle,
    sortField,
    router,
    fetchError,
    userContext,
    showLoginModal,
  ]);

  useEffect(() => {
    const totalPages =
      gamesOnPage === "All"
        ? 1
        : Math.ceil(filteredGamesQty / (gamesOnPage as number));
    setTotalPages(totalPages);
  }, [gamesOnPage, filteredGamesQty]);

  return (
    <div className={styles.main}>
      <SearchInput
        setSearchTitle={setSearchTitle}
        foundGamesQty={filteredGamesQty}
        sortField={sortField}
        setSortField={setSortField}
        gamesOnPage={gamesOnPage}
        setGamesOnPage={setGamesOnPage}
      />
      <GamesNavigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        gamesOnPage={gamesOnPage}
      />
      {showLoginModal && (
        <LoginModal
          text={"Some text"}
          isOpen={showLoginModal}
          setIsOpen={setShowLoginModal}
        />
      )}
      {games ? <Cards games={games} /> : <Spinner />}
      <GamesNavigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        gamesOnPage={gamesOnPage}
      />
    </div>
  );
};

export default Main;
