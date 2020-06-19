import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkIsCommandValid } from "../helpers";
import {
  historySelector,
  updateHistory,
  getCurrencies,
  loadingSelector,
  currenciesSelector,
  updateExpenses,
  expensesSelector,
} from "../reducers/terminalReducer";

const useTerminal = () => {
  const dispatch = useDispatch();
  const getCurrenciesEffect = () => {
    dispatch(getCurrencies());
  };
  useEffect(getCurrenciesEffect, []);

  const [terminalInput, setTerminalInput] = useState("");
  const history = useSelector(historySelector);
  const isLoading = useSelector(loadingSelector);
  const currencies = useSelector(currenciesSelector);

  const setHistory = (payload) => dispatch(updateHistory(payload));
  const onChangeHandler = ({ target: { value } }) => setTerminalInput(value);

  const dispatchUpdateExpenses = ([_, date, amount, currency, ...title]) => {
    dispatch(
      updateExpenses({
        date,
        amount,
        currency,
        title: title.join(' '),
      })
    );
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const commandsList = terminalInput.split(" ");
    const hasError = !checkIsCommandValid(commandsList, ["add"], currencies);

    switch (commandsList[0].toLowerCase()) {
      case "add": {
        dispatchUpdateExpenses(commandsList);
        break;
      }
      default:
        console.log("wrong commands");
    }
    setHistory({ text: terminalInput, isCommand: true, hasError });
    setTerminalInput("");
  };

  const fillInputFromHistory = (e) => {
    e.keyCode === 38 && setTerminalInput(history[history.length - 1].text);
  };
  return {
    setHistory,
    onChangeHandler,
    submitHandler,
    fillInputFromHistory,
    terminalInput,
    setTerminalInput,
    history,
    isLoading,
    currencies,
  };
};

export default useTerminal;
