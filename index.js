var request = require('request');
var fs = require('fs');

var leagueUrl = require('./config.json').leagueUrl;
var proDataUrl = require('./config.json').proDataUrl;

var insertBefore = require('./utils/insert');
var slackRequest = require('./utils/slackRequest');

request(proDataUrl, function (err, resp, html) {
  if (err) {
    return console.error(err);
  }

  var seasonData = JSON.parse(html);
  var proTeams = seasonData.proTeams;
  var proPlayers = seasonData.proPlayers;

  leagueUrl = insertBefore(leagueUrl, '/api', '/league');

  request(leagueUrl, function (err, resp, html) {
    if (err) {
      return console.error(err);
    }

    var fileExist = false;
    var leagueData = JSON.parse(html);
    var lastRosterChange = leagueData.fantasyRosterUpdates;
    var fantasyTeams = leagueData.fantasyTeams;

    if (fs.existsSync('./lastRosterChange.json')) {
      fileExist = true;
      lastRosterChange = leagueData.fantasyRosterUpdates.reverse();
    }

    lastRosterChange.forEach(function (rosterChange) {
      if (fileExist) {
        var lastDate = new Date(rosterChange.time[0], rosterChange.time[1] - 1, rosterChange.time[2], rosterChange.time[3], rosterChange.time[4], rosterChange.time[5]);
        var previousRosterChange = JSON.parse(fs.readFileSync('./lastRosterChange.json', 'utf8')).time;
        var previousDate = new Date(previousRosterChange[0], previousRosterChange[1] - 1, previousRosterChange[2], previousRosterChange[3], previousRosterChange[4], previousRosterChange[5]);
      } else {
        fs.writeFileSync('./lastRosterChange.json', JSON.stringify(leagueData.fantasyRosterUpdates[0]));
        process.exit(0);
      }

      if (previousDate < lastDate && !rosterChange.addition) {
        fs.writeFileSync('./lastRosterChange.json', JSON.stringify(rosterChange));
        slackRequest(JSON.stringify(rosterChange));
      }
    });

  });
});
