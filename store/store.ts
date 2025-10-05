import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Branch, Category, Product } from "@/types/flowdr";

type User = {
  id: string;
  role: string;
  username: string;
  companyId: string;
};

export type Store = {
  user: User;
  products: Product[];
  categories: Category[];
  branches: Branch[];
};

export type State = {
  store: Store;
};

export type Actions = {
  updateUser: (user: User) => void;
  updateProducts: (products: Product[]) => void;
  updateCategories: (categories: Category[]) => void;
  updateBranches: (branches: Branch[]) => void;
};

const initialStore: Store = {
  user: {} as User,
  products: [] as Product[],
  categories: [] as Category[],
  branches: [] as Branch[],
};

export const useFlowdrStore = create<State & Actions>()(
  persist(
    (set) => ({
      store: initialStore,
      updateUser(user: User) {
        set((state) => ({ store: { ...state.store, user } }));
      },
      updateProducts(products: Product[]) {
        set((state) => ({ store: { ...state.store, products } }));
      },
      updateCategories(categories: Category[]) {
        set((state) => ({ store: { ...state.store, categories } }));
      },
      updateBranches(branches: Branch[]) {
        set((state) => ({ store: { ...state.store, branches } }));
      },
    }),
    { name: "flowdrStore" }
  )
);
