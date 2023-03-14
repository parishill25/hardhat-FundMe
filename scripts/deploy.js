
const {ethers, getNamedAccounts}=require("hardhat")


module.exports= async ({getNamedAccounts,deployments})=>{
    const {deploy,log}=deployments
    const {deployer}=await getNamedAccountss
    const chainId=network.config.chainId
}