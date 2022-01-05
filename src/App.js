import React, { Component, useState } from 'react'
import Web3 from 'web3'
import './App.css'
import OG from '../src/abis/OG.json'
import { Footer, Balance, Header, Rules } from './containers';
import {  Navbar } from './components';
import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask.')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3

    this.setState({ mintFunction: this.mintRandom })

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const networkData = OG.networks[networkId]
    if (networkData) {

      const abi = OG.abi
      const contractAddress = networkData.address
      const contract = new web3.eth.Contract(abi, contractAddress)
      this.setState({ contract })
 
      if (networkId === 1) {
        this.setState({ contractUrl: "https://etherscan.io/address/" + contract.address })
        this.setState({ storeUrl: "https://opensea.io/assets/" + contract.address })
      }
      else {
        this.setState({ contractUrl: "https://rinkeby.etherscan.io/address/" + contract.address })
        this.setState({ storeUrl: "https://testnets.opensea.io/assets/" + contract.address })
      }

      const remainingMints = await this.getRemainingMintsForWallet()
      this.setState({ remainingMintsForWallet: remainingMints })

      await this.loadTokens()

    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  async loadTokens() {

    const balance = await this.state.contract.methods.balanceOf(this.state.account).call()
    this.setState({ balance: balance})

    const totalSupply = await this.state.contract.methods.totalSupply().call()
    this.setState({ totalSupply: totalSupply })
    this.setState({ soldOut: totalSupply >= 10000})

    this.setState({ walletLoaded: true })
    
    const randomId = Math.floor(Math.random() * 10000)
    const featuredSvg = await this.state.contract.methods.renderSvg(randomId).call()
    this.setState({ featuredOg: { id: randomId, svg: featuredSvg }})

    this.setState({ ownedOgs: []})

    for (var i = 0; i < balance; i++) {
      const ogId = await this.state.contract.methods.tokenOfOwnerByIndex(this.state.account, i).call()
      const ogSvg = await this.state.contract.methods.renderSvg(ogId).call()

      this.setState({ ownedOgs: this.state.ownedOgs.concat({id: ogId, svg: ogSvg})})
    }
  }

  getRemainingMintsForWallet = async() => {
    
    const balance = await this.state.contract.methods.balanceOf(this.state.account).call()
    
    let count = this.state.maxPerWallet - balance;

    if (count < 0) {
      return 0
    } else if (count > 5) {
      return 5
    }

    const totalSupply = await this.state.contract.methods.totalSupply().call()
    const available = 10000 - totalSupply
    if (count > available)
      return available

    return count
  }

  mintRandom = async() => {

    const count = await this.getRemainingMintsForWallet()

    const canMint = count > 0 && !this.state.soldOut

    if (canMint) {
      const seed = new Date().getMilliseconds()
      const suggested = await this.state.contract.methods.suggestFreeIds(count, seed).call()
      await this.state.contract.methods.mint(suggested).send({ from: this.state.account })

      await this.loadTokens()
    }

    // this.state.contract.methods.mint(this.state.tokenInput).send({ from: this.state.account })
    //   .once('receipt', (receipt) => {
    //     // this.setState({ ogs: this.state.ogs.concat(tokens[i])})
    //     // const svg = this.state.contract.methods.renderSvg(tokens[i]).send({ from: this.state.account })
    //     // this.setState({ svgs: this.state.svgs.concat(svg)})
    //   })

    //await this.state.contract.methods.mint(this.state.tokenInput).send({ from: this.state.account })
    // .once('receipt', (receipt) => {
    //   window.alert(receipt)
    //   this.setState({ ogs: this.state.ogs.concat(this.state.tokenInput)})

    //   for (var i = 0; i < this.state.tokenInput.length; i++) {
    //     const svg = this.state.contract.methods.renderSvg(this.state.tokenInput[i]).send({ from: this.state.account })
    //     this.setState({ svgs: this.state.svgs.concat(svg)})
    //   }
    //})
  }

  constructor(props) {
    super(props)
    this.state = {
      mintFunction: null,
      connectFunction: null,
      remainingMintsForWallet: 0,
      soldOut: false,
      account: '',
      contract: null,
      balance: 0,
      totalSupply: 0,
      maxPerWallet: 10,
      walletLoaded: false,
      featuredOg: {},
      ogTwitterUrl: 'https://twitter.com/og_nft_official',
      discordUrl: 'https://discord.com/invite/kTvaHARW',
      tankTwitterUrl: 'https://twitter.com/nfttank',
      contractUrl: '',
      storeUrl: '',
      ownedOgs: [],
      tokenInput: [],
      tags: [],
    }
  }

  render() {
    return (
        <div className="App">
          <div className="gradient__bg">
            <Navbar data={this.state} />
            <Header data={this.state} />
          </div>
          <Rules />
          <Balance data={this.state} />
          <Footer data={this.state} />
        </div>
    );
  }
}

export default App;