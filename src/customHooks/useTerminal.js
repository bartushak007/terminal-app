import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { checkIsCommandFull, renderExpensesString } from "../helpers";
import {
  historySelector,
  updateHistory,
  getCurrencies,
  loadingSelector,
  currenciesSelector,
  updateExpenses,
  expensesSelector,
  clearExpenses,
  getTotal,
} from "../reducers/terminalReducer";

const useTerminal = () => {
  const dispatch = useDispatch();
  const [terminalInput, setTerminalInput] = useState("");

  function getCurrenciesEffect() {
    dispatch(getCurrencies());
  }
  useEffect(getCurrenciesEffect, []);

  const history = useSelector(historySelector);
  const isLoading = useSelector(loadingSelector);
  const currencies = useSelector(currenciesSelector);
  const expenses = useSelector(expensesSelector);

  const setHistory = (payload) => dispatch(updateHistory(payload));

  const onChangeHandler = ({ target: { value } }) => setTerminalInput(value);

  const dispatchUpdateExpenses = ([_, date, amount, currency, ...title]) => {
    dispatch(
      updateExpenses({
        date: moment(date).format("YYYY-MM-DD"),
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
        !hasError && dispatchUpdateExpenses(commandsList);
        break;
      }
      case "list": {
        setTimeout(
          () =>
            setHistory({
              text: Object.values(expenses)
                .map((expenses) => expenses.map(renderExpensesString).join(" "))
                .join(" "),
            }),
          0
        );

        break;
      }

      case "clear": {
        if (
          expenses[moment(commandsList[1].toLowerCase()).format("YYYY-MM-DD")]
        ) {
          dispatch(clearExpenses(commandsList[1].toLowerCase()));
        } else {
          hasError = true;
        }
        break;
      }

      case "total": {
        if (currencies.includes(commandsList[1].toUpperCase())) {
          dispatch(getTotal(commandsList[1].toUpperCase()));
        } else {
          hasError = true;
        }
        break;
      }

      default:
        hasError = true;
    }
    setHistory({ text: terminalInput, isCommand: true, hasError });
    setTerminalInput("");
  };

  const fillInputFromHistory = (e) => {
    const onlyCommands = history.filter(
      ({ isCommand, hasError }) => isCommand && !hasError
    );

    if (e.keyCode === 38 && onlyCommands.length) {
      onlyCommands[onlyCommands.length - 1] &&
        setTerminalInput(onlyCommands[onlyCommands.length - 1].text);
    }
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
