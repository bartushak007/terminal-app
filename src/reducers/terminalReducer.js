import { handleActions, createAction } from "redux-actions";

const REDUCER_NAME = "terminal";

const UPDATE_HISTORY = "UPDATE_HISTORY";

export const updateHistory = createAction(UPDATE_HISTORY);

const initialState = {
  history: [],
};

export default handleActions(
  {
    [updateHistory]: (state, {payload}) => ({
      ...state,
      history: [...state.history, payload],
    }),
  },
  initialState
);

export const historySelector = (state) => state[REDUCER_NAME].history;
