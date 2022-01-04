import React from 'react';
import { OgImg } from '../../components';
import './header.css';

const Header = (props) => (
  <div className="gpt3__header section__padding" id="home">
    <div className="gpt3__header-content">
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
      <div className="gpt3__header-content__input">
        <button onClick={props.data.mintFunction} type="button">Mint 5 random OG numbers ({10000 - props.data.totalSupply} left)</button>
      </div>
      <p className="smalltext">(You can choose custom numbers too, check our Discord)</p>
    </div>

    <OgImg className="gpt3__header-image" data={{storeUrl: props.data.storeUrl, id: props.data.featuredOg.id, svg: props.data.featuredOg.svg}} />
    
  </div>
);

export default Header;




      {/* <p>The rules</p>
      <ul>
        <li>The <b>OG dozen</b> from <b>1-12</b> can only be minted by the top 12 CryptoPunk holders</li>
        <li>The <b>OG dozen</b> can be minted after 5000 OGs were minted.</li>
        <li>Everyone can mint any number for free.</li>
        <li>Minting is limited to a maximum of <b>10</b> per wallet</li>
      </ul> */}