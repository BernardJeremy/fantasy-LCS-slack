module.exports = function (rawData1, rawData2) {
  if (rawData1.time == rawData2.time) {
    if (rawData1.fantasyTeamId == rawData2.fantasyTeamId) {
      if (rawData1.targetId == rawData2.targetId) {
        return true;
      }
    }
  }

  return false;
};
