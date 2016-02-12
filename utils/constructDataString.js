var getTargetNameById = function (stack, needle) {
  var ret = '';
  stack.forEach(function (element) {
    if (element.id == needle) {
      ret =  element.name;
      return;
    }
  });

  return ret;
};

var getSummonerNameById = function (stack, needle) {
  return stack[needle].summonerName;
};

module.exports = function (rawData, proPlayers, proTeams, leagueData) {
  var targetName = getTargetNameById(rawData.targetType == 'team' ? proTeams : proPlayers, rawData.targetId);
  var summonerName = getSummonerNameById(leagueData.fantasyTeams, rawData.fantasyTeamId);

  return (summonerName + (rawData.addition ? ' ADD ' : ' DROP ') + targetName);

};
