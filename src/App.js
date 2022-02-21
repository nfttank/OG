import React, { Component } from 'react'
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import './App.css'
import OG from './abis/OG.json'
import OG1 from './assets/OG1.svg';
import Digit from './assets/digit.svg';
import Frame from './assets/frame.svg';
import Back from './assets/back.svg';
import { Footer, Balance, Header, OGColor, OGDozen, Rules, Faq } from './containers';
import {  Navbar } from './components';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      network: { name: 'mainnet', id: 4 },
      mintCountAdd: null,
      mintCount: 5,
      mintFunction: null,
      mintOgDozenFunction: null,
      canMint: true,
      canMintOgDozen: false,
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
      ogDigit: { },
      ogFrame: { },
      ogBack: { },
      ogTwitterUrl: 'https://twitter.com/og_nft_official',
      discordUrl: 'https://discord.gg/pnXynhdgGz',
      tankTwitterUrl: 'https://twitter.com/nfttank',
      contractUrl: '[will be set]',
      openSeaUrl: '[will be set]',
      looksRareUrl: '[will be set]',
      storeUrl: '[will be set]',
      openSeaStorefrontUrl: 'https://opensea.io/collection/og-nft-official',
      ownedOgs: []
    }
  }

  async componentWillMount() {

    this.setState({ featuredOg: { id: 1, svg: await (await fetch(OG1)).text() }})
    this.setState({ ogDigit: { id: -1, svg: await (await fetch(Digit)).text() }})
    this.setState({ ogFrame: { id: -2, svg: await (await fetch(Frame)).text() }})
    this.setState({ ogBack: { id: -3, svg: await (await fetch(Back)).text() }})
    
    if (!window.ethereum) {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask.')
      return
    }

    const networkId = this.state.network.id
    const networkName = this.state.network.name
    const contractAddress = OG.networks[networkId].address

    this.setState({ mintCountAdd: (value) => this.mintCountAdd(value)})
    this.setState({ mintFunction: () => this.mint(this, this.state.mintCount) })
    this.setState({ mintOgDozenFunction: () => this.mintOgDozen(this) })
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

    this.setState({ storeUrl: this.state.openSeaUrl }) 
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
    const canMintOgDozen = await this.state.contract.canMintOgDozen()
    this.setState({ totalSupply: totalSupply })
    this.setState({ soldOut: totalSupply >= 9999})
    this.setState({ canMintOgDozen: canMintOgDozen })

    this.setState({ walletLoaded: true })
    
    const randomId = Math.floor(Math.random() * 9999)
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
    const available = 9999 - totalSupply
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


  async mintOgDozen (app) {

    if (app.state.contract == null)
      await app.connect(app.state.network);

    if (app.state.contract == null || app.state.remainingMintsForWallet <= 0)
      return;

    const stateChangingSigner = app.state.contract.connect(app.state.signer);
      
    await stateChangingSigner.mintOgDozen()
  }


  async mintCountAdd(value) {
    let newCount =  this.state.mintCount + value
    this.setState({mintCount: Math.max(Math.min(1, this.state.remainingMintsForWallet), (Math.min(newCount, this.state.remainingMintsForWallet))) })
  }


  render() {
    return (
        <div className="App">
          <div className="gradient__bg">
            <Navbar data={this.state} />
            <Header data={this.state} />
          </div>
          <OGColor data={this.state} />
          { this.state.canMintOgDozen &&
                <OGDozen data={this.state} />
          }
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