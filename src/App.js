import React, { Component } from 'react'
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import './App.css'
import OG from './abis/OG.json'
import OG1 from './assets/OG1.svg';
import { Footer, Balance, Header, Rules, Faq } from './containers';
import {  Navbar } from './components';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      network: { name: 'rinkeby', id: 4 },
      //network: { name: 'mainnet', id: 1 },
      mintCountAdd: null,
      mintCount: 5,
      mintFunction: null,
      mintOgDozenFunction: null,
      connectFunction: null,
      remainingMintsForWallet: 0,
      connected: false,
      soldOut: false,
      signerAddress: '',
      provider: null,
      signer: null,
      contract: null,
      balance: 0,
      totalSupply: 0,
      maxPerWallet: 10,
      walletLoaded: false,
      featuredOg: { },
      featuredOgExists: false,
      ogTwitterUrl: 'https://twitter.com/og_nft_official',
      discordUrl: 'https://discord.com/invite/kTvaHARW',
      tankTwitterUrl: 'https://twitter.com/nfttank',
      contractUrl: '',
      storeUrl: '',
      openSeaUrl: '',
      openSeaStorefrontUrl: 'https://testnets.opensea.io/collection/og-rc1',
      looksRareUrl: '',
      ownedOgs: [],
    }
  }

  async componentWillMount() {

    const svg = await (await fetch(OG1)).text()
    this.setState({ featuredOg: { id: 1, svg: svg }})
    
    if (!window.ethereum) {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask.')
      return
    }

    const networkId = this.state.network.id
    const networkName = this.state.network.name
    const contractAddress = OG.networks[networkId].address

    this.setState({ mintCountAdd: (value) => this.mintCountAdd(value)})
    this.setState({ mintFunction: () => this.mint(this, this.state.mintCount) })
    this.setState({ mintOgDozenFunction: () => this.mint(this, 10) })
    this.setState({ connectFunction: () => this.connect(this.state.network) })

    if (networkId === 1) {
      this.setState({ contractUrl: "https://etherscan.io/address/" + contractAddress })
      this.setState({ openSeaUrl: "https://opensea.io/assets/" + contractAddress })
      this.setState({ looksRareUrl: "https://looksrare.org/collections/" + contractAddress })
    }
    else {
      this.setState({ contractUrl: "https://" + networkName + ".etherscan.io/address/" + contractAddress })
      this.setState({ openSeaUrl: "https://testnets.opensea.io/assets/" + contractAddress })
      this.setState({ looksRareUrl: "https://looksrare.org/collections/" + contractAddress })
    }

    this.setState({ storeUrl: networkId === 1 ? this.state.looksRareUrl : this.state.openSeaUrl }) 
  }

  async connect(network) {

    const providerOptions = {
      /* See Provider Options Section */
    };
    
    const web3Modal = new Web3Modal({
      network: this.state.network.name,
      cacheProvider: true,
      providerOptions
    });

    const instance = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(OG.networks[this.state.network.id].address, OG.abi, provider);

    this.setState({ provider: provider })
    this.setState({ signer: signer })
    this.setState({ signerAddress: await this.state.signer.getAddress()})
    this.setState({ connected: this.state.signerAddress !== ''})
    this.setState({ contract: contract })

    const remainingMints = await this.getRemainingMintsForWallet()
    this.setState({ remainingMintsForWallet: remainingMints })

    if (this.state.mintCount > remainingMints)
      this.setState({ mintCount: remainingMints })

    await this.loadTokens()
  }

  async loadTokens() {

    const balance = await this.state.contract.balanceOf(this.state.signerAddress)
    this.setState({ balance: balance})

    const totalSupply = await this.state.contract.totalSupply()
    this.setState({ totalSupply: totalSupply })
    this.setState({ soldOut: totalSupply >= 10000})

    this.setState({ walletLoaded: true })
    
    const randomId = Math.floor(Math.random() * 10000)
    const featuredSvg = await this.state.contract.renderSvg(randomId)
    this.setState({ featuredOg: { id: randomId, svg: featuredSvg }})
    console.log(this.state.featuredOg)
    
    // ownerOf might crash and abort the methods execution
    try {
      const exists = await this.state.contract.exists(randomId)
      this.setState({ featuredOgExists: exists })
    } catch {}

    this.setState({ ownedOgs: []})

    for (var i = 0; i < balance; i++) {
      const ogId = await this.state.contract.tokenOfOwnerByIndex(this.state.signerAddress, i)
      const ogSvg = await this.state.contract.renderSvg(ogId)
      
      this.setState({ ownedOgs: this.state.ownedOgs.concat({id: ogId, svg: ogSvg})})
    }
  }

  getRemainingMintsForWallet = async() => {
    
    const balance = await this.state.contract.balanceOf(this.state.signerAddress)
    
    let count = this.state.maxPerWallet - balance;

    if (count < 0)
      return 0
    else if (count > 10)
      return 10

    const totalSupply = await this.state.contract.totalSupply()
    const available = 10000 - totalSupply
    if (count > available)
      return available

    return count
  }

  async mint (app, count) {

    if (app.state.contract == null)
      await app.connect(app.state.network);

    if (app.state.contract == null || app.state.remainingMintsForWallet <= 0)
      return;

    const canMint = count > 0 && count < 11 && !app.state.soldOut

    if (canMint) {

      const stateChangingSigner = app.state.contract.connect(app.state.signer);
      
      await stateChangingSigner.mint(count)

      // TODO refresh
    }
  }


  async mintCountAdd(value) {
    let newCount =  this.state.mintCount + value
    this.setState({mintCount: Math.max(Math.min(5, this.state.remainingMintsForWallet), (Math.min(newCount, this.state.remainingMintsForWallet))) })
  }


  render() {
    return (
        <div className="App">
          <div className="gradient__bg">
            <Navbar data={this.state} />
            <Header data={this.state} />
          </div>
          <Rules />
          {   this.state.connected &&
                <Balance data={this.state} />
          }
          <Faq />
          <Footer data={this.state} />
        </div>
    );
  }
}

export default App;