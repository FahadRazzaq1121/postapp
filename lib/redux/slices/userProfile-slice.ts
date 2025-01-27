import { Dispatch, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchDataWrapper } from "../../../util";

const BaseUrl = "http://localhost:8000/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const initialState: { userProfile: User | null } = {
  userProfile: null,
};

const userProfileSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile(state, action) {
      const userProfile = action.payload;
      state.userProfile = userProfile;
    },
  },
});

export const { setUserProfile } = userProfileSlice.actions;
export const selectUserProfile = (state: RootState) =>
  state.userProfile.userProfile;
export default userProfileSlice.reducer;

export function getUserProfile() {
  return async (dispatch: Dispatch) => {
    const user = await fetchDataWrapper(`${BaseUrl}/user/me`);
    dispatch(setUserProfile(user?.user));
  };
}
