import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../services/types/User";


interface UserState {
  details: User | null;
}

const initialState: UserState = {
  details: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<User>) => {
      state.details = action.payload;
    },
    clearUserDetails: (state) => {
      state.details = null;
    },
  },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;
