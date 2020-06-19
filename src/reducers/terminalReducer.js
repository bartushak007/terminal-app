import { handleActions, createAction } from "redux-actions";
import { all, call, put, takeEvery, select, delay } from "redux-saga/effects";
import { renderExpensesString } from "../helpers";
import moment from "moment";

const REDUCER_NAME = "terminal";

const UPDATE_HISTORY = "UPDATE_HISTORY";
const GET_CURRENCIES = "GET_CURRENCIES";
const SET_CURRENCIES = "SET_CURRENCIES";
const SET_SUCCESS = "SET_SUCCESS";
const UPDATE_EXPENSES = "UPDATE_EXPENSES";
const CLEAR_EXPENSES = "CLEAR_EXPENSES";

export const updateHistory = createAction(UPDATE_HISTORY);
export const getCurrencies = createAction(GET_CURRENCIES);
export const setCurrencies = createAction(SET_CURRENCIES);
export const setSuccess = createAction(SET_SUCCESS);
export const updateExpenses = createAction(UPDATE_EXPENSES);
export const clearExpenses = createAction(CLEAR_EXPENSES);

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
    [updateExpenses]: (state, { payload }) => {      
      return {
        ...state,
        expenses: {
          ...state.expenses,
          [payload.date]: [...(state.expenses[payload.date] || []), payload],
        },
      };
    },
    [clearExpenses]: (state, { payload }) => {
      const clearedExpensesEntries = Object.entries(state.expenses).filter(
        ([key]) =>
          moment(key).format("YYYY-MM-DD") !==
          moment(payload).format("YYYY-MM-DD")
      );

      return {
        ...state,
        expenses: Object.fromEntries(clearedExpensesEntries),
      };
    },
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

function* updateHistoryByKeySaga({ payload: { date, title } }) {
  const data = yield select(expensesSelector);
  const expensesByDate = data[date];

  yield delay(0)
  yield put(
    updateHistory({
      text: expensesByDate.map(renderExpensesString).join(" "),
    })
  );
}

function* updateHistorySaga() {
  const expenses = yield select(expensesSelector);
  
  yield delay(0)
  yield put(
    updateHistory({
      text: Object.values(expenses)
        .map((expenses) => expenses.map(renderExpensesString).join(" "))
        .join(" "),
    })
  );
}

export function* saga() {
  yield all([
    takeEvery(GET_CURRENCIES, getCurrenciesSaga),
    takeEvery(UPDATE_EXPENSES, updateHistoryByKeySaga),
    takeEvery(CLEAR_EXPENSES, updateHistorySaga),
  ]);
}
