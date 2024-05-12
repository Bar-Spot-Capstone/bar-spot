import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LngLat {
  lat: number;
  lng: number;
}
interface MapState {
  map: google.maps.Map | null;
  center: LngLat;
}

const initialState: MapState = {
  map: null,
  center: {
    lat: 0,
    lng: 0,
  },
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
    setCenter(state, action: PayloadAction<LngLat>) {
      state.center = action.payload;
    },
  },
});

export const { setNewMap, setNull, setCenter } = mapSlice.actions;
export default mapSlice.reducer;
