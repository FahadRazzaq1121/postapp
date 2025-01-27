import { Dispatch, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchUser } from "../../../services/users";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const initialState: { user: User[]; total: number } = {
  user: [],
  total: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const user = action.payload;
      state.user = user;
    },
    setTotalUser(state, action) {
      const total = action.payload;
      state.total = total;
    },
  },
});

export const { setUser, setTotalUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectTotalUser = (state: RootState) => state.user.total;
export default userSlice.reducer;

export function getUser(page: number, limit: number, search: string = "") {
  return async (dispatch: Dispatch) => {
    const res = await fetchUser(page, limit, search);
    dispatch(setUser(res.users));
    dispatch(setTotalUser(res.totalUsers));
  };
}
