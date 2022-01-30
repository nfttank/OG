import React from 'react';
import './rules.css';

const Rules = (props) => (
  <div className="og__rules section__padding">
    <div className="og__rules-content">
      <h2 className="gradient__text">Minting</h2>
      <p>OG is a free NFT and has been optimized for the lowest possible gas consumption to really give everyone a chance to get in.</p>
      <p>Everyone can mint up to 10 OG tokens per wallet. This limit was chosen so that a fair distribution can come about.</p>
      <p>OG tokens are public domain with a CC0 license. Feel free to use your OG tokens in any way you want. This website itself is open-source and can be found on GitHub.</p>
    </div>
    <div className="og__rules-content">
      <h2 className="gradient__text">OG dozen</h2>
      <p>The numbers <span className="gradient__text"><b>1</b></span> to <span className="gradient__text"><b>12</b></span> are called the "OG dozen" and can be minted once 50% of all tokens are minted.</p>
      <p>Once this limit is reached, the contract will automatically unlock the tokens <span className="gradient__text"><b>2-12</b></span>.<br/>
      Be prepared and make sure you moved some OG tokens to another wallet so you can mint more.</p>
      <p className="gradient__text"><b>What about token 1?</b></p>
      <p>Needless to say <span className="gradient__text"><b>1</b></span> is the most special token.<br/>
      It gets available to mint once the tokens <span className="gradient__text"><b>2-12</b></span> are minted.<br/><br/>
      Timing is everything.</p>
    </div>
  </div>
);

export default Rules;




