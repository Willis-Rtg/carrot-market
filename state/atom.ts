import { atom } from "recoil";

export const intersectionState = atom<number[]>({
  key: "intersectionState",
  default: [],
});
