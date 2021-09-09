var vegascoin = artifacts.require("./TokenMintERC20MintableToken.sol");

const name = "VegasCoins.io"
const symbol = 'VCoins'
const decimals = 18
const initialSupply = 2000000000
const feeReceiver = '0x5807c6ecb0AB413816f7C90f0e5C2974bDF89fc3'
const tokenOwnerAddress = '0xebf6168C84C112E78fA437AB9F3Ec3aEa97c97f0'

module.exports = function(deployer) {
  deployer.deploy(vegascoin, name, symbol, decimals, initialSupply, feeReceiver, tokenOwnerAddress); // 1M total supply 
};