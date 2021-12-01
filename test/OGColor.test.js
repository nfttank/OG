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
      
      const testAddress = accounts[0];

      const result = await contract.claim('back', '#EC058E', {from: testAddress})
      const event = result.logs[0].args

      let totalSupply = (await contract.totalSupply()).toNumber()
      assert.equal(totalSupply, 1, 'totalSupply should return 1 as one token was minted')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')
    })

    it('can mint the same colors multiple times', async () => {

      const testAddress = accounts[0];

      await contract.claim('frame', '#EC058A', {from: testAddress})
      await contract.claim('frame', '#EC058A', {from: testAddress})
      await contract.claim('frame', '#EC058A', {from: testAddress})

      assert.equal(await contract.totalSupply(), 3+1, 'could mint the same color multiple times')
    })

    it('can mint known applications', async () => {

      const testAddress = accounts[0];

      await contract.claim('back', '#EC058A', {from: testAddress})
      await contract.claim('frame', '#EC058A', {from: testAddress})
      await contract.claim('digit', '#EC058A', {from: testAddress})
      await contract.claim('slug', '#EC058A', {from: testAddress})

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

    it('get minted colors', async () => {

      const testAddress = accounts[1];

      // Mint 3 more tokens
      await contract.claim('back', '#AAAAAA', {from: testAddress})
      await contract.claim('frame', '#BBBBBB', {from: testAddress})
      await contract.claim('digit', '#CCCCCC', {from: testAddress})
      await contract.claim('slug', '#DDDDDD', {from: testAddress})

      let result = await contract.getColors(testAddress, 0) // tokenId 0 is unnecessary

      assert.equal(result[0], '#AAAAAA')
      assert.equal(result[1], '#BBBBBB')
      assert.equal(result[2], '#CCCCCC')
      assert.equal(result[3], '#DDDDDD')
    })

    it('gets default values if nothing was claimed', async () => {

      const testAddress = accounts[2];

      let result = await contract.getColors(testAddress, 0) // tokenId 0 is unnecessary

      assert.equal(result[0], '#FFFFFF')
      assert.equal(result[1], '#000000')
      assert.equal(result[2], '#000000')
      assert.equal(result[3], '#FFFFFF')
    })

    it('resets sold colors', async () => {

      const testAddress = accounts[3];
      const receiverAddress = accounts[4];

      // mint four tokens
      const result1 = await contract.claim('back', '#AAAAA0', {from: testAddress})
      const result2 = await contract.claim('frame', '#BBBBB0', {from: testAddress})
      await contract.claim('digit', '#CCCCC0', {from: testAddress})
      await contract.claim('slug', '#DDDDD0', {from: testAddress})


      // determine the tokenIds
      const tokenId1 = result1.logs[0].args.tokenId
      const tokenId2 = result2.logs[0].args.tokenId

      // sell two tokens
      await contract.transferFrom(testAddress, receiverAddress, tokenId1, {from: testAddress})
      await contract.transferFrom(testAddress, receiverAddress, tokenId2, {from: testAddress})

      let result = await contract.getColors(testAddress, 0) // tokenId 0 is unnecessary

      assert.equal(result[0], '#FFFFFF')
      assert.equal(result[1], '#000000')
      assert.equal(result[2], '#CCCCC0')
      assert.equal(result[3], '#DDDDD0')
    })

    it('resets sold colors with fall backs to other colors available', async () => {

      const testAddress = accounts[5];
      const receiverAddress = accounts[6];

      // mint four tokens
      const result1_1 = await contract.claim('back', '#AAAAA1', {from: testAddress})
      await contract.claim('frame', '#BBBBB1', {from: testAddress})
      const result3_1 = await contract.claim('digit', '#CCCCC1', {from: testAddress})
      await contract.claim('slug', '#DDDDD1', {from: testAddress})

      // mint four more tokens
      await contract.claim('back', '#AAAAA2', {from: testAddress})
      const result2_2 = await contract.claim('frame', '#BBBBB2', {from: testAddress})
      const result3_2 = await contract.claim('digit', '#CCCCC2', {from: testAddress})
      await contract.claim('slug', '#DDDDD2', {from: testAddress})

      // determine the tokenIds
      const tokenId1_1 = result1_1.logs[0].args.tokenId
      const tokenId2_2 = result2_2.logs[0].args.tokenId
      const tokenId3_1 = result3_1.logs[0].args.tokenId
      const tokenId3_2 = result3_2.logs[0].args.tokenId

      // sell some tokens
      await contract.transferFrom(testAddress, receiverAddress, tokenId1_1, {from: testAddress})
      await contract.transferFrom(testAddress, receiverAddress, tokenId2_2, {from: testAddress})
      await contract.transferFrom(testAddress, receiverAddress, tokenId3_1, {from: testAddress})
      await contract.transferFrom(testAddress, receiverAddress, tokenId3_2, {from: testAddress})

      let result = await contract.getColors(testAddress, 0) // tokenId 0 is unnecessary

      assert.equal(result[0], '#AAAAA2') // token1_1 was sold, but token2_1 was minted later so it should be still in use
      assert.equal(result[1], '#BBBBB1') // token2_2 was sold, so token2_1 should be used
      assert.equal(result[2], '#000000') // token3_1 and token3_2 were sold so it should be the default color
      assert.equal(result[3], '#DDDDD2') // token4_1 and token4_2 are available, token4_2 was minted later so it should be used

      result = await contract.getColors(receiverAddress, 0) // tokenId 0 is unnecessary

      assert.equal(result[0], '#AAAAA1') // transferred from testAddress
      assert.equal(result[1], '#BBBBB2') // transferred from testAddress
      assert.equal(result[2], '#CCCCC2') // first token3_1 and then token3_2 transferred from testAddress
      assert.equal(result[3], '#FFFFFF') // nothing transferred, default color
    })

    it('resets multiple levels deep', async () => {

      const testAddress = accounts[7];
      const receiverAddress = accounts[8];
      const burnAddress = '0x000000000000000000000000000000000000dead'

      // mint four tokens
      const result1 = await contract.claim('back', '#AAAAA1', {from: testAddress}) // burn 4
      /*           */ await contract.claim('back', '#AAAAA2', {from: testAddress}) // keep
      const result3 = await contract.claim('back', '#AAAAA3', {from: testAddress}) // sell 2
      const result4 = await contract.claim('back', '#AAAAA4', {from: testAddress}) // burn 3
      const result5 = await contract.claim('back', '#AAAAA5', {from: testAddress}) // sell 1

      // determine the tokenIds
      const tokenId1 = result1.logs[0].args.tokenId
      const tokenId3 = result3.logs[0].args.tokenId
      const tokenId4 = result4.logs[0].args.tokenId
      const tokenId5 = result5.logs[0].args.tokenId

      // sell some tokens
      await contract.transferFrom(testAddress, receiverAddress, tokenId5, {from: testAddress}) // sell 1
      await contract.transferFrom(testAddress, receiverAddress, tokenId3, {from: testAddress}) // sell 2
      await contract.transferFrom(testAddress, burnAddress, tokenId4, {from: testAddress}) // burn 3
      await contract.transferFrom(testAddress, burnAddress, tokenId1, {from: testAddress}) // burn 4

      let result = await contract.getColors(testAddress, 0) // tokenId 0 is unnecessary

      assert.equal(result[0], '#AAAAA2')
    })
  })
})