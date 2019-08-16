import moment from "moment";

/**
 * Adds a 0 in case the length is smaller than the given length. number is not allowed to be null/undefined,
 * length is not allowed to be null/undefined or its value below 2, else the return will be set to "00"
 * source : https://stackoverflow.com/questions/1091372/getting-the-clients-timezone-in-javascript
 */
export function pad(number, length) {
  if (number === null || number === undefined || length === null || length < 2) {
    throw new Error("number or length was null or length smaller than 2");
  } else {
    var str = "" + number;
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  }
}

/**
 * Gets the current timezone from the users device. Should return a string with the format "+-hh:mm"
 * source : https://stackoverflow.com/questions/1091372/getting-the-clients-timezone-in-javascript
 */
export function getTimezone() {
  //get timezone
  var offset = new Date().getTimezoneOffset();
  //format
  offset = (offset < 0 ? "+" : "-") + pad(parseInt(Math.abs(offset / 60)), 2) + ":" + pad(Math.abs(offset % 60), 2);
  //return
  return offset;
}

/**
 * Gets the current date and time in a fhir format
 */
export function getTimestamp() {
  return moment().format();
}

export default {
  pad,
  getTimezone,
  getTimestamp
};
