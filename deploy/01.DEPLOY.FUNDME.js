const { networkConfig } = require("../helper-hardhat-config.js");
const { network } = require("hardhat");
const { developementChains } = require("../helper-hardhat-config.js");

const { networks } = require("../helper-hardhat-config.js");
const { verify } = require("../utils/verify.js");


function deployFund() {
  console.log("hi");
}

//const EthUsdPriceFeedAddress = networkconfig[chainId]["ethUsdPriceFedd"];

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeed;

  if (developementChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeed = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeed = networkConfig[chainId]["EthUsdPriceFeed"];
  }

  log("----------------------------------------------------")
  log("Deploying FundMe and waiting for confirmations...")

  const args= [ethUsdPriceFeed]
  const FundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations:network.config.blockConfirmations || 1,
  });
  
  if (
    !developementChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(FundMe.address,args)
  
  }
  
};

console.log("network.name:", network.name);
console.log("developementChains.includes(network.name):", developementChains.includes(network.name));
console.log("process.env.ETHERSCAN_API_KEY:",process.env.ETHERSCAN_API_KEY);


module.exports.tags = ["all", "FundMe"];
