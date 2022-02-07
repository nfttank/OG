import React from 'react';
import './navbar.css';

const Navbar = (props) => {

  return (
    <div className="og__navbar">
      <div className="og__navbar-links">
        <div className="og__navbar-links_logo">
          <h1 className="gradient__text">&#35;iamanumber</h1>
        </div>
      </div>
      <div className="og__navbar-sign">
        {   props.data.connected === false &&
                <button onClick={props.data.connectFunction}>Connect</button>
        }
        {   props.data.connected === true &&
                <button>{props.data.signerAddress.substring(0, 7)}...{props.data.signerAddress.substring(props.data.signerAddress.length-7)}</button>
        }
        <a href={props.data.discordUrl} target="_blank" rel="noopener noreferrer" title="Discord">D</a>
        <a href={props.data.ogTwitterUrl} target="_blank" rel="noopener noreferrer" title="Twitter">T</a>
        {/* <a href={props.data.looksRareUrl} target="_blank" rel="noopener noreferrer" title="LooksRare">L</a>
        <a href={props.data.openSeaStorefrontUrl} target="_blank" rel="noopener noreferrer" title="OpenSea">O</a> */}
        <a href={props.data.contractUrl} target="_blank" rel="noopener noreferrer" title="Contract on Etherscan">E</a>
      </div>
    </div>
  );
};

export default Navbar;
