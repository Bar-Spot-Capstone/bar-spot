import { registerGroup, setGroupId } from "../state/slices/groupSlice";
import { partyCreate } from "../types/fetchCall";

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
        return;
    }
    catch (error: any) {
        console.log(`Failed to fetch group API with error: ${error}`)
    };
};

export {
    createGroup
};