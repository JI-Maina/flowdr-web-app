import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  role: string;
  username: string;
  companyId: string;
};

export type Store = {
  user: User;
};

export type State = {
  store: Store;
};

export type Actions = {
  updateUser: (user: User) => void;
};

const initialStore: Store = {
  user: {} as User,
};

export const useFlowdrStore = create<State & Actions>()(
  persist(
    (set) => ({
      store: initialStore,
      updateUser(user: User) {
        set((state) => ({ store: { ...state.store, user } }));
      },
    }),
    { name: "flowdrStore" }
  )
);
