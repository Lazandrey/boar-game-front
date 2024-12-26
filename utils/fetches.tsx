import axios, { AxiosError } from "axios";
import cookie from "js-cookie";
import {
  EventRegisterType,
  GetEventsType,
  GetEventType,
  GetGamesType,
  GetGameType,
  IsUserRegisteredType,
  SaveEventType,
  UpdateEventType,
} from "@/types/game.types";
const hostAddress = `http://localhost:3002`;

export const CancelRegistrationToEvent = async ({
  eventId,
  setFetchError,
  setIsRegistered,
}: EventRegisterType) => {
  try {
    const headers = {
      authorization: cookie.get("authToken"),
    };
    const response = await axios.post(
      `${hostAddress}/event/${eventId}/decline`,
      {},
      {
        headers,
      }
    );

    if (response.status === 200) {
      setIsRegistered("");
    }
  } catch (error: unknown) {
    const errorResponse = error as AxiosError;

    if (errorResponse.status !== undefined) {
      setFetchError(errorResponse.status);
    } else {
      setFetchError(null);
    }
  }
};

export const RegisterToEvent = async ({
  eventId,
  setFetchError,
  setIsRegistered,
  setIsShowAddUserButton,
}: EventRegisterType) => {
  try {
    const headers = {
      authorization: cookie.get("authToken"),
    };
    const response = await axios.post(
      `${hostAddress}/event/${eventId}/accept`,
      {},
      {
        headers,
      }
    );

    if (response.status === 200) {
      setIsRegistered(response.data.user._id);
      setIsShowAddUserButton(false);
    }
  } catch (error: unknown) {
    const errorResponse = error as AxiosError;

    if (errorResponse.status !== undefined) {
      setFetchError(errorResponse.status);
    } else {
      setFetchError(null);
    }
  }
};

export const isUserRegisteredtoEvent = async ({
  eventId,
  setIsRegistered,
  setFetchError,
  setIsShowAddUserButton,
}: IsUserRegisteredType) => {
  try {
    const headers = {
      authorization: cookie.get("authToken"),
    };
    const response = await axios.get(
      `${hostAddress}/event/${eventId}/checkuser`,
      {
        headers,
      }
    );

    if (response.data.message) {
      setIsRegistered(response.data.userid);
      setIsShowAddUserButton(false);
    } else {
      setIsShowAddUserButton(true);
    }
    setFetchError(null);
    return response.data.message;
  } catch (error: unknown) {
    const errorResponse = error as AxiosError;

    if (errorResponse.status !== undefined) {
      setFetchError(errorResponse.status);
      // console.log("fetch error", errorResponse);
    } else {
      setFetchError(null);
      console.log("fetch error", errorResponse);
    }
  }
};

export const SaveEvent = async ({ event, setFetchError }: SaveEventType) => {
  try {
    const headers = {
      authorization: cookie.get("authToken"),
    };
    const response = await axios.post(`${hostAddress}/event`, event, {
      headers,
    });
    setFetchError(null);
    return response.data.event;
  } catch (error: unknown) {
    console.log(error);
    const errorResponse = error as AxiosError;
    if (errorResponse.status !== undefined) {
      setFetchError(errorResponse.status);
    } else {
      setFetchError(null);
    }
  }
};

export const GetEvents = async ({
  gameTitle,
  dateTime,
  hostId,
  isCanceled,
  setEvents,
  setFetchError,
}: GetEventsType): Promise<void> => {
  try {
    const headers = {
      authorization: cookie.get("authToken"),
    };
    let startDate;
    if (dateTime) {
      startDate = new Date(dateTime).toISOString();
    }
    const response = await axios.get(
      `${hostAddress}/event?title=${gameTitle}&startDate=${startDate}&hostId=${hostId}&isCanceled=${isCanceled}`,
      {
        headers,
      }
    );

    setEvents(response.data.events);
  } catch (error: unknown) {
    const errorResponse = error as AxiosError;

    if (errorResponse.status !== undefined) {
      setFetchError(errorResponse.status);
    } else {
      setFetchError(null);
    }
  }
};

export const GetEventById = async ({
  id,
  setEvent,
  setFetchError,
}: GetEventType) => {
  try {
    const headers = {
      authorization: cookie.get("authToken"),
    };
    const response = await axios.get(`${hostAddress}/event/${id}`, {
      headers,
    });

    setEvent(response.data.event);
    setFetchError(null);
  } catch (error: unknown) {
    const errorResponse = error as AxiosError;

    if (errorResponse.status !== undefined) {
      setFetchError(errorResponse.status);
    } else {
      setFetchError(null);
    }
  }
};

export const UpdateEventById = async ({
  id,
  event,
  setResponse,
  setFetchError,
}: UpdateEventType) => {
  try {
    const headers = {
      authorization: cookie.get("authToken"),
    };
    const response = await axios.put(`${hostAddress}/event/${id}`, event, {
      headers,
    });

    setResponse(response.status);

    setFetchError(null);
  } catch (error: unknown) {
    const errorResponse = error as AxiosError;

    if (errorResponse.status !== undefined) {
      setFetchError(errorResponse.status);
    } else {
      setFetchError(null);
    }
  }
};

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

    if (errorResponse.status !== undefined) {
      setFetchError(errorResponse.status);
    } else {
      setFetchError(null);
    }
  }
};

export const GetGameById = async ({
  id,
  setGame,
  setFetchError,
}: GetGameType) => {
  try {
    const headers = {
      authorization: cookie.get("authToken"),
    };

    const response = await axios.get(`${hostAddress}/game/${id}`, {
      headers,
    });
    setGame(response.data.game);
    setFetchError(null);
  } catch (error: unknown) {
    const errorResponse = error as AxiosError;

    if (errorResponse.status !== undefined) {
      setFetchError(errorResponse.status);
    } else {
      setFetchError(null);
    }
  }
};

export type UserLoginPropsType = {
  email: string;
  password: string;
};

export type UserLoginType = {
  isLoggedIn: boolean;
  email: string;
  username: string;
  userId: string;

  responseStatus: number;
};
export const UserLogin = async (
  loginData: UserLoginPropsType
): Promise<UserLoginType> => {
  try {
    const response = await axios.post(`${hostAddress}/user/login`, loginData);

    if (response.status === 200) {
      cookie.set("authToken", response.data.token);
      cookie.set("userEmail", loginData.email);
      cookie.set("userName", response.data.userName);
      cookie.set("userId", response.data.userId);

      return {
        isLoggedIn: true,
        email: loginData.email,
        username: response.data.userName,
        userId: response.data.userId,

        responseStatus: response.status,
      };
    }

    return {
      isLoggedIn: false,
      email: loginData.email,
      username: "",
      userId: "",

      responseStatus: response.status,
    };
  } catch (error) {
    console.error(error);
    return {
      isLoggedIn: false,
      email: loginData.email,
      username: "",
      userId: "",

      responseStatus: 500,
    };
  }
};
