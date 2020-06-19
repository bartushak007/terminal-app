import React from "react";
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

export default Terminal;
