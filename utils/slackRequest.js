var request = require('request');
var slackHookUrl = require('../config.json').slackHookUrl;

module.exports = function (text) {
  request.post(slackHookUrl, { json: { text: text } },
  function (error, response, body) {
    if (error || response.statusCode != 200) {
      console.log(error);
    }
  });
};
