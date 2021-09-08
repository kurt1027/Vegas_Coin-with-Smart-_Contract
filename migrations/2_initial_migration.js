var vegascoin = artifacts.require("./TokenMintERC20MintableToken.sol");

const name = "VegasCoins.io"
const symbol = 'VCoins'
const decimals = 18
const initialSupply = 2000000000
const feeReceiver = '0x5807c6ecb0AB413816f7C90f0e5C2974bDF89fc3'
const tokenOwnerAddress = '0x91E29C4eA534B122c32D605ed9304adDA64B021C'

module.exports = function(deployer) {
  deployer.deploy(vegascoin, name, symbol, decimals, initialSupply, feeReceiver, tokenOwnerAddress); // 1M total supply 
};