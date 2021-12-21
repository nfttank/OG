import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import OG from '../abis/OG.json'
import Autocomplete from '@celebryts/react-autocomplete-tags'

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
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })

      const tokenCount = await contract.methods.balanceOf(this.state.account).call()

      for (var i = 0; i < tokenCount; i++) {
        const og = await contract.methods.tokenOfOwnerByIndex(this.state.account, i).call()
        this.setState({ ogs: this.state.ogs.concat(og)})
        const svg = await contract.methods.renderSvg(og).call()
        this.setState({ svgs: this.state.svgs.concat(svg)})
      }

    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  mint = () => {

   // window.alert(this.state.tokenInput)

    // for (var i = 0; i < this.state.tokenInput.length; i++) {
    //   this.state.contract.methods.mint(this.state.tokenInput[i]).send({ from: this.state.account })
    //     .once('receipt', (receipt) => {
    //       // this.setState({ ogs: this.state.ogs.concat(tokens[i])})
    //       // const svg = this.state.contract.methods.renderSvg(tokens[i]).send({ from: this.state.account })
    //       // this.setState({ svgs: this.state.svgs.concat(svg)})
    //     })
    // }

    // this.state.contract.methods.mintMultiple(this.state.tokenInput).send({ from: this.state.account })
    // .once('receipt', (receipt) => {
    //   window.alert(receipt)
    //   this.setState({ ogs: this.state.ogs.concat(this.state.tokenInput)})

    //   for (var i = 0; i < this.state.tokenInput.length; i++) {
    //     const svg = this.state.contract.methods.renderSvg(this.state.tokenInput[i]).send({ from: this.state.account })
    //     this.setState({ svgs: this.state.svgs.concat(svg)})
    //   }
    // })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      ogs: [],
      svgs: [],
      tokenInput: []
    }
  }

  handleChange = (value) => {
    console.log('Value received from onChange: ' + value)
  }

  tagAdd = (tag) => {
    this.setState({tokenInput: this.state.tokenInput.concat(tag.value)})
  }

  tagDelete = (deletedTag, restTags) => {
    this.setState({tokenInput: restTags})
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://nfttank.github.io/OG/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OG by Tank
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  this.mint()
                }}>
                {/* https://github.com/celebryts/react-autocomplete-tags */}
                <Autocomplete
                  onChange={this.handleChange}
                  onAdd={this.tagAdd}
                  onDelete={this.tagDelete}
                />
                <input
                  type='submit'
                  className='btn btn-block btn-primary'
                  value='mint'
                />
                <a>{this.state.tokenInput.map(t => t + ', ')}</a>
                </form>
              </div>
            </main>
          </div>
          <hr />
          <div className="row text-center">
            {this.state.svgs.map((svg, index) => {
              return (
                <div key={index} className="col-md-3 mb-3">
                  <div dangerouslySetInnerHTML={{__html: svg.replace('height=\'1000\'', 'height=\'1000\' transform=\'scale(0.3)\'')}} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
