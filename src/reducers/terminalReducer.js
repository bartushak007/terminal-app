import { handleActions, createAction } from "redux-actions";
import { all, call, put, takeEvery, select } from "redux-saga/effects";

const REDUCER_NAME = "terminal";

const UPDATE_HISTORY = "UPDATE_HISTORY";
const GET_CURRENCIES = "GET_CURRENCIES";
const SET_CURRENCIES = "SET_CURRENCIES";
const SET_SUCCESS = "SET_SUCCESS";
const UPDATE_EXPENSES = "UPDATE_EXPENSES";

export const updateHistory = createAction(UPDATE_HISTORY);
export const getCurrencies = createAction(GET_CURRENCIES);
export const setCurrencies = createAction(SET_CURRENCIES);
export const setSuccess = createAction(SET_SUCCESS);
export const updateExpenses = createAction(UPDATE_EXPENSES);

const initialState = {
  history: [],
  currencies: [],
  load: false,
  expenses: {},
};

export default handleActions(
  {
    [updateHistory]: (state, { payload }) => ({
      ...state,
      history: [...state.history, payload],
    }),
    [getCurrencies]: (state) => ({
      ...state,
      load: true,
    }),
    [setCurrencies]: (state, { payload }) => ({
      ...state,
      currencies: payload,
    }),
    [setSuccess]: (state) => ({
      ...state,
      load: false,
    }),
    [updateExpenses]: (state, { payload }) => ({
      ...state,
      expenses: {
        ...state.expenses,
        [payload.date]: [...(state.expenses[payload.date] || []), payload],
      },
    }),
  },
  initialState
);

export const historySelector = (state) => state[REDUCER_NAME].history;
export const loadingSelector = (state) => state[REDUCER_NAME].load;
export const currenciesSelector = (state) => state[REDUCER_NAME].currencies;
export const expensesSelector = (state) => state[REDUCER_NAME].expenses;

function* getCurrenciesSaga() {
  try {
    const response = yield call(
      fetch,
      "http://data.fixer.io/api/latest?access_key=f0ba8e209927e01e8bfa04b63dbf37fc&format=1"
    );
    const { rates } = yield response.json();

    yield put(setCurrencies(Object.keys(rates)));
  } catch (e) {
    yield put(
      updateHistory({
        text: "fetch error http://data.fixer.io/api/latest",
        error: true,
      })
    );
  }
  yield put(setSuccess());
}

export function* saga() {
  yield all([takeEvery(GET_CURRENCIES, getCurrenciesSaga)]);
}
