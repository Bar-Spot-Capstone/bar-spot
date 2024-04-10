import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GroupState {
    isInGroup: boolean;
    groupId: number;
};

const initialState: GroupState = {
    isInGroup: false,
    groupId: -Infinity
};

const groupSlice = createSlice({
    name: "user_group",
    initialState,
    reducers: {
        registerGroup(state) {
            state.isInGroup = true;
        },
        leaveGroup(state) {
            state.isInGroup = false;
        },
        setGroupId(state, action: PayloadAction<number>) {
            state.groupId = action.payload
        }
    }
});

export const { registerGroup, leaveGroup, setGroupId } = groupSlice.actions;
export default groupSlice.reducer;