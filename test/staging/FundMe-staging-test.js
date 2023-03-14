const { getNamedAccounts, ethers } = require("hardhat");
const { assert } = require("chai");
const { developementChains } = require("../../helper-hardhat-config");

developementChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let FundMe;
      let deployer;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach(async function () {
        const deployer = (await getNamedAccounts()).deployer;
        FundMe = await ethers.getContract("FundMe", deployer);
      });

      it("allow people to fund and withraw", async function () {
        await FundMe.fund({ value: sendValue });
        await FundMe.withraw();
        const endingBalance = await ethers.provider.getBalance(FundMe.address);
        assert.equal(endingBalance.toString(), "0");
      });
    });
