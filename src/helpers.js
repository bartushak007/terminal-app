import moment from "moment";

export const checkIsCommandValid = (
  commandsList,
  evailableCommands,
  currencies
) => {
  try {
    return !!(
      evailableCommands.some((e) => e === commandsList[0].toLowerCase()) && // does command exist
      moment(commandsList[1].toLowerCase()).isValid() && // moment
      /^[\d]*[.]?[\d]*$/.test(commandsList[2].toLowerCase()) && // number
      currencies.includes(commandsList[3].toUpperCase()) && // currency
      commandsList[4].toLowerCase()
    ); // not empty
  } catch (err) {
    return false;
  }
};
