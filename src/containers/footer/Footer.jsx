import React from 'react';
import tank from '../../assets/4227.png';
import './footer.css';

const Footer = (props) => (
  <div className="gpt3__footer section__padding">
    <div className="gpt3__footer-heading">
      <h1 className="gradient__text">We are web3.</h1>
    </div>

    <div className="gpt3__footer-copyright">
      <p>Free ERC721 tokens with a CC0 public domain license. Feel free to use your OGs in any way you want.</p>
      <a href={props.data.tankTwitterUrl} target="_blank" rel="noopener noreferrer">
        <img className="gpt3__footer-avatar" src={tank} />
      </a>
      <p>Made by Tank &#10084;</p>
    </div>
  </div>
);

export default Footer;
