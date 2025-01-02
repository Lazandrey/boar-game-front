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
// const hostAddress = process.env.BASE_URL;
console.log(hostAddress);

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
  userGeolocation,
  distance,
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
      `${hostAddress}/event?title=${gameTitle}&startDate=${startDate}&hostId=${hostId}&isCanceled=${isCanceled}&userLongitude=${userGeolocation?.longitude}&userLatitude=${userGeolocation?.latitude}&distance=${distance}`,
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
export type UserRegisterPropsType = {
  name: string;
  email: string;
  password: string;
};

export type UserLoginType = {
  isLoggedIn: boolean;
  email: string;
  username: string;
  userId: string;
  responseMessage?: string | undefined | unknown;
  responseStatus: number;
};
export const UserRegister = async (
  registerData: UserRegisterPropsType
): Promise<UserLoginType> => {
  try {
    const response = await axios.post(
      `${hostAddress}/user/signin`,
      registerData
    );
    console.log(response);
    if (response.status === 201) {
      cookie.set("authToken", response.data.token);
      cookie.set("userEmail", registerData.email);
      cookie.set("userName", response.data.user.name);
      cookie.set("userId", response.data.user.id);

      return {
        isLoggedIn: true,
        email: registerData.email,
        username: response.data.user.name,
        userId: response.data.user.id,
        responseMessage: response.data.message,
        responseStatus: response.status,
      };
    }

    return {
      isLoggedIn: false,
      email: registerData.email,
      username: "",
      userId: "",
      responseMessage: response.data.error.message,
      responseStatus: response.status,
    };
  } catch (error: unknown) {
    const errorResponse = error as AxiosError;
    console.error(errorResponse);
    return {
      isLoggedIn: false,
      email: registerData.email,
      username: "",
      userId: "",
      responseMessage:
        (errorResponse.response?.data as { message: string }).message || "",
      responseStatus: errorResponse.response?.status as number,
    };
  }
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
  } catch (error: unknown) {
    const errorResponse = error as AxiosError;
    console.error(errorResponse);
    return {
      isLoggedIn: false,
      email: loginData.email,
      username: "",
      userId: "",

      responseStatus: errorResponse.response?.status as number,
    };
  }
};
export type UserUpdatePropsType = {
  id: string;
  name: string;
  email: string;
  password: string;
  newPassword: string;
};
export const UserUpdate = async (
  updateData: UserUpdatePropsType
): Promise<UserLoginType> => {
  try {
    const headers = {
      authorization: cookie.get("authToken"),
    };
    const response = await axios.put(
      `${hostAddress}/user/update/`,
      updateData,
      {
        headers,
      }
    );
    console.log(response);
    if (response.status === 200) {
      cookie.set("authToken", response.data.token);
      cookie.set("userEmail", updateData.email);
      cookie.set("userName", response.data.userName);
      cookie.set("userId", response.data.userId);

      return {
        isLoggedIn: true,
        email: updateData.email,
        username: response.data.userName,
        userId: response.data.userId,
        responseMessage: response.data.message,
        responseStatus: response.status,
      };
    }

    return {
      isLoggedIn: false,
      email: updateData.email,
      username: "",
      userId: "",
      responseMessage: response.data.error.message,
      responseStatus: response.status,
    };
  } catch (error: unknown) {
    const errorResponse = error as AxiosError;

    return {
      isLoggedIn: false,
      email: updateData.email,
      username: "",
      userId: "",
      responseMessage:
        (errorResponse.response?.data as { message: string }).message || "",

      responseStatus: errorResponse.response?.status as number,
    };
  }
};
