import React from 'react';
import ogdozen from '../../assets/ogdozen.png';
import './rules.css';

const Rules = (props) => (
  <div className="og__rules section__padding">
    <div className="og__rules-content">
      <h2 className="gradient__text">Minting</h2>
      <p>OG is a free NFT and has been optimized for the lowest possible gas consumption to really give everyone a chance to get in.</p>
      <p>Everyone can mint up to 10 OG NFTs per wallet. This limit was chosen so that a fair distribution can come about.</p>
      <p>Up to 10 random OG NFTs can be minted with this website, maximum 5 per transaction.</p>
      <p>You don't need to hack our random number generator to get the numbers you want to have. We want you to pick your favorite numbers, find more about this in our Discord.</p>
    </div>
    <div className="og__rules-content">
      <h2 className="gradient__text">OG dozen</h2>
      <p>The numbers <b>1-12</b> are reserved for what we call the "OG dozen".<br/>
      At the moment, we start with the 12 holders of the largest CryptoPunk sales but we as a community can vote others in.</p>
      <img src={ogdozen} />
      <p>
      <span className="gradient__text">But reserves suck!</span><br/>
      Yes but you and every holder wins if this project gets attention from accounts we all look up to.<br/>
      </p>
    </div>
  </div>
);

export default Rules;




