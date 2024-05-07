import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { barMenuInfo } from "../../types/types";
import imageUnavailable from "../../assets/image_unavailable_photo.png";

interface LngLat {
  lat: number;
  lng: number;
}
interface ChainState {
  center: LngLat;
  isChaining: boolean;
  firstBar: barMenuInfo;
  chain: google.maps.DirectionsResult[];
  bars: barMenuInfo[];
}
const initialState: ChainState = {
  isChaining: false,
  firstBar: {
    id: "NULL",
    name: "NULL",
    display_phone: "NULL",
    rating: "0.0",
    location: {
      address1: "NULL",
    },
    image_url: imageUnavailable,
    is_closed: true,
    url: "www.google.com",
    price: "$$$$$",
    distance: 100,
  },
  chain: [],
  bars: [],
  center: {
    lat: 0,
    lng: 0,
  },
};

const chainSlice = createSlice({
  name: "chain",
  initialState,
  reducers: {
    startChain(state) {
      state.isChaining = true;
    },
    endChain(state) {
      state.isChaining = false;
    },
    setFirstBar(state, action: PayloadAction<barMenuInfo>) {
      state.firstBar = action.payload;
    },
    updateChain(state, action: PayloadAction<google.maps.DirectionsResult>) {
      let temp = state.chain;
      temp.push(action.payload);
      state.chain = temp;
    },
    resetChain(state) {
      state.chain = [];
    },
    popChain(state) {
      let temp = state.chain;
      temp.pop();
      state.chain = temp;
    },
    updateBars(state, action: PayloadAction<barMenuInfo>) {
      let temp = state.bars;
      temp.push(action.payload);
      state.bars = temp;
    },
    popBar(state) {
      let temp = state.bars;
      temp.pop();
      state.bars = temp;
    },
    resetBars(state) {
      state.bars = [];
    },
    setPrevCords(state, action: PayloadAction<LngLat>) {
      state.center = action.payload;
    },
  },
});

export const {
  setFirstBar,
  startChain,
  endChain,
  popBar,
  popChain,
  updateChain,
  resetChain,
  updateBars,
  resetBars,
  setPrevCords,
} = chainSlice.actions;
export default chainSlice.reducer;
