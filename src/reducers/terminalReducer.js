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
const GET_TOTAL = "GET_TOTAL";

export const updateHistory = createAction(UPDATE_HISTORY);
export const getCurrencies = createAction(GET_CURRENCIES);
export const setCurrencies = createAction(SET_CURRENCIES);
export const setSuccess = createAction(SET_SUCCESS);
export const updateExpenses = createAction(UPDATE_EXPENSES);
export const clearExpenses = createAction(CLEAR_EXPENSES);
export const getTotal = createAction(GET_TOTAL);

const initialState = {
  history: [],
  currencies: ["EUR", "PLN", "USD", "UAH", "RUB"],
  rates: {
    EUR: 1,
    PLN: 4.463731,
    USD: 1.117735,
    UAH: 29.88044,
    RUB: 77.598202,
  },
  baseValute: "EUR",
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
      currencies: payload.currencies,
      rates: payload.rates,
      baseValute: payload.base,
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
    [getTotal]: (state) => ({
      ...state,
    }),
  },
  initialState
);

export const historySelector = (state) => state[REDUCER_NAME].history;
export const loadingSelector = (state) => state[REDUCER_NAME].load;
export const currenciesSelector = (state) => state[REDUCER_NAME].currencies;
export const expensesSelector = (state) => state[REDUCER_NAME].expenses;
export const ratesSelector = (state) => state[REDUCER_NAME].rates;

function* getCurrenciesSaga() {
  try {
    const response = yield call(
      fetch,
      "http://data.fixer.io/api/latest?access_key=f0ba8e209927e01e8bfa04b63dbf37fc&format=1"
    );
    const { rates, base } = yield response.json();

    yield put(setCurrencies({ currencies: Object.keys(rates), rates, base }));
  } catch (e) {
    yield put(
      updateHistory({
        text: "fetch error http://data.fixer.io/api/latest\n available default currencies EUR, PLN, USD, UAH, RUB as of June 20, 2020",
        error: true,
      })
    );
  }
  yield put(setSuccess());
}

function* updateHistoryByKeySaga({ payload: { date, title } }) {
  const data = yield select(expensesSelector);
  const expensesByDate = data[date];

  yield delay(0);
  yield put(
    updateHistory({
      text: expensesByDate.map(renderExpensesString).join(" "),
    })
  );
}

function* updateHistorySaga() {
  const expenses = yield select(expensesSelector);

  yield delay(0);
  yield put(
    updateHistory({
      text: Object.values(expenses)
        .sort(([{ date: a }], [{ date: b }]) => {
          return moment(a).valueOf() - moment(b).valueOf();
        })
        .map((expenses) => expenses.map(renderExpensesString).join(" "))
        .join(" "),
    })
  );
}

function* getTotalSaga({ payload }) {
  const expenses = yield select(expensesSelector);
  const rates = yield select(ratesSelector);
  const expensesArray = Object.values(expenses);

  const splitedMoneyByCurrency = expensesArray
    .reduce((accArr, expensesInner) => [...accArr, ...expensesInner], [])
    .reduce((amountsObject, { amount, currency }) => {
      const upperCaseCurrency = currency.toUpperCase();
      return {
        ...amountsObject,
        [upperCaseCurrency]: +(amountsObject[upperCaseCurrency] || 0) + +amount,
      };
    }, {});

  const totalInBaseValute = Object.entries(splitedMoneyByCurrency).reduce(
    (sum, [key, amount]) => sum + amount / rates[key],
    0
  );

  const total = totalInBaseValute * rates[payload];

  yield delay(0);
  yield put(
    updateHistory({
      text: `Total ${total} ${payload}`,
    })
  );

  // to expensive feature :)
  // const promisesArr = Object.entries(
  //   splitedMoneyByCurrency
  // ).map(([key, amount]) =>
  //   fetch(
  //     `http://data.fixer.io/api/convert?access_key=f0ba8e209927e01e8bfa04b63dbf37fc&from=${key}&to=${payload}&amount=${amount}`
  //   ).then((res) => res.json())
  // );
}

export function* saga() {
  yield all([
    takeEvery(GET_CURRENCIES, getCurrenciesSaga),
    takeEvery(UPDATE_EXPENSES, updateHistorySaga),
    takeEvery(CLEAR_EXPENSES, updateHistorySaga),
    takeEvery(GET_TOTAL, getTotalSaga),
  ]);
}
