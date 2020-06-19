import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkIsCommandFull, renderExpensesString } from "../helpers";
import {
  historySelector,
  updateHistory,
  getCurrencies,
  loadingSelector,
  currenciesSelector,
  updateExpenses,
  expensesSelector,
} from "../reducers/terminalReducer";
import { object } from "prop-types";

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
  const expenses = useSelector(expensesSelector);
  const setHistory = (payload) => dispatch(updateHistory(payload));
  const onChangeHandler = ({ target: { value } }) => setTerminalInput(value);

  const dispatchUpdateExpenses = ([_, date, amount, currency, ...title]) => {
    dispatch(
      updateExpenses({
        date,
        amount,
        currency,
        title: title.join(" "),
      })
    );
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const commandsList = terminalInput.split(" ");
    let hasError = false;

    switch (commandsList[0].toLowerCase()) {
      case "add": {
        hasError = !checkIsCommandFull(
          commandsList,
          ["add", "list"],
          currencies
        );
        dispatchUpdateExpenses(commandsList);
        break;
      }
      case "list": {
        setHistory({
          text: Object.values(expenses)
            .map((expenses) => expenses.map(renderExpensesString).join(" "))
            .join(" "),
        });

        break;
      }

      case "clear": {
        break;
      }

      default:
        hasError = true;
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
