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
      await contract.mint(1).should.be.rejected
      await contract.setPaused(false)
    })

    it('is possible when not paused 1', async () => {
      await contract.setPaused(false)
      const result = await contract.mint(1)
      const tokenId = result.logs[0].args.tokenId.toNumber()
      expect(tokenId).to.equal(13)
    })

    it('is limited to 10 per wallet', async () => {
      const testAddress = accounts[8];
      const ______ = await contract.mint(5, {from: testAddress}).should.be.fulfilled
      const result = await contract.mint(5, {from: testAddress}).should.be.fulfilled
      await contract.mint(1, {from: testAddress}).should.be.rejected

      const lastTokenId = result.logs[result.logs.length-1].args.tokenId.toNumber()
      expect(lastTokenId).to.equal(13+10)
    })

    it('owner can mint more than 10', async () => {
      
      const contractOwner = accounts[0];

      // mint to 100
      let result = await contract.mint(100-(13+10), {from: contractOwner}).should.be.fulfilled
      let lastTokenId = result.logs[result.logs.length-1].args.tokenId.toNumber()
      expect(lastTokenId).to.equal(100)
    })
  })

  describe('canMintOgDozen', async () => {
    it('is false below unlock supply', async () => {
      const totalSupply = await contract.totalSupply()
      await contract.setUnlockSupply(totalSupply + 1)
      const canMint = await contract.canMintOgDozen()
      expect(canMint).to.equal(false)
    })

    it('is true at unlock supply', async () => {
      const totalSupply = await contract.totalSupply()
      await contract.setUnlockSupply(totalSupply)
      const canMint = await contract.canMintOgDozen()
      expect(canMint).to.equal(true)
    })

    it('is true over unlock supply', async () => {
      const totalSupply = await contract.totalSupply()
      await contract.setUnlockSupply(totalSupply - 1)
      const canMint = await contract.canMintOgDozen()
      expect(canMint).to.equal(true)
    })
  })

  describe('minting OG dozen', async () => {

    it('is not possible below unlock supply', async () => {
      const totalSupply = await contract.totalSupply()
      await contract.setUnlockSupply(totalSupply + 1)
      await contract.mintOgDozen().should.be.rejected
    })

    it('is possible over unlock supply', async () => {
      const totalSupply = await contract.totalSupply()
      await contract.setUnlockSupply(totalSupply)

      for (let i = 12; i > 0; i--) { // 12 down to 1
        console.log(i)
        const result = await contract.mintOgDozen()
        const tokenId = result.logs[0].args.tokenId.toNumber()
        expect(tokenId).to.equal(i)
      }
    })
  })

  describe('canMintOgDozen after OG dozen mint', async () => {
    it('is false after all OG dozen tokens were minted', async () => {
      const totalSupply = await contract.totalSupply()
      await contract.setUnlockSupply(totalSupply) // this would unlock OG dozen minting
      const canMint = await contract.canMintOgDozen()
      expect(canMint).to.equal(false) // because no OG dozen tokens are available anymore
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