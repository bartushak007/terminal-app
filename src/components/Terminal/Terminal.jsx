import React from "react";
// import PropTypes from "prop-types";

import styles from "./terminal.module.css";
import useTerminal from "../../customHooks/useTerminal";

const Terminal = () => {
  const {
    onChangeHandler,
    submitHandler,
    fillInputFromHistory,
    terminalInput,
    history,
    isLoading,
  } = useTerminal();

  return (
    <>
      <div className={`${styles.history} ${isLoading ? styles.isLoading : ''}`}>
        <div className={styles.loader}/>
        {history.map(({ text, isCommand, hasError }, i) => (
          <pre
            className={
              hasError
                ? styles.errorInCommand
                : !hasError && isCommand
                ? styles.successCommand
                : ""
            }
            key={i}
          >
            {isCommand ? "> " : " "}
            {text}
          </pre>
        ))}
        <form
          onKeyDown={fillInputFromHistory}
          onSubmit={submitHandler}
          className={styles.commandLineForm}
        >
          $
          <input
            className={styles.commandLine}
            type="text"
            value={terminalInput}
            onChange={onChangeHandler}
          />
        </form>
      </div>
    </>
  );
};

// Terminal.propTypes = {
//   history: PropTypes.arrayOf(
//     PropTypes.shape({
//       text: PropTypes.string.isRequired,
//       hasError: PropTypes.boolean,
//       isCommand: PropTypes.boolean,
//     })
//   ).isRequired,
//   submitHandler: PropTypes.func,
//   terminalInput: PropTypes.string,
//   onChangeHandler: PropTypes.func,
//   fillInputFromHistory: PropTypes.func,
// };

export default Terminal;
