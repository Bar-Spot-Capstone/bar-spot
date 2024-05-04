import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { barMenuInfo } from "../../types/types";
import imageUnavailable from "../../assets/image_unavailable_photo.png";

interface ChainState {
  isChaining: boolean;
  firstBar: barMenuInfo;
  chain: barMenuInfo[];
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
    updateChain(state, action: PayloadAction<barMenuInfo[]>) {
      state.chain = action.payload;
    },
  },
});

export const { setFirstBar, startChain, endChain, updateChain } =
  chainSlice.actions;
export default chainSlice.reducer;
