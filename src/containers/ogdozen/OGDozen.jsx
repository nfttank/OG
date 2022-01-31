import React from 'react';
import './ogdozen.css';

const OGDozen = (props) => (
    <div className="og__ogdozen section__padding">
        <div className="og__ogdozen-content">
            <h2>OG dozen minting available now 🥳</h2>
            <p>
            The unlock supply has been met and the 12 most desirable tokens can now be minted.<br/>
            Get your OG dozen token now, starting from 12 up to 1.<br/>
            </p>
        </div>
        <div className="og__ogdozen-btn">
            <button type="button" onClick={props.data.mintOgDozenFunction}>Mint</button>
        </div>
    </div>
);

export default OGDozen;
