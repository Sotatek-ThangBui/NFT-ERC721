require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const {api_key, private_key, mnemonic, etherscan_api_key} = process.env;
module.exports = {
  solidity: "0.8.4",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${api_key}`,
      accounts: [`0x${private_key}`],
    },
    hardhat: {
      chainId: 4,
      accounts:{mnemonic: mnemonic}
    },
  },
  etherscan: {
    apiKey: etherscan_api_key,
  }
};
