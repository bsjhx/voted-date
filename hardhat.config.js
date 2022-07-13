require('@nomiclabs/hardhat-waffle');
require('solidity-coverage');
require('@nomiclabs/hardhat-solhint');
require('@openzeppelin/hardhat-upgrades');

module.exports = {
  solidity: {
    compilers: [
      { version: "0.6.0" },
      { version: "0.8.4" }
    ]
  }
};
