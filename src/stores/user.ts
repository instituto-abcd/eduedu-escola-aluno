import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginResponse } from "../api/auth";
import { UserProfile } from "~/constants";

type UserStore = LoginResponse & {
  profile: UserProfile;
  isUserAuthenticated: () => boolean;
  signOut: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      accessToken: "",
      document: "",
      email: "",
      id: "",
      name: "",
      profile: "" as UserProfile,
      isUserAuthenticated: () => Boolean(get().accessToken),
      signOut: () =>
        set({
          accessToken: "",
          document: "",
          email: "",
          id: "",
          name: "",
          profile: "" as UserProfile,
        }),
    }),
    {
      name: "user_state",
    }
  )
);
