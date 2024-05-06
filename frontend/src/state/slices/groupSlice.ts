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
        },
        resetGroupState(state) {
            state.isInGroup = false;
            state.groupId = -Infinity;
            state.userRole = "";
            state.groupName = "";
        }
    }
});

export const { registerGroup, leaveGroup, setGroupId, setUserRole, setUserGroupName, resetGroupState } = groupSlice.actions;
export default groupSlice.reducer;