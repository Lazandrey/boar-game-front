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
