import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GroupState {
    isInGroup: boolean;
    groupId: number;
    userRole: string;
    groupName: string;
};

const initialState: GroupState = {
    isInGroup: false,
    groupId: -Infinity,
    userRole: "",
    groupName: ""
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
        },
        setUserGroupName(state, action: PayloadAction<string>) {
            state.groupName = action.payload
        }
    }
});

export const { registerGroup, leaveGroup, setGroupId, setUserRole, setUserGroupName } = groupSlice.actions;
export default groupSlice.reducer;