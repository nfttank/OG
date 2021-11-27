module.exports = function(deployer) {
  deployer.deploy(artifacts.require("GotToken"));
  deployer.deploy(artifacts.require("OGColor"));
  deployer.deploy(artifacts.require("OG"));
};
