import React from 'react';
import { OgImg } from '../../components';
import './balance.css';

const Balance = (props) => (
  <div className="og__balance section__padding" id="balance">
    <div className="og__balance-heading">
      <h1 className="gradient__text">Your wallet</h1>
      <h2 className="gradient__text">
        {
          props.data.walletLoaded ? 
            (
              props.data.balance > 0 
                ? (props.data.balance == 1 ? "You own an amazing OG" : "You own " + props.data.balance + " amazing OG NFTs")
                : "No OG NFTs yet :(" 
            )
            : "Checking wallet ..."
        }</h2>
    </div>
    <div className="og__balance-container">
    {
      props.data.ownedOgs.map((og) => {
      return (<OgImg key={og.id} data={{storeUrl: props.data.storeUrl, id: og.id, svg: og.svg, useLink: true}} />)
    })}
    </div>
  </div>
);

export default Balance;
