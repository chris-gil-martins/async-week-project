const ACTIONS = {
  SET_AUTH: 'set-auth',
};

export const setAuth = (user) => ({
  type: ACTIONS.SET_AUTH,
  user,
});

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.SET_AUTH:
      return action.user;
    default:
      return state;
  }
};

export default authReducer;
