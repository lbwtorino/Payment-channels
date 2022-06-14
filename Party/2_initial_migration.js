const TestSig = artifacts.require("TestSig");

module.exports = function(deployer) {
  deployer.deploy(TestSig);
};
