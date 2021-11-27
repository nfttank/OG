const OGColor = artifacts.require('./contracts/OGColor.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('OGColor', (accounts) => {
  let contract

  before(async () => {
    contract = await OGColor.deployed()
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

  describe('claim', async () => {

    it('creates a new token', async () => {
      
      const result = await contract.claim('back', '#EC058E')
      const event = result.logs[0].args

      let totalSupply = (await contract.totalSupply()).toNumber()
      assert.equal(totalSupply, 1, 'totalSupply should return 1 as one token was minted')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')
    })

    it('can mint the same colors multiple times', async () => {

      await contract.claim('frame', '#EC058A')
      await contract.claim('frame', '#EC058A')
      await contract.claim('frame', '#EC058A')

      assert.equal(await contract.totalSupply(), 3+1, 'could mint the same color multiple times')
    })

    it('can mint known applications', async () => {

      await contract.claim('back', '#EC058A')
      await contract.claim('frame', '#EC058A')
      await contract.claim('digit', '#EC058A')
      await contract.claim('slug', '#EC058A')

      assert.equal(await contract.totalSupply(), 3+1+4, 'could mint the same color multiple times')
    })

    it('cannot mint invalid HEX colors', async () => {
      await contract.claim('back', '#ZAZAZA').should.be.rejected;
    })

    it('cannot mint unknown applications', async () => {
      await contract.claim('fore', '#EC058A').should.be.rejected;
    })
  })

  describe('color retrieval', async () => {

    it('get colors', async () => {

      // Mint 3 more tokens
      await contract.claim('back', '#AAAAAA')
      await contract.claim('frame', '#BBBBBB')
      await contract.claim('digit', '#CCCCCC')
      await contract.claim('slug', '#DDDDDD')

      let expected = ['#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD']
      let result = await contract.getColors(accounts[0], 0) // tokenId 0 is unnecessary

      assert.equal(result[0], expected[0])
      assert.equal(result[1], expected[1])
      assert.equal(result[2], expected[2])
      assert.equal(result[3], expected[3])
    })

    it('gets default values if nothing was claimed', async () => {

      let expected = ['#FFFFFF', '#000000', '#000000', '#FFFFFF']
      let result = await contract.getColors(accounts[1], 0) // account[1] has nothing claimed yet, tokenId 0 is unnecessary

      assert.equal(result[0], expected[0])
      assert.equal(result[1], expected[1])
      assert.equal(result[2], expected[2])
      assert.equal(result[3], expected[3])
    })
   })
})