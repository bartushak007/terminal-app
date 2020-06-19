import { all } from "redux-saga/effects";
import { saga as termianalSaga } from "../reducers/terminalReducer";

export default function* rootSaga() {
  yield all([termianalSaga()]);
}
