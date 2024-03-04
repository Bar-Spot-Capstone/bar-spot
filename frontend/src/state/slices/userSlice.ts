import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//documentation
/*
https://redux.js.org/tutorials/essentials/part-3-data-flow
*/

interface UserState {
  isLoggedIn: boolean;
  userId: number;
  username: string;
}

const initialState: UserState = {
  isLoggedIn: false,
  userId: -1,
  username: "null",
};

const userSlice = createSlice({
  name: "active_user",
  initialState,
  reducers: {
    login(state){
        state.isLoggedIn = true;
    },
    logout(state){
        state.isLoggedIn = false;
    },
    setUsername(state, action: PayloadAction<string>){
        state.username = action.payload
    },
    setUserID(state, action: PayloadAction<number>){
        state.userId = action.payload
    },
  },
});

export const {login, logout, setUsername, setUserID} = userSlice.actions;
export default userSlice.reducer;
