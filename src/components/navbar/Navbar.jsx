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
        {   props.data.account === '' &&
                <button >Not connected</button>
        }
        {   props.data.account !== '' &&
                <button>{props.data.account}</button>
        }
        <a href={props.data.storeUrl} target="_blank" rel="noopener noreferrer">OpenSea</a>
        <a href={props.data.ogTwitterUrl} target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href={props.data.discordUrl} target="_blank" rel="noopener noreferrer">Discord</a>
        <a href={props.data.contractUrl} target="_blank" rel="noopener noreferrer">Contract</a>
      </div>
    </div>
  );
};

export default Navbar;
