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

  describe('minting', async () => {
    it('is not possible when paused', async () => {
      await contract.setPaused(true)
      await contract.mint([100]).should.be.rejected
      await contract.setPaused(false)
    })

    it('is possible when not paused 1', async () => {
      await contract.setPaused(false)
      const result = await contract.mint([100])
      const tokenId = result.logs[0].args.tokenId
      assert.equal(tokenId, 100)
    })

    it('is limited to 10', async () => {
      const testAddress = accounts[8];
      await contract.mint([101, 102, 103, 104, 105], {from: testAddress}).should.be.fulfilled
      await contract.mint([106, 107, 108, 109, 110], {from: testAddress}).should.be.fulfilled
      await contract.mint([111], {from: testAddress}).should.be.rejected
    })
  })

  describe('og dozen', async () => {
    it('determines correctly', async () => {
      const dozenUnlockMinSupply = 100
      await contract.setOgDozen([accounts[5]], dozenUnlockMinSupply)
      let value = await contract.isOgDozen(accounts[5])
      value.should.equal(true)
      value = await contract.isOgDozen(accounts[4])
      value.should.equal(false)

    })

    it('determines after reset', async () => {
      const dozenUnlockMinSupply = 100
      await contract.setOgDozen([accounts[4], accounts[6], accounts[7]], dozenUnlockMinSupply)
      let value = await contract.isOgDozen(accounts[5])
      value.should.equal(false)
      value = await contract.isOgDozen(accounts[4])
      value.should.equal(true)
      value = await contract.isOgDozen(accounts[6])
      value.should.equal(true)
      value = await contract.isOgDozen(accounts[7])
      value.should.equal(true)
    })
  })

  describe('canMint', async () => {
    it('keeps non-dozens out', async () => {
      const dozenUnlockMinSupply = 0
      await contract.setOgDozen([accounts[4], accounts[6], accounts[7]], dozenUnlockMinSupply)
      let value = await contract.canMint(accounts[1], 500)
      value.should.equal(true)
      value = await contract.canMint(accounts[1], 13)
      value.should.equal(true)
      value = await contract.canMint(accounts[1], 12)
      value.should.equal(false)
      value = await contract.canMint(accounts[1], 11)
      value.should.equal(false)
    })

    it('allows dozens', async () => {
      const dozenUnlockMinSupply = 0
      await contract.setOgDozen([accounts[4], accounts[6], accounts[7]], dozenUnlockMinSupply)
      let value = await contract.canMint(accounts[4], 500)
      value.should.equal(true)
      value = await contract.canMint(accounts[4], 13)
      value.should.equal(true)
      value = await contract.canMint(accounts[4], 12)
      value.should.equal(true)
      value = await contract.canMint(accounts[4], 11)
      value.should.equal(true)
      value = await contract.canMint(accounts[4], 1)
      value.should.equal(false) // requires 2-12 to be minted
    })

    it('requires unlock of min supply', async () => {

      const dozenUnlockMinSupply = await contract.totalSupply()

      await contract.setOgDozen([accounts[4], accounts[6], accounts[7]], dozenUnlockMinSupply)
      let value = await contract.canMint(accounts[4], 2)
      value.should.equal(true)
      
      await contract.setOgDozen([accounts[4], accounts[6], accounts[7]], dozenUnlockMinSupply + 1)
      value = await contract.canMint(accounts[4], 2)
      value.should.equal(false)
    })

    it('allows minting of 1', async () => {
      const dozenUnlockMinSupply = 0
      await contract.setOgDozen([accounts[4], accounts[6], accounts[7]], dozenUnlockMinSupply)

      await contract.mint([2, 3, 4, 5], {from: accounts[4]});
      await contract.mint([6, 7, 8, 9], {from: accounts[6]});
      await contract.mint([10, 11, 12], {from: accounts[7]});

      let value = await contract.canMint(accounts[4], 1)
      value.should.equal(true) // requires 2-12 to be minted

      value = await contract.canMint(accounts[4], 0)
      value.should.equal(false) // requires 1 to be minted
    })

    it('allows minting of 0', async () => {
      const dozenUnlockMinSupply = 0
      await contract.setOgDozen([accounts[4], accounts[6], accounts[7]], dozenUnlockMinSupply)

      await contract.mint([1], {from: accounts[7]});
      const value = await contract.canMint(accounts[4], 0)
      value.should.equal(true)
    })
  })


  describe('suggestFreeIds', async () => {
    it('returns free ids', async () => {
      
      const seed = 111;
      
      let freeIds = await contract.suggestFreeIds(1, seed)
      freeIds.length.should.equal(1)
      
      freeIds = await contract.suggestFreeIds(5, seed)
      freeIds.length.should.equal(5)

      freeIds = await contract.suggestFreeIds(10, seed)
      freeIds.length.should.equal(10)
      
      for (let i = 0; i < freeIds.length; i++) {
        let canMint = await contract.canMint(accounts[0], freeIds[i])
        canMint.should.equal(true)
      }
    })
  })

  /*
  describe('*** dump ***', async () => {
    it('dumps', async () => {

      const fs = require('fs')

      for (let i = 1; i < 10000; i+=8) {
        try {
          const svg = await contract.renderSvg(i)
          fs.writeFile('C:\\temp\\OG\\' + i + '.svg', svg, (err) => {})
        } catch (err) { 
          // because we used a fake contract address for GotToken, already minted
          // OGs cannot be rendered in the tests here. Just skip them when dumping.
         }
      }
    })
  })
  */
})