// const baseURL = "https://barspot-server.onrender.com";
const baseURL = "http://localhost:3001";

const partyCreate = `${baseURL}/party/create`;
const userRegister = `${baseURL}/user/register`;
const userLogin = `${baseURL}/user/login`;
const fetchPubs = `${baseURL}/yelp/pubs`;
const getFav = `${baseURL}/favorite/get`;
const deleteFav = `${baseURL}/favorite/delete`;
const groupInfo = `${baseURL}/party/group/info`;
const partyMembers = `${baseURL}/party/members`;
const inviteMember = `${baseURL}/invite`;
const userInvResponse = `${baseURL}/invite/respond`;
const allOtherUsers = `${baseURL}/user/all`;
const partyLeave = `${baseURL}/party/leave`;
const partyDelete = `${baseURL}/party/delete`;

export {
    partyCreate,
    userRegister,
    userLogin,
    fetchPubs,
    getFav,
    deleteFav,
    groupInfo,
    partyMembers,
    inviteMember,
    userInvResponse,
    allOtherUsers,
    partyLeave,
    partyDelete
};