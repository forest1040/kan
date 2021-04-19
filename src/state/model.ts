import { atom, selector } from "recoil";

export type ViewTable = {
  id: number;
  title: string;
  createdTimestamp: number;
  updatedTimestamp: number;
};

export type ListTable = {
  id: number;
  viewId: number;
  index: number;
  title: string;
  tag: string;
};

export type Tag = {
  id: number;
  name: string;
  text: string;
};

// 表示用カードモデル
export type CardTable = {
  id: number;
  listId: number;
  index: number;
  text: string;
};

// 永続化用カードモデル
export type CardModel = {
  id: number;
  text: string;
};

export type CardTag = {
  id: number;
  cardId: number;
  tag: string;
};

export type WorkSpace = {
  id: number;
  title: string;
  viewId: number;
  queryId: number;
};

export type QueryCondition = {
  id: number;
  dateFrom?: Date;
  dateTo?: Date;
  title?: string;
  text?: string;
};

export type QueryConditionTag = {
  id: number;
  queryId: number;
  tag: string;
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
