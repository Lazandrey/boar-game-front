import React from "react";
import Link from "next/link";
import styles from "./styles.module.css";

export type GamesNavigationProps = {
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
  totalPages: number;
  gamesOnPage: number | "All";
};

const GamesNavigation = ({
  currentPage,
  setCurrentPage,
  totalPages,
  gamesOnPage,
}: GamesNavigationProps) => {
  const handlePageChange = (page: number) => {
    if (page < 1) {
      setCurrentPage(1);
      return;
    }
    if (page > totalPages) {
      setCurrentPage(totalPages);
      return;
    }
    setCurrentPage(page);
  };
  return (
    <div className={styles.main}>
      <div className={styles.linkWrapper}>
        {currentPage > 2 && (
          <Link
            href={`/games?page=${1}&onPage=${gamesOnPage}`}
            onClick={() => {
              window.location.href = `/games?page=${1}&onPage=${gamesOnPage}`;
            }}
          >
            1...
          </Link>
        )}
        {currentPage > 1 && (
          <Link
            href={`/games?page=${currentPage - 1}&onPage=${gamesOnPage}`}
            onClick={() => {
              window.location.href = `/games?page=${
                currentPage - 1
              }&onPage=${gamesOnPage}`;
            }}
          >
            {currentPage - 1}
          </Link>
        )}
        <span>{currentPage}</span>
        {totalPages - currentPage > 1 && (
          <Link
            href={`/games?page=${currentPage + 1}&onPage=${gamesOnPage}`}
            onClick={() => {
              window.location.href = `/games?page=${
                currentPage + 1
              }&onPage=${gamesOnPage}`;
            }}
          >
            {currentPage + 1}
          </Link>
        )}
        {totalPages - currentPage > 2 && (
          <Link
            href={`/games?page=${totalPages}&onPage=${gamesOnPage}`}
            onClick={() => {
              window.location.href = `/games?page=${totalPages}&onPage=${gamesOnPage}`;
            }}
          >
            ...{totalPages}
          </Link>
        )}
      </div>
      <div className={styles.btnWrapper}>
        <button onClick={() => handlePageChange(1)}>&laquo; First</button>
        <button onClick={() => handlePageChange(currentPage - 1)}>
          &#8249;; Prev
        </button>
        <button onClick={() => handlePageChange(currentPage + 1)}>
          Next &#8250;
        </button>
        <button onClick={() => handlePageChange(totalPages)}>
          &raquo; Last
        </button>
      </div>
    </div>
  );
};

export default GamesNavigation;
