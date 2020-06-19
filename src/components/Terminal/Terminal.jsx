import React from "react";
import PropTypes from "prop-types";

import styles from "./terminal.module.css";

const Terminal = ({
  history,
  submitHandler,
  terminalInput,
  onChangeHandler,
  fillInputFromHistory,
}) => (
  <>
    <div className={styles.history}>
      {history.map(({ text, isCommand, hasError }, i) => (
        <p
          className={
            hasError
              ? styles.errorInCommand
              : !hasError && isCommand
              ? styles.successCommand
              : ""
          }
          key={i}
        >
          {isCommand ? "> " : "-- "}
          {text}
        </p>
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

Terminal.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      hasError: PropTypes.boolean,
      isCommand: PropTypes.boolean,
    })
  ).isRequired,
  submitHandler: PropTypes.func,
  terminalInput: PropTypes.string,
  onChangeHandler: PropTypes.func,
  fillInputFromHistory: PropTypes.func,
};

export default Terminal;
