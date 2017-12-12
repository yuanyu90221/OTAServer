const INIT_UPDATE_CMD = '80500108'
const INIT_UPDATE_CMD_PAD = '00'
const otaManager = {
  // first challenge create into db
  genChallenge: (cwid) => {
    // do Fake challenge
    return INIT_UPDATE_CMD + cwid + INIT_UPDATE_CMD_PAD
  }
}

module.exports.otaManager = otaManager