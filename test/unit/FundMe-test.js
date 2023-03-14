const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developementChains } = require("../../helper-hardhat-config");

!developementChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let FundMe;
      let deployer;
      let MockV3Aggregator;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach(async function () {
        //const { deployer } = (await getNamedAccounts()).deployer;
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        FundMe = await ethers.getContract("FundMe", deployer);
        MockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", async function () {
        it("set the constructor correctly", async function () {
          const response = await FundMe.getPriceFeed();
          assert.equal(response, MockV3Aggregator.address);
        });
      });

      describe("fund", async function () {
        it("failed if you don't send enough money", async function () {
          await expect(FundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });
      });

      it("updated the amount funded data structure", async function () {
        await FundMe.fund({ value: sendValue });
        const response = await FundMe.getaddressToAmountFunded(deployer);
        assert.equal(response.toString(), sendValue.toString());
      });

      it("add funder to the array", async function () {
        await FundMe.fund({ value: sendValue });
        const funder = await FundMe.getFunders(0);
        assert.equal(funder, deployer);
      });

      describe("withraw", async function () {
        beforeEach(async () => {
          await FundMe.fund({ value: sendValue });
        });

        it("withdraws ETH from a single funder", async () => {
          // Arrange
          const startingFundMeBalance = await FundMe.provider.getBalance(
            FundMe.address
          );
          const startingDeployerBalance = await FundMe.provider.getBalance(
            deployer
          );

          // Act
          const transactionResponse = await FundMe.withraw();
          const transactionReceipt = await transactionResponse.wait();
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const endingFundMeBalance = await FundMe.provider.getBalance(
            FundMe.address
          );
          const endingDeployerBalance = await FundMe.provider.getBalance(
            deployer
          );

          // Assert
          // Maybe clean up to understand the testing
          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );
        });

        it(" withdraw with multiple getFunders", async function () {
          const accounts = await ethers.getSigners();
          for (let i = 1; i < 6; i++) {
            const FundMeConnectedContract = await FundMe.connect(accounts[i]);
            await FundMeConnectedContract.fund({ value: sendValue });
          }
        });

        it("Only allows the owner to withdraw", async function () {
          const accounts = await ethers.getSigners();
          const FundMeConnectedContract = await FundMe.connect(accounts[1]);
          await expect(
            FundMeConnectedContract.withraw()
          ).to.be.revertedWithCustomError(FundMe, "FundMe__NotOwner");
        });

        it("CheaperWithraw with multiple funders", async function () {
          const transactionResponse = await FundMe.cheaperWithraw();
          const transactionReceipt = await transactionResponse.wait();
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const endingFundMeBalance = await FundMe.provider.getBalance(
            FundMe.address
          );
          const endingDeployerBalance = await FundMe.provider.getBalance(
            deployer
          );

          const accounts = await ethers.getSigners();
          for (i = 1; i < 6; i++) {
            const connectAccounts = await FundMe.connect(accounts[i]);
            await connectAccounts.fund({ value: sendValue });
          }
        });
      });
    });
