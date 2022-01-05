import React from 'react';
import tank from '../../assets/4227.png';
import './footer.css';

const Footer = (props) => (
  <div className="og__footer section__padding">
    <div className="og__footer-heading">
      <h2 className="gradient__text">We are web3.</h2>
    </div>

    <div className="og__footer-copyright">
      <p>Free ERC721 tokens with a CC0 public domain license. Feel free to use your OG tokens in any way you want.</p>
      <a href={props.data.tankTwitterUrl} target="_blank" rel="noopener noreferrer">
        <img className="og__footer-avatar" src={tank} />
      </a>
      <p>Made by Tank &#10084;</p>
    </div>
  </div>
);

export default Footer;
