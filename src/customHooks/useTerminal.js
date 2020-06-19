import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkIsCommandValid } from "../helpers";
import { historySelector, updateHistory } from "../reducers/terminalReducer";

const useTerminal = () => {
  const dispatch = useDispatch();
  const [terminalInput, setTerminalInput] = useState("");
  const history = useSelector(historySelector);

  const setHistory = (payload) => dispatch(updateHistory(payload));
  const onChangeHandler = ({ target: { value } }) => setTerminalInput(value);

  const submitHandler = (e) => {
    e.preventDefault();

    const commandsList = terminalInput.split(" ");
    const hasError = !checkIsCommandValid(commandsList, ["list"]);

    switch (commandsList[0].toLowerCase()) {
      case "list": {
        // console.log("good");
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
  };
};

export default useTerminal;
