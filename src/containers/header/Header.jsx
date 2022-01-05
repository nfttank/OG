import React from 'react';
import { OgImg } from '../../components';
import './header.css';

const Header = (props) => (
  <div className="og__header section__padding" id="home">
    <div className="og__header-content">
      <h1 className="gradient__text">OG by Tank</h1>
      <p>
        We are punks. We are apes. We are cats, dogs, wolfs, toads and even fucking pickles.<br/>
        We are kidding around but we are the future of web3 and decentralization.<br/>
      </p>
      <p> And yet we fight each other.</p>
      <p>
        Whatever profile picture we are hiding behind:<br/>
        In the end, it's a number that identifies us on the blockchain, no matter in which collection.<br/>
      </p>
      <p className="gradient__text">We are one big community and OG is a big, fat <b>thank you</b> for being a number with me.</p>
      <p></p>
      <div className="og__header-content__input">
        <button onClick={props.data.mintFunction} type="button">
          {
            props.data.soldOut
            ? "Sold out 🥳"
            : (
              props.data.walletLoaded ? 
              (
                props.data.remainingMintsForWallet === 0 
                  ? "Wallet limit of " + props.data.maxPerWallet + " reached."
                  : "Mint " + props.data.remainingMintsForWallet.toString() + " random OG number" + (props.data.remainingMintsForWallet === 1 ? "" : "s") + " (" + (10000 - props.data.totalSupply).toString() + " left)"
              )
              : "Mint OG"
            )
          }
        </button>
      </div>
      <p className="smalltext">Minting is limited to {props.data.maxPerWallet} per wallet.<br/>You can choose custom numbers too, check our Discord.</p>
    </div>
    <div className="og__header-image">
      <OgImg data={{storeUrl: props.data.storeUrl, id: props.data.featuredOg.id, svg: props.data.featuredOg.svg}} />
    </div>
  </div>
);

export default Header;