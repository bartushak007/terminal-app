import React, { useState } from "react";

import { checkIsCommandValid } from "../../helpers";

import Terminal from "../../components/Terminal";

function App() {
  const [terminalInput, setTerminalInput] = useState("");
  const [history, setHistory] = useState([]);

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
    setHistory([
      ...history,
      { text: terminalInput, isCommand: true, hasError },
    ]);
    setTerminalInput("");
  };

  const fillInputFromHistory = (e) => {
    e.keyCode === 38 &&
      setTerminalInput(history[history.length - 1].text);
  }

  return (
    <Terminal
      {...{
        history,
        submitHandler,
        terminalInput,
        onChangeHandler,
        setTerminalInput,
        fillInputFromHistory
      }}
    />
  );
}

export default App;
