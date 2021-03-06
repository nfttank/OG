require('babel-register');
require('babel-polyfill');

const { infuraProjectId, mnemonic, etherscanApiKey } = require('./secrets.json');
const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(
        mnemonic, `https://rinkeby.infura.io/v3/${infuraProjectId}`
      ),
      network_id: 4,
      gas: 29000000,
      gasPrice: 10000000000, // 10 gwei
      skipDryRun: true
    },
    mainnet: {
      provider: () => new HDWalletProvider(
        mnemonic, `https://mainnet.infura.io/v3/${infuraProjectId}`
      ),
      network_id: 1,
      gas: 6200000,
      gasPrice: 60000000000, // 60 gwei
      skipDryRun: false
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: etherscanApiKey
  }
}
