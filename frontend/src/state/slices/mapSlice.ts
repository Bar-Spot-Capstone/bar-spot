import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// import getDefaultMiddleware

// const customizedMiddleware = getDefaultMiddleware({
//     serializableCheck: false
//   })

interface MapState {
  map: google.maps.Map | null;
}

const initialState: MapState = {
  map: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setNewMap(state, action: PayloadAction<google.maps.Map>) {
      state.map = action.payload;
    },
    setNull(state) {
      state.map = null;
    },
  },
});

export const { setNewMap, setNull } = mapSlice.actions;
export default mapSlice.reducer;