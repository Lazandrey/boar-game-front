import { SortGameFileds } from "@/components/SearchInput/SearchInput";

export type GameType = {
  id: string;
  title: string;
  rating: number;
  usersrated: number;
  minPlayers: number;
  maxPlayers: number;
  minPlayTime: number;
  maxPlayTime: number;
  weight: number;
  gameImageUrl: string;
  age: number;
  description: string;
};

export type GameSearchType = {
  title: string;
  sortField: SortGameFileds;
  startIndex: number;
  offset: number;
};

export type GetGamesType = {
  gameSearchProps: GameSearchType;
  setGames: (games: GameType[]) => void;
  setFilteredGamesQty: (filteredGamesQty: number) => void;
  setFetchError: (fetchError: number | null) => void;
};

export type GetGameType = {
  id: string;
  setGame: (game: GameType) => void;
  setFetchError: (fetchError: number | null) => void;
};

export type EventType = {
  id: string;
  host: { name: string; _id: string };
  game: GameType;
  number_persons: number;
  date_time: Date;
  description: string;
  price: number;
  accepted_persons_ids: {
    user: { name: string; _id: string };
    user_id: string;
    addedAt: Date;
  }[];
  isCanceled: boolean;
  address: { street: string; city: string; country: string };
};

export type GetEventType = {
  id: string;
  setEvent: (event: EventType) => void;
  setFetchError: (fetchError: number | null) => void;
};
export type GetEventsType = {
  gameTitle: string;
  setEvents: (events: EventType[]) => void;
  setFetchError: (fetchError: number | null) => void;
};

export type EventRegisterType = {
  eventId: string;
  setFetchResponce: (fetchResponce: string | null) => void;
  setFetchError: (fetchError: number | null) => void;
  setIsRegistered: (isRegistered: string) => void;
  setIsShowAddUserButton: (isShowAddUserButton: boolean) => void;
};

export type IsUserRegisteredType = {
  eventId: string;
  setIsRegistered: (isRegistered: string) => void;
  setFetchError: (fetchError: number | null) => void;
  setIsShowAddUserButton: (isShowAddUserButton: boolean) => void;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
};
