import React, { Component, useState } from 'react'
import Web3 from 'web3'
import './App.css'
import OG from '../src/abis/OG.json'
//import Autocomplete from '@celebryts/react-autocomplete-tags'
import { Footer, Blog, /*Possibility, Features, WhatGPT3,*/ Header } from './containers';
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

      await this.loadTokens()

    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  async loadTokens() {
    
    const totalSupply = await this.state.contract.methods.totalSupply().call()
    this.setState({ totalSupply: 2 })

    const tokenCount = await this.state.contract.methods.balanceOf(this.state.account).call()

    let ids = []
    let svgs = []

    for (var i = 0; i < tokenCount; i++) {
      const ogId = await this.state.contract.methods.tokenOfOwnerByIndex(this.state.account, i).call()
      ids = ids.concat(ogId)
      const svg = await this.state.contract.methods.renderSvg(ogId).call()
      svgs = svgs.concat(svg)
    }

    this.setState({ ownedOgIds: ids})
    this.setState({ ownedOgSvgs: svgs})

  }

  mint = async () => {

    const tagValues = this.state.tags.map(t => t.value)
    window.alert(tagValues)

    await this.state.contract.methods.mint(tagValues).send({ from: this.state.account })

    await this.loadTokens()

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

  suggest = async () => {
    const seed = new Date().getMilliseconds()
    const suggested = await this.state.contract.methods.suggestFreeIds(5, seed).call()
     this.setState({ tags: suggested.map(s => ({ value: s, label: s.toString() })) })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      ogTwitterUrl: 'https://twitter.com/og_nft_official',
      tankTwitterUrl: 'https://twitter.com/nfttank',
      contractUrl: '',
      storeUrl: '',
      ownedOgIds: [],
      ownedOgSvgs: [],
      ownedOgUris: [],
      tokenInput: [],
      tags: [],
    }
  }

  render() {
    return (
      // <div>
      //   <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      //     <a
      //       className="navbar-brand col-sm-3 col-md-2 mr-0"
      //       href="https://nfttank.github.io/OG/"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       OG by Tank
      //     </a>
      //     <ul className="navbar-nav px-3">
      //       <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
      //         <small className="text-white"><span id="account">{this.state.storeUrl}</span></small>
      //         <small className="text-white"><span id="account">{this.state.account}</span></small>
      //       </li>
      //     </ul>
      //   </nav>
      //   <div className="container-fluid mt-5">
      //     <div className="row">
      //       <main role="main" className="col-lg-12 d-flex text-center">
      //         <div className="content mr-auto ml-auto">
      //           <h1>Issue Token</h1>
      //           <form onSubmit={(event) => {
      //             event.preventDefault()
      //           }}>
      //           {/* https://github.com/celebryts/react-autocomplete-tags */}
      //           <Autocomplete
      //             tags={this.state.tags}
      //             onChange={this.handleChange}
      //             onAdd={this.tagAdd}
      //             onDelete={this.tagDelete}
      //           />
      //           <button className='btn btn-block btn-secondary' onClick={this.suggest}>
      //             Suggest
      //           </button>
      //           <button className='btn btn-block btn-primary' onClick={this.mint}>
      //             Mint
      //           </button>
      //           </form>
      //         </div>
      //       </main>
      //     </div>
      //     <hr />
      //     <div className="row text-center">
      //       {
      //         this.state.ownedOgSvgs.map((svg, index) => {
      //         return (
      //             <div div key={index} className="col-md-3 mb-3">
      //               <a href={this.state.storeUrl + "/" + this.state.ownedOgIds[index].toString()}>
      //                 <span class="span-link"></span>
      //               </a>
      //               {/* eliminate height and width to do scaling */}
      //               <div dangerouslySetInnerHTML={{__html: svg.replace('height=\'1000\'', '').replace('width=\'1000\'', '')}} />
      //             </div>
      //         )
      //       })}
      //     </div>
      //   </div>
      // </div>
        <div className="App">
          <div className="gradient__bg">
            <Navbar data={this.state} />
            <Header data={this.state} />
          </div>
          {/* <Brand />
          <WhatGPT3 />
          <Features />
          <Possibility />
          <CTA />*/ }
          <Blog />
          <Footer />
        </div>
    );
  }
}

export default App;
