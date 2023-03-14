
const { network } = require("hardhat");
const { developementChains, networkConfig } = require("../helper-hardhat-config.js");
const { Decimals } = require("../helper-hardhat-config.js");
const { INITIAL_ANSWER } = require("../helper-hardhat-config.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  

  if (developementChains.includes(network.name)) {
    log ("local network detected! Deploying mocks...");
    await deploy ("MockV3Aggregator",{
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [Decimals, INITIAL_ANSWER],
    });
      
    log("Mocks Deployed");
    log("-----------------------------------------");

  }
};

module.exports.tags = ["all", "mocks"];
