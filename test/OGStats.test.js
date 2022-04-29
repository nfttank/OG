const { assert } = require('chai')

const OGStats = artifacts.require('./contracts/OGStats.sol')
const OG = artifacts.require('./contracts/OG.sol')


require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('OGStats', (accounts) => {
  let statsContract
  let ogContract
  let owner

  before(async () => {
    statsContract = await OGStats.deployed()
    ogContract = await OG.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = statsContract.address
      console.log('Deployed to address', address)
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
      owner = accounts[0];
    })
  })

  describe('setup', async () => {

    it('set OG contract', async () => {
      await statsContract.setOgContract(ogContract.address, {from: owner}).should.be.fulfilled
    })

    it('unlock OG contract and OG Dozen mint', async () => {
      await ogContract.setPaused(false, {from: owner})
      await ogContract.setUnlockSupply(0, {from: owner})
    })

    it('mint OG Dozen', async () => {
      for (let i = 0; i < 12; i++) {
        await ogContract.mintOgDozen().should.be.fulfilled
      }
    })

    it('mint additional OGs', async () => {
      const result = await ogContract.mint(30, {from: owner})
      const tokenId = result.logs[result.logs.length - 1].args.tokenId.toNumber()
      expect(tokenId).to.equal(42)
    })
  })

  describe('transfer', async () => {

    it('OG ', async () => {
      await ogContract.transferFrom(owner, accounts[1], 9, {from: owner}) // OG Dozen
      await ogContract.transferFrom(owner, accounts[1], 10, {from: owner}) // OG Dozen
      await ogContract.transferFrom(owner, accounts[1], 11, {from: owner}) // OG Dozen
      await ogContract.transferFrom(owner, accounts[1], 42, {from: owner}) // Meme
      await ogContract.transferFrom(owner, accounts[1], 33, {from: owner}) // Honorary

      await ogContract.transferFrom(accounts[1], accounts[2], 10, {from: accounts[1]}) // OG Dozen
      await ogContract.transferFrom(accounts[1], accounts[2], 11, {from: accounts[1]}) // OG Dozen
      await ogContract.transferFrom(owner, accounts[2], 13, {from: owner})
      await ogContract.transferFrom(owner, accounts[2], 14, {from: owner})
      await ogContract.transferFrom(owner, accounts[2], 15, {from: owner})

      await ogContract.transferFrom(accounts[2], accounts[3], 11, {from: accounts[2]}) // OG Dozen
      await ogContract.transferFrom(owner, accounts[3], 16, {from: owner})

      await ogContract.transferFrom(owner, accounts[4], 17, {from: owner})

    })
  })

  describe('checks', async () => {

    it('owner', async () => {
      const stats = await statsContract.scan(owner, 100)

      stats.ogDozen.should.equal(true)
      stats.meme.should.equal(false)
      stats.honorary.should.equal(false)

      stats.balance.toString().should.equal("32") // minted 42, sent 10
    })

    it('account[1]', async () => {
      const stats = await statsContract.scan(accounts[1], 100)

      stats.ogDozen.should.equal(true)
      stats.meme.should.equal(true)
      stats.honorary.should.equal(true)

      stats.balance.toString().should.equal("3") // received 5, sent 2
    })

    it('account[2]', async () => {
      const stats = await statsContract.scan(accounts[2], 100)
      
      stats.ogDozen.should.equal(true)
      stats.meme.should.equal(false)
      stats.honorary.should.equal(false)

      stats.balance.toString().should.equal("4") // received 5, sent 1
    })

    it('account[3]', async () => {
      const stats = await statsContract.scan(accounts[3], 100)
      
      stats.ogDozen.should.equal(true)
      stats.meme.should.equal(false)
      stats.honorary.should.equal(false)

      stats.balance.toString().should.equal("2") // received 2, sent 0
    })

    it('account[4]', async () => {
      const stats = await statsContract.scan(accounts[4], 100)
      
      stats.ogDozen.should.equal(false)
      stats.meme.should.equal(false)
      stats.honorary.should.equal(false)

      stats.balance.toString().should.equal("1") // received 1, sent 0
    })


    it('account[5]', async () => {
      const stats = await statsContract.scan(accounts[5], 100)
      
      stats.ogDozen.should.equal(false)
      stats.meme.should.equal(false)
      stats.honorary.should.equal(false)

      stats.balance.toString().should.equal("0") // received 0, sent 0
    })
  })


  describe('blocks', async () => {

    it('blocks eliminate OG Dozen status', async () => {

      // account 3 holds 11 and 16
      // 2 tokens, one is OG Dozen

      await statsContract.blockToken(11, { from: owner}).should.be.fulfilled

      const stats = await statsContract.scan(accounts[3], 100)

      stats.ogDozen.should.equal(false)
      stats.meme.should.equal(false)
      stats.honorary.should.equal(false)

      stats.balance.toString().should.equal("1")
    })

    it('blocks reduce balance', async () => {

      // account 3 holds 11 and 16
      // 2 tokens, one is OG Dozen
      // 11 was blocked already

      await statsContract.blockToken(16, { from: owner}).should.be.fulfilled

      const stats = await statsContract.scan(accounts[3], 100)

      stats.ogDozen.should.equal(false)
      stats.meme.should.equal(false)
      stats.honorary.should.equal(false)

      stats.balance.toString().should.equal("0")
    })

    it('blocks can be undone', async () => {

      // account 3 holds 11 and 16
      // 2 tokens, one is OG Dozen
      // 11 & 16 were blocked already

      await statsContract.unblockToken(11, { from: owner}).should.be.fulfilled

      const stats = await statsContract.scan(accounts[3], 100)

      stats.ogDozen.should.equal(true)
      stats.meme.should.equal(false)
      stats.honorary.should.equal(false)

      stats.balance.toString().should.equal("1")
    })

    it('can check blocked tokens', async () => {
      const isBlocked = await statsContract.isTokenBlocked(16)
      isBlocked.should.equal(true);
    })

    it('can check unblocked tokens', async () => {
      const isBlocked = await statsContract.isTokenBlocked(11)
      isBlocked.should.equal(false);
    })
  })
})