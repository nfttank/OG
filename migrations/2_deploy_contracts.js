module.exports = function(deployer) {

  let GotToken = artifacts.require("GotToken")
  let OGColor = artifacts.require("OGColor")
  let Stringify = artifacts.require("Stringify")
  let Base64 = artifacts.require("Base64")
  let DigitsPaths = artifacts.require("DigitsPaths")
  let OG = artifacts.require("OG")

  deployer.deploy(GotToken)
  deployer.deploy(OGColor)

  deployer.deploy(Stringify)
  deployer.deploy(Base64)
  deployer.deploy(DigitsPaths)
  deployer.link(Stringify, OG)
  deployer.link(Base64, OG)
  deployer.link(DigitsPaths, OG)
  deployer.deploy(OG)
};
