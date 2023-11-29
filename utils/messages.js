const moment = require("moment");

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().formate("h:mm a"),
  };
}

module.exports = formatMessage;
