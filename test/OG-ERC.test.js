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

      await contract.mint(ids1, {from: testAddress1})

      await contract.mint(ids2, {from: testAddress2})

      await contract.mint(ids3, {from: testAddress1})
    })

    it('balanceOf after mint', async () => {

      let balance = await contract.balanceOf(testAddress1);
      balance.toNumber().should.equal(ids1.length + ids3.length)

      balance = await contract.balanceOf(testAddress2);
      balance.toNumber().should.equal(ids2.length)

      balance = await contract.balanceOf(testAddress3);
      balance.toNumber().should.equal(0)
    })

    it('tokenOfOwnerByIndex after mint', async () => {

      for (let i = 0; i < ids1.length; i++) {
        let id = await contract.tokenOfOwnerByIndex(testAddress1, i)
        assert.equal(id, ids1[i])
      }

      for (let i = 0; i < ids2.length; i++) {
        let id = await contract.tokenOfOwnerByIndex(testAddress2, i)
        assert.equal(id, ids2[i])
      }

      for (let i = 0; i < ids3.length; i++) {
        let id = await contract.tokenOfOwnerByIndex(testAddress1, i + ids1.length) // add the offset of ids1 to the index as this account owns them too
        assert.equal(id, ids3[i])
      }
    })

    it('totalSupply', async () => {
      const totalSupply = await contract.totalSupply()
      assert.equal(totalSupply, ids1.length + ids2.length + ids3.length)
    })

    it('prep: transfers', async () => {

      await contract.transferFrom(testAddress1, testAddress2, 8888, {from: testAddress1}).should.be.rejected // does not own token
      await contract.transferFrom(testAddress1, testAddress2, ids2[0], {from: testAddress1}).should.be.rejected // does not own token (belongs to testAccount 2)

      await contract.transferFrom(testAddress1, testAddress3, ids1[0], {from: testAddress1})
      await contract.transferFrom(testAddress1, testAddress3, ids1[1], {from: testAddress1})
    })

    it('balanceOf after transfers', async () => {

      let balance = await contract.balanceOf(testAddress1);
      balance.toNumber().should.equal(ids1.length + ids3.length - 2)

      balance = await contract.balanceOf(testAddress2);
      balance.toNumber().should.equal(ids2.length)

      balance = await contract.balanceOf(testAddress3);
      balance.toNumber().should.equal(0 + 2)
    })

    it('tokens arrived at destination address', async () => {
      // 0+1 have been added to the new owner
      for (let i = 0; i < 2; i++) {
        let id = await contract.tokenOfOwnerByIndex(testAddress3, i)
        assert.equal(id.toNumber(), ids1[i])
      }
    })

    it('tokens left source address', async () => {

      let ids1Without1And2 = ids1.slice(2)
      ids1Without1And2.includes(ids1[0]).should.equal(false, "because the first id should not be in the sliced array")
      ids1Without1And2.includes(ids1[1]).should.equal(false, "because the second id should not be in the sliced array")
      ids1Without1And2.includes(ids1[2]).should.equal(true, "because the third id should be in the sliced array")

      let receiverIds = ids1Without1And2.concat(ids3)

      for (let i = 0; i < receiverIds.length; i++) {
        let id = await contract.tokenOfOwnerByIndex(testAddress1, i)
        receiverIds.includes(id.toNumber()).should.equal(true, "because the receiver should contain token " + id + " (run " + i + ")")
      }

      // make sure there are no more than those tested above
      await contract.tokenOfOwnerByIndex(testAddress1, receiverIds.length).should.be.rejected
    })
  })
})