const ACTIONS = {
  SET_SNIPPETS: 'set-snippets',
};

export const setSnippets = (snippets) => ({
  type: ACTIONS.SET_SNIPPETS,
  snippets,
});

const snippetReducer = (state = [], action) => {
  switch (action.type) {
    case ACTIONS.SET_SNIPPETS:
      return action.snippets;
    default:
      return state;
  }
};

export default snippetReducer;
