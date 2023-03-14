



const {ethers,getNamedAccounts} = require("hardhat")



async function main() {
  const { deployer } = await getNamedAccounts();
  const FundMe = await ethers.getContract("FundMe", deployer);
  const contractResponse = await FundMe.withraw(
    ethers.utils.parseEther("0.1")
  );
await contractResponse.wait("1")
console.log("FundMe..........")

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
