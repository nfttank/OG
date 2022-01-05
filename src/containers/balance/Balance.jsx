import React from 'react';
import { OgImg } from '../../components';
import './balance.css';

const Balance = (props) => (
  <div className="og__balance section__padding" id="balance">
    <div className="og__balance-heading">
      <h1 className="gradient__text">
        {
          props.data.walletLoaded ? 
            (
              props.data.balance == 0 
                ? "No OGs yet :(" 
                : (props.data.balance == 1 ? "You own an amazing OG" : "You own " + props.data.balance + " amazing OGs")
            )
            : "Checking wallet ..."
        }</h1>
    </div>
    <div className="og__balance-container">
    {
      props.data.ownedOgs.map((og) => {
      return (<OgImg data={{storeUrl: props.data.storeUrl, id: og.id, svg: og.svg}} />)
    })}
    </div>
  </div>
);

export default Balance;
