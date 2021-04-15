const ACTIONS = {
  SET_USERS: 'set-users',
};

export const setUsers = (users) => ({
  type: ACTIONS.SET_USERS,
  users,
});

const userReducer = (state = [], action) => {
  switch (action.type) {
    case ACTIONS.SET_USERS:
      return action.users;
    default:
      return state;
  }
};

export default userReducer;
