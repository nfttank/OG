module.exports = function(deployer) {

  let gotToken = artifacts.require("GotToken")
  let ogColor = artifacts.require("OGColor")
  let digits = artifacts.require("Digits")
  let customizer = artifacts.require("Customizer")
  let og = artifacts.require("OG")
  let ogStats = artifacts.require("OGStats")

  deployer.deploy(digits)
  deployer.deploy(customizer)

  deployer.link(digits, og)
  deployer.link(customizer, og)

  deployer.deploy(og)
  deployer.deploy(gotToken)
  deployer.deploy(ogColor)
  deployer.deploy(ogStats)
};
