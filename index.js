var request = require('request');
var fs = require('fs');

var leagueUrl = require('./config.json').leagueUrl;
var proDataUrl = require('./config.json').proDataUrl;

var insertBefore = require('./utils/insert');
var slackRequest = require('./utils/slackRequest');
var constructDataString = require('./utils/constructDataString');

/*
  Retrieve data about pro-player and pro-teams
 */
request(proDataUrl, function (err, resp, html) {
  if (err) {
    return console.error(err);
  }

  var seasonData = JSON.parse(html);
  var proTeams = seasonData.proTeams;
  var proPlayers = seasonData.proPlayers;

  leagueUrl = insertBefore(leagueUrl, '/api', '/league');

  /*
    Retrieve data about current fantasy league
   */
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

    /*
      previousRoster refer to the last saved roster change.
      last/rosterChange refer to the effective last roster change
     */
    lastRosterChange.forEach(function (rosterChange) {
      if (fileExist) {
        var lastDate = new Date(rosterChange.time[0], rosterChange.time[1] - 1, rosterChange.time[2], rosterChange.time[3], rosterChange.time[4], rosterChange.time[5]);
        var previousRosters = JSON.parse(fs.readFileSync('./lastRosterChange.json', 'utf8'));
        var previousRoster = previousRosters[rosterChange.addtion ? 'add' : 'drop'];
        var previousRosterChange = previousRoster.time;
        var previousDate = new Date(previousRosterChange[0], previousRosterChange[1] - 1, previousRosterChange[2], previousRosterChange[3], previousRosterChange[4], previousRosterChange[5]);
      } else {
        var add = leagueData.fantasyRosterUpdates[0].addition ? leagueData.fantasyRosterUpdates[0] : leagueData.fantasyRosterUpdates[1];
        var drop = leagueData.fantasyRosterUpdates[1].addition ? leagueData.fantasyRosterUpdates[0] : leagueData.fantasyRosterUpdates[1];
        fs.writeFileSync('./lastRosterChange.json', JSON.stringify({
          add: add,
          drop: drop,
        }));
        process.exit(0);
      }

      if (previousDate < lastDate) {
        var secondRoster = previousRosters[!rosterChange.addtion ? 'add' : 'drop'];
        var add = rosterChange.addition ? rosterChange : secondRoster;
        var drop = !rosterChange.addition ? rosterChange : secondRoster;
        fs.writeFileSync('./lastRosterChange.json', JSON.stringify({
          add: add,
          drop: drop,
        }));
        slackRequest(JSON.stringify(constructDataString(rosterChange, proPlayers, proTeams, leagueData)));
      }
    });

  });
});
