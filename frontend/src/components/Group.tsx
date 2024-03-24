const createGroup = async (name: string, invitedUsers: Array<any>, userId: number) => {
    try {
        if (!userId || userId < 1) {
            console.log("UserId not found");
            return;
        };

        /*Create group*/
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

        const response: Response = await fetch('http://localhost:3001/party/create', options);

        if (!response.ok) {
            const error: any = await response.json();
            console.log(`Response was not okay with error: ${error}`);
            return;
        }

        const group = await response.json();
        console.log(group);

        if (invitedUsers.length > 0) {
            /*If there are members, invite each of them*/
            for (let i = 0; i < invitedUsers.length; i++) {
                /*Invite each member*/
                const options: object = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: invitedUsers[i].id,
                        groupId: group.groupId
                    })
                };

                const response: Response = await fetch('http://localhost:3001/party/invite', options);

                if (!response.ok) {
                    const error: any = await response.json();
                    console.log(`Response was not okay with error: ${error}`);
                    return;
                }

                const res = await response.json();
                console.log(`${res}, added multiple people to group`);
            }
        }
    }
    catch (error: any) {
        console.log(`Failed to fetch group API with error: ${error}`)
    };
};

export {
    createGroup
};