import { SortGameFileds } from "@/components/GamesSearchInput/GamesSearchInput";

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

export type GameCardType = {
  game: GameType;
  isOverlay?: boolean;
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
export type SaveEventType = {
  event: EventType;
  setFetchError: (fetchError: number | null) => void;
};

export type EventType = {
  id: string;
  host: { name: string; _id?: string; id: string };
  game: GameType;
  number_persons: number;
  date_time: Date;
  description: string;
  price: number;
  accepted_persons_ids: {
    user: { name: string; id: string };
    user_id: string;
    addedAt: Date;
  }[];
  isCanceled: boolean;
  address: { street: string; city: string; country: string };
  geolocation: {
    coordinates: [number, number];
  };
};

export type GetEventType = {
  id: string;
  setEvent: (event: EventType) => void;
  setFetchError: (fetchError: number | null) => void;
};
export type UpdateEventType = {
  id: string;
  event: EventType;
  setResponse: (response: number | null) => void;
  setFetchError: (fetchError: number | null) => void;
};
export type GetEventsType = {
  gameTitle?: string;
  dateTime?: Date;
  hostId?: string;
  isCanceled?: boolean;
  setEvents: (events: EventType[]) => void;
  setFetchError: (fetchError: number | null) => void;
  userGeolocation?: { longitude: number; latitude: number };
  distance?: number;
};

export type EventRegisterType = {
  eventId: string;
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

export type GamesSearchOverlayProps = {
  setIsOpen: (isOpen: boolean) => void;
  setSelectedGame: (game: GameType | null) => void;
};
