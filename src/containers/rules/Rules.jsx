import React from 'react';
import './rules.css';

const Rules = (props) => (
  <div className="og__rules section__padding">
    <div className="og__rules-content">
      <h2 className="gradient__text">Minting</h2>
      <p>OG is a free NFT and has been optimized for the lowest possible gas consumption to really give everyone a chance to get in.</p>
      <p>Minting will start from token <span className="gradient__text"><b>13</b></span> up to token <span className="gradient__text"><b>9999</b></span>. The most desirable tokens <span className="gradient__text"><b>1-12</b></span> are called the "OG dozen" and will be available during the mint phase.</p>
      <p>Everyone can mint up to <u>10 OG tokens per wallet</u>. This limit was chosen so that a fair distribution can come about.</p>
      <p>OG tokens are public domain with a CC0 license. Feel free to use your OG tokens in any way you want.<br/>
      This website itself is open-source and can be found along with the OG contract on <a href='https://github.com/nfttank/OG'>GitHub</a>.</p>
    </div>
    <div className="og__rules-content">
      <h2 className="gradient__text">OG dozen</h2>
      <p>The numbers <span className="gradient__text"><b>1</b></span> to <span className="gradient__text"><b>12</b></span> are called the "OG dozen" and are unlocked <u>once 50%</u> of all tokens are minted.</p>
      <p>Once this limit is reached, the contract will automatically unlock the tokens while an additional UI will be embedded into this website to mint.</p>
      <p>Each successful OG dozen mint will give you one token, starting from <span className="gradient__text"><b>12</b></span> up to <span className="gradient__text"><b>1</b></span>.</p>
      <p>Please note that OG dozen tokens are no different than any other OG token, it's just about the prestigious low numbers.<br/>
      That means that the limit of 10 tokens per wallet does also apply to the OG dozen mint. Make sure you have some slots available.</p>
    </div>
  </div>
);

export default Rules;




