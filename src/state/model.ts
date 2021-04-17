import { atom, selector } from "recoil";

export type BoardTable = {
  id?: number;
  createdTimestamp: number;
  title: string;
  updatedTimestamp: number;
};

export type ListTable = {
  id?: number;
  boardId: number;
  index: number;
  title: string;
};

export type CardTable = {
  id?: number;
  listId: number;
  index: number;
  text: string;
};

export type Lists = ListTable[];
export type Cards = CardTable[];

const initListState: Lists = [];
const initCardState: Cards = [];

export const listState = atom({
  key: "listState",
  default: initListState,
});

export const cardState = atom({
  key: "cardState",
  default: initCardState,
});

export const allLists = selector({
  key: "allLists",
  get: ({ get }) => {
    return get(listState);
  },
});

export const allCards = selector({
  key: "allCards",
  get: ({ get }) => {
    return get(cardState);
  },
});
