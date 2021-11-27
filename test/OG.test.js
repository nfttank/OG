const OG = artifacts.require('./contracts/OG.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('OG', (accounts) => {
  let contract

  before(async () => {
    contract = await OG.deployed()
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
})