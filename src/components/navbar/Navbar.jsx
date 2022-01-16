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
                <button>{props.data.signerAddress}</button>
        }
        <a href={props.data.discordUrl} target="_blank" rel="noopener noreferrer">Discord</a>
        <a href={props.data.ogTwitterUrl} target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href={props.data.looksRareUrl} target="_blank" rel="noopener noreferrer">LooksRare</a>
        <a href={props.data.openSeaUrl} target="_blank" rel="noopener noreferrer">OpenSea</a>
        <a href={props.data.contractUrl} target="_blank" rel="noopener noreferrer">Contract</a>
      </div>
    </div>
  );
};

export default Navbar;
