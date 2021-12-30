const { assert } = require('chai')

const OG = artifacts.require('./contracts/OG.sol')
const OGColor = artifacts.require('./contracts/OGColor.sol')

function calceth(gasGwei) { 
  return (gasGwei * 100 /* gas price */) / 1000000000 
}

function logGas(action, gasGwei) {
  console.log('    > ' + action + ': gas estimate ' + calceth(gasGwei) + "ETH (" + gasGwei + " gwei)")
}

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Gas estimates', (accounts) => {
  let ogContract
  let ogColorContract

  before(async () => {
    ogContract = await OG.deployed()
    ogColorContract = await OGColor.deployed()
  })

  describe('OG', async () => {
    it('gas estimates', async () => {
      logGas("pause true", await ogContract.setPaused.estimateGas(true))
      logGas("pause false", await ogContract.setPaused.estimateGas(false))
      logGas("mint 1", await ogContract.mint.estimateGas([1]))
      logGas("mint 5", await ogContract.mint.estimateGas([2,3,4,5,6]))
      logGas("mint 10", await ogContract.mint.estimateGas([7,8,9,10,11,12,13,14,15,16]))
      logGas("add supported collection", await ogContract.addSupportedCollection.estimateGas('0xc256A0467EcCce3391a0c1c02bD8151337196482'))
      logGas("clear supported collection", await ogContract.clearSupportedCollections.estimateGas())
      logGas("set supported collection slug 10 chars", await ogContract.setSupportedCollectionSlug.estimateGas('0xc256A0467EcCce3391a0c1c02bD8151337196482', 'MTIzNDU2Nzg5MA=='))
      logGas("set supported collection slug 200 chars", await ogContract.setSupportedCollectionSlug.estimateGas('0xc256A0467EcCce3391a0c1c02bD8151337196482', 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTA='))
      logGas("set custom 10 chars", await ogContract.setCustom.estimateGas(1, 'MTIzNDU2Nzg5MA=='))
      logGas("reset custom", await ogContract.resetCustom.estimateGas(1))
      logGas("set trusted contracts", await ogContract.setTrustedogContractAddresses.estimateGas('0xc256A0467EcCce3391a0c1c02bD8151337196482', '0xEc7CaAe7738a5B64e98Dc9FF3566D2ca2503aE21'))
    })
  })

  describe('OGColor', async () => {
    it('gas estimates', async () => {

      await ogColorContract.mint('back', '#FFFFFF');

      logGas("mint", await ogColorContract.mint.estimateGas('back', '#FFFFFF'))
      logGas("transfer", await ogColorContract.transferFrom.estimateGas(accounts[0], accounts[1], 1))
    })
  })
})