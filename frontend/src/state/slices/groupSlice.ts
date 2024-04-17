import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GroupState {
    isInGroup: boolean;
    groupId: number;
    userRole: string;
};

const initialState: GroupState = {
    isInGroup: false,
    groupId: -Infinity,
    userRole: ""
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
        },
        setUserRole(state, action: PayloadAction<string>) {
            state.userRole = action.payload
        }
    }
});

export const { registerGroup, leaveGroup, setGroupId, setUserRole } = groupSlice.actions;
export default groupSlice.reducer;