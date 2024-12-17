import { GetGamesType } from "@/types/game.types";
import axios, { AxiosError } from "axios";

import cookie from "js-cookie";

const hostAddress = `http://localhost:3002`;

export const GetGames = async ({
  gameSearchProps,
  setGames,
  setFilteredGamesQty,
  setFetchError,
}: GetGamesType): Promise<void> => {
  try {
    const headers = {
      authorization: cookie.get("authToken"),
    };

    const response = await axios.get(
      `${hostAddress}/game?title=${gameSearchProps.title}&sortField=${gameSearchProps.sortField}&start=${gameSearchProps.startIndex}&gamesOnPage=${gameSearchProps.offset}`,
      {
        headers,
      }
    );

    setGames(response.data.games);
    setFilteredGamesQty(response.data.count);
  } catch (error: unknown) {
    const errorResponse = error as AxiosError;
    console.error("status", errorResponse.status);
    if (errorResponse.status !== undefined) {
      setFetchError(errorResponse.status);
    } else {
      setFetchError(null);
    }
  }
};
