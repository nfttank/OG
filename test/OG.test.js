const { assert } = require('chai')

const OG = artifacts.require('./contracts/OG.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('OG', (accounts) => {
  let contract

  before(async () => {
    contract = await OG.deployed()
    await contract.setTrustedContractAddresses('0xc256A0467EcCce3391a0c1c02bD8151337196482', '0xEc7CaAe7738a5B64e98Dc9FF3566D2ca2503aE21') // these are fake, just set so that renderSvg() works
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      console.log('Deployed to address', address)
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe('custom digit replacements', async () => {
    it('is not used when not set', async () => {
      const svg = await contract.renderSvg(1)
      assert.include(svg, 'M 0 0 L 0 77.843 L 50.921 77.843 L 50.921 343.5 L 143.459 343.5 L 143.459') // part of the path of "1"
    })

    it('is used when set', async () => {
      await contract.setCustom(1, 'Y3VzdG9t') // "custom" in BASE64
      const svg = await contract.renderSvg(1)
      assert.include(svg, 'custom') // part of the path of "1"
    })

    it('is not used when reset', async () => {
      await contract.setCustom(1, 'Y3VzdG9t') // "custom" in BASE64
      await contract.resetCustom(1) // "custom" in BASE64
      const svg = await contract.renderSvg(1)
      assert.include(svg, 'M 0 0 L 0 77.843 L 50.921 77.843 L 50.921 343.5 L 143.459 343.5 L 143.459') // part of the path of "1"
    })
  })

  /*
  describe('*** dump ***', async () => {
    it('dumps', async () => {

      const fs = require('fs')
        
      for (let i = 1; i < 10000; i+=8) {
        const svg = await contract.renderSvg(i)
        fs.writeFile('C:\\temp\\OG\\' + i + '.svg', svg, (err) => {})
      }
    })
  })
 */

})