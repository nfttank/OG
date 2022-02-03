const { assert } = require('chai')

const OG = artifacts.require('./contracts/OG.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('OG-ERC', (accounts) => {
  let contract
  const testAddress1 = accounts[5]
  const testAddress2 = accounts[6]
  const testAddress3 = accounts[7]
  const ids1 = [1001, 1414, 1546, 1673, 1235, 1536, 1783, 1436]
  const ids2 = [2112, 2424, 2255, 2414]
  const ids3 = [1565, 1747]

  before(async () => {
    contract = await OG.deployed()
    await contract.setTrustedContractAddresses('0xc256A0467EcCce3391a0c1c02bD8151337196482', '0xEc7CaAe7738a5B64e98Dc9FF3566D2ca2503aE21') // these are fake, just set so that renderSvg() works
    await contract.setPaused(false)
  })

  describe('IERC721Enumerable implementation', async () => {
    it('prep: mint', async () => {

      let result = await contract.mint(1, {from: testAddress1})
      let tokenId = result.logs[0].args.tokenId.toNumber()
      expect(tokenId).to.equal(13)

      result = await contract.mint(10, {from: testAddress2})
      tokenId = result.logs[0].args.tokenId.toNumber()
      expect(tokenId).to.equal(14)
      tokenId = result.logs[result.logs.length-1].args.tokenId.toNumber()
      expect(tokenId).to.equal(23)

      result = await contract.mint(1, {from: testAddress1})
      tokenId = result.logs[0].args.tokenId.toNumber()
      expect(tokenId).to.equal(24)
    })

    it('balanceOf after mint', async () => {

      let balance = await contract.balanceOf(testAddress1);
      balance.toNumber().should.equal(2)

      balance = await contract.balanceOf(testAddress2);
      balance.toNumber().should.equal(10)

      balance = await contract.balanceOf(testAddress3);
      balance.toNumber().should.equal(0)
    })

    it('tokenOfOwnerByIndex after mint', async () => {

      let id = await contract.tokenOfOwnerByIndex(testAddress1, 0)
      id.toNumber().should.equal(13)

      id = await contract.tokenOfOwnerByIndex(testAddress1, 1)
      id.toNumber().should.equal(24)
      
      for (let i = 0; i < 10; i++) {
        id = await contract.tokenOfOwnerByIndex(testAddress2, i)
        id.toNumber().should.equal(14+i)
      }
    })

    it('totalSupply', async () => {
      const totalSupply = await contract.totalSupply()
      assert.equal(totalSupply, 1 + 10 + 1)
    })

    it('prep: transfers', async () => {

      await contract.transferFrom(testAddress1, testAddress2, 8888, {from: testAddress1}).should.be.rejected // does not own token
      await contract.transferFrom(testAddress1, testAddress2, 14, {from: testAddress1}).should.be.rejected // does not own token (belongs to testAccount 2)

      await contract.transferFrom(testAddress1, testAddress3, 13, {from: testAddress1})
      await contract.transferFrom(testAddress2, testAddress1, 23, {from: testAddress2})
      await contract.transferFrom(testAddress1, testAddress3, 24, {from: testAddress1})
      await contract.transferFrom(testAddress1, testAddress3, 23, {from: testAddress1})
    })

    it('balanceOf after transfers', async () => {

      let balance = await contract.balanceOf(testAddress1);
      balance.toNumber().should.equal(0)

      balance = await contract.balanceOf(testAddress2);
      balance.toNumber().should.equal(9)

      balance = await contract.balanceOf(testAddress3);
      balance.toNumber().should.equal(3)
    })

    it('tokens arrived at destination address', async () => {
      let id = await contract.tokenOfOwnerByIndex(testAddress3, 0)
      id.toNumber().should.equal(13)

      id = await contract.tokenOfOwnerByIndex(testAddress3, 1)
      id.toNumber().should.equal(24)

      id = await contract.tokenOfOwnerByIndex(testAddress3, 2)
      id.toNumber().should.equal(23)
    })

    it('tokens left source address', async () => {
      let balance = await contract.balanceOf(testAddress1);
      balance.toNumber().should.equal(0)
      await contract.tokenOfOwnerByIndex(testAddress1, 0).should.be.rejected // no tokens anymore
    })
  })
})