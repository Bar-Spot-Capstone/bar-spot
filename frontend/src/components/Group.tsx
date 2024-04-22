import { registerGroup, setGroupId, setUserRole, setUserGroupName } from "../state/slices/groupSlice";
import { partyCreate, inviteMember, partyMembers, groupInfo } from "../types/fetchCall";

const createGroup = async (dispatch: any, name: string, invitedUsers: Array<any>, userId: number) => {
    try {
        if (!userId || userId < 1) {
            console.log("UserId not found");
            return;
        };

        if (invitedUsers && invitedUsers.length > 0) {
            //If there are members, invite each of them
            //Have to reduce the array in to a single object containing each users id. This can be done with the reduce function
            /*Accumulator is the result of the building of a new object from the previous call. CurrentValue is the current value*/
            const invitedUsersObj = invitedUsers.reduce((accumulator: any, currentValue: any) => {
                accumulator[currentValue.id] = currentValue.id;
                return accumulator;
            }, {});

            const options: object = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userId,
                    name: name,
                    invitedUsers: invitedUsersObj
                })
            };
            const response: Response = await fetch(partyCreate, options);

            if (!response.ok) {
                const res: any = await response.json();
                console.log(`Response was not okay with error: ${res.error}`);
                return;
            }

            const res = await response.json();
            console.log(`${res}, added multiple people to group`);
            /*Update user as being in a group with the group id*/
            dispatch(registerGroup());
            dispatch(setGroupId(res.groupId));
            dispatch(setUserRole("Owner"));//sets user as owner of a group
            dispatch(setUserGroupName(name));//resets user's role to default
            return;
        }
        //Else no invited users
        const options: object = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                name: name
            })
        };

        const response: Response = await fetch(partyCreate, options);

        if (!response.ok) {
            const res: any = await response.json();
            console.log(`Response was not okay with error: ${res.error}`);
            return;
        }

        const group = await response.json();
        console.log(group);
        /*Update user as being in a group with the group id*/
        dispatch(registerGroup());
        dispatch(setGroupId(group.groupId));
        dispatch(setUserRole("Owner"));//sets user as owner of a group
        dispatch(setUserGroupName(name));//resets user's role to default
        return;
    }
    catch (error: any) {
        console.log(`Failed to fetch group API with error: ${error}`)
    };
};

const fetchUserGroupInfo = async (userId: number, dispatch: any) => {
    try {
        const options: object = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        };

        const response: Response = await fetch(`${groupInfo}/${userId}`, options);

        if (!response.ok) {
            const res: any = await response.json();
            console.log(`Response was not okay with message: ${res.error}`);
            return;
        };

        //Update groupId and isIngroup
        const res: any = await response.json();
        dispatch(registerGroup());
        dispatch(setGroupId(res.groupId));
        dispatch(setUserRole(res.role));//sets user as owner of a group
        dispatch(setUserGroupName(res.name));
        return;
    }
    catch (error: any) {
        console.log(`Failed to fetch user's group information with error: ${error}`);
        return;
    };
};

const fetchGroupMembers = async (registeredGroupId: number, isInGroup: boolean, setGroupMembers: any) => {
    //User is not in a group or cannot find there groupId
    if (!isInGroup || !registeredGroupId) {
        return;
    };

    try {

        const options: object = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        };

        const response: Response = await fetch(`${partyMembers}/${registeredGroupId}`, options);

        if (!response.ok) {
            const res: any = await response.json();
            console.log(`Response was not okay with message: ${res.error}`);
            return;
        };

        //Update groupMembers to be the group members
        const res: any = await response.json();
        setGroupMembers(res.members);//updates setGroupMembers to be the group members
        return;
    }
    catch (error: any) {
        console.log(`Failed to fetch group members with error: ${error}`);
        return;
    };
};


/*
@params: userId -> fetchs the invites that a user has
*/
const fetchInvites = async (userId: number, setInvites: any, setInvitationsFetched: any) => {
    try {
        if (!userId) {
            console.log("No userId provided");
        }

        const options: object = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        };

        const response: Response = await fetch(`${inviteMember}/${userId}`, options);

        if (!response.ok) {
            const res: any = await response.json();
            console.log(`Response was not okay with message: ${res.error}`);
            return;
        };

        const res: any = await response.json();
        setInvites(res.invitesFormatted.length);
        //Now need to store all invites into useState
        let filterInvites: Array<Object> = []
        for (let i = 0; i < res.invitesFormatted.length; i++) {
            filterInvites.push({
                ownerName: res.invitesFormatted[i].ownerName,
                id: res.invitesFormatted[i].id,
                status: res.invitesFormatted[i].status,
                groupId: res.invitesFormatted[i].groupId,
                groupName: res.invitesFormatted[i].groupName,
                numberOfMembers: res.invitesFormatted[i].numberOfMembers
            });
        };
        setInvitationsFetched(filterInvites);//update
        return;
    }
    catch (error: any) {
        console.log(`Failed to fetch invites for user with error: ${error}`);
    };
};

export {
    createGroup,
    fetchUserGroupInfo,
    fetchGroupMembers,
    fetchInvites
};