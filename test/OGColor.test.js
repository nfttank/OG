const { assert } = require('chai')
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

  describe('mint', async () => {

    it('creates a new token', async () => {
      
      const testAddress = accounts[0];

      const result = await contract.mint('back', '#EC058E', {from: testAddress})
      const event = result.logs[0].args

      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')
    })

    it('can mint the same colors multiple times', async () => {

      const testAddress = accounts[0];

      await contract.mint('frame', '#EC058A', {from: testAddress})
      await contract.mint('frame', '#EC058A', {from: testAddress})
      await contract.mint('frame', '#EC058A', {from: testAddress})
    })

    it('can mint known applications', async () => {

      const testAddress = accounts[0];

      await contract.mint('back', '#EC058A', {from: testAddress})
      await contract.mint('frame', '#EC058A', {from: testAddress})
      await contract.mint('digit', '#EC058A', {from: testAddress})
      await contract.mint('slug', '#EC058A', {from: testAddress})
    })

    it('cannot mint unknown applications', async () => {
      await contract.mint('fore', '#EC058A').should.be.rejected;
    })
  })

  describe('color retrieval', async () => {

    it('get minted colors as full gradients', async () => {

      const testAddress = accounts[1];

      // Mint 3 more tokens
      await contract.mint('back', '#AAAAAA', {from: testAddress})
      await contract.mint('frame', '#BBBBBB', {from: testAddress})
      await contract.mint('digit', '#CCCCCC', {from: testAddress})
      await contract.mint('slug', '#DDDDDD', {from: testAddress})

      let result = await contract.getColors(testAddress, 0) // tokenId 0 is unnecessary

      expect(result[0]).to.include("<linearGradient id='back'><stop stop-color='#AAAAAA'/></linearGradient>")
      expect(result[1]).to.include("<linearGradient id='frame'><stop stop-color='#BBBBBB'/></linearGradient>")
      expect(result[2]).to.include("<linearGradient id='digit'><stop stop-color='#CCCCCC'/></linearGradient>")
      expect(result[3]).to.include("<linearGradient id='slug'><stop stop-color='#DDDDDD'/></linearGradient>")
    })

    it('gets default values if nothing was minted', async () => {

      const testAddress = accounts[2];

      let result = await contract.getColors(testAddress, 0) // tokenId 0 is unnecessary

      expect(result[0]).to.include('#FFFFFF')
      expect(result[1]).to.include('#000000')
      expect(result[2]).to.include('#000000')
      expect(result[3]).to.include('#FFFFFF')
    })

    it('returns full linear gradient definitions for default colors', async () => {

      const testAddress = accounts[2];

      let result = await contract.getColors(testAddress, 0) // tokenId 0 is unnecessary

      expect(result[0]).to.include("<linearGradient id='back'><stop stop-color='#FFFFFF'/></linearGradient>")
      expect(result[1]).to.include("<linearGradient id='frame'><stop stop-color='#000000'/></linearGradient>")
      expect(result[2]).to.include("<linearGradient id='digit'><stop stop-color='#000000'/></linearGradient>")
      expect(result[3]).to.include("<linearGradient id='slug'><stop stop-color='#FFFFFF'/></linearGradient>")
    })

    it('gets complex gradients', async () => {

      const testAddress = accounts[9];

      const gradient = '<linearGradient id="back" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#Aa44ff" /><stop offset="100%" style="stop-color:#ff4455" /></linearGradient>'
      await contract.mint('back', gradient, {from: testAddress})

      let result = await contract.getColors(testAddress, 0) // tokenId 0 is unnecessary
      assert.equal(result[0], gradient)
    })

    it('resets sold colors', async () => {

      const testAddress = accounts[3];
      const receiverAddress = accounts[4];

      // mint four tokens
      const result1 = await contract.mint('back', '#AAAAA0', {from: testAddress})
      const result2 = await contract.mint('frame', '#BBBBB0', {from: testAddress})
      await contract.mint('digit', '#CCCCC0', {from: testAddress})
      await contract.mint('slug', '#DDDDD0', {from: testAddress})


      // determine the tokenIds
      const tokenId1 = result1.logs[0].args.tokenId
      const tokenId2 = result2.logs[0].args.tokenId

      // sell two tokens
      await contract.transferFrom(testAddress, receiverAddress, tokenId1, {from: testAddress})
      await contract.transferFrom(testAddress, receiverAddress, tokenId2, {from: testAddress})

      let result = await contract.getColors(testAddress, 0) // tokenId 0 is unnecessary

      expect(result[0]).to.include('#FFFFFF')
      expect(result[1]).to.include('#000000')
      expect(result[2]).to.include('#CCCCC0')
      expect(result[3]).to.include('#DDDDD0')
    })

    it('resets sold colors with fall backs to other colors available', async () => {

      const testAddress = accounts[5];
      const receiverAddress = accounts[6];

      // mint four tokens
      const result1_1 = await contract.mint('back', '#AAAAA1', {from: testAddress})
      await contract.mint('frame', '#BBBBB1', {from: testAddress})
      const result3_1 = await contract.mint('digit', '#CCCCC1', {from: testAddress})
      await contract.mint('slug', '#DDDDD1', {from: testAddress})

      // mint four more tokens
      await contract.mint('back', '#AAAAA2', {from: testAddress})
      const result2_2 = await contract.mint('frame', '#BBBBB2', {from: testAddress})
      const result3_2 = await contract.mint('digit', '#CCCCC2', {from: testAddress})
      await contract.mint('slug', '#DDDDD2', {from: testAddress})

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

      expect(result[0]).to.include('#AAAAA2') // token1_1 was sold, but token2_1 was minted later so it should be still in use
      expect(result[1]).to.include('#BBBBB1') // token2_2 was sold, so token2_1 should be used
      expect(result[2]).to.include('#000000') // token3_1 and token3_2 were sold so it should be the default color
      expect(result[3]).to.include('#DDDDD2') // token4_1 and token4_2 are available, token4_2 was minted later so it should be used

      result = await contract.getColors(receiverAddress, 0) // tokenId 0 is unnecessary

      expect(result[0]).to.include('#AAAAA1') // transferred from testAddress
      expect(result[1]).to.include('#BBBBB2') // transferred from testAddress
      expect(result[2]).to.include('#CCCCC2') // first token3_1 and then token3_2 transferred from testAddress
      expect(result[3]).to.include('#FFFFFF') // nothing transferred, default color
    })

    it('resets multiple levels deep', async () => {

      const testAddress = accounts[7];
      const receiverAddress = accounts[8];
      const burnAddress = '0x000000000000000000000000000000000000dead'

      // mint four tokens
      const result1 = await contract.mint('back', '#AAAAA1', {from: testAddress}) // burn 4
      /*           */ await contract.mint('back', '#AAAAA2', {from: testAddress}) // keep
      const result3 = await contract.mint('back', '#AAAAA3', {from: testAddress}) // sell 2
      const result4 = await contract.mint('back', '#AAAAA4', {from: testAddress}) // burn 3
      const result5 = await contract.mint('back', '#AAAAA5', {from: testAddress}) // sell 1

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

      expect(result[0]).to.include('#AAAAA2')
    })
  })

  it('has attributes', async () => {

    const testAddress = accounts[9];

    // mint four tokens
    const result1 = await contract.mint('back', '#aaaaaa', {from: testAddress}) 
    const result2 = await contract.mint('frame', '#bbbbbb', {from: testAddress}) 
    const result3 = await contract.mint('digit', '#cccccc', {from: testAddress}) 
    const result4 = await contract.mint('slug', '#dddddd', {from: testAddress}) 
    
    // determine the tokenIds
    const tokenId1 = result1.logs[0].args.tokenId
    const tokenId2 = result2.logs[0].args.tokenId
    const tokenId3 = result3.logs[0].args.tokenId
    const tokenId4 = result4.logs[0].args.tokenId

    // sell some tokens
    const meta1 = await contract.tokenURI(tokenId1.toNumber())
    const meta2 = await contract.tokenURI(tokenId2.toNumber())
    const meta3 = await contract.tokenURI(tokenId3.toNumber())
    const meta4 = await contract.tokenURI(tokenId4.toNumber())

    expect(Buffer.from(meta1.replace('data:application/json;base64,', ''), 'base64').toString('ascii')).to.include('"trait_type": "Application", "value": "back"')
    expect(Buffer.from(meta2.replace('data:application/json;base64,', ''), 'base64').toString('ascii')).to.include('"trait_type": "Application", "value": "frame"')
    expect(Buffer.from(meta3.replace('data:application/json;base64,', ''), 'base64').toString('ascii')).to.include('"trait_type": "Application", "value": "digit"')
    expect(Buffer.from(meta4.replace('data:application/json;base64,', ''), 'base64').toString('ascii')).to.include('"trait_type": "Application", "value": "slug"')
  })

  it('has secret color attributes', async () => {

    const testAddress = accounts[9];

    // mint four tokens
    const result1 = await contract.mint('back', '#c8fbfb', {from: testAddress}) 
    const result2 = await contract.mint('frame', '#7da269', {from: testAddress}) 
    const result3 = await contract.mint('digit', '#856f56', {from: testAddress}) 
    
    // determine the tokenIds
    const tokenId1 = result1.logs[0].args.tokenId
    const tokenId2 = result2.logs[0].args.tokenId
    const tokenId3 = result3.logs[0].args.tokenId

    // sell some tokens
    const meta1 = await contract.tokenURI(tokenId1.toNumber())
    const meta2 = await contract.tokenURI(tokenId2.toNumber())
    const meta3 = await contract.tokenURI(tokenId3.toNumber())

    expect(Buffer.from(meta1.replace('data:application/json;base64,', ''), 'base64').toString('ascii')).to.include('Alien')
    expect(Buffer.from(meta2.replace('data:application/json;base64,', ''), 'base64').toString('ascii')).to.include('Zombie')
    expect(Buffer.from(meta3.replace('data:application/json;base64,', ''), 'base64').toString('ascii')).to.include('Ape')
  })
})