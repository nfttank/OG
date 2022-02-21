import React from 'react';
import './ogcolor.css';
import { OgImg } from '../../components';

const OGColor = (props) => (

    <div className="og_ogcolor section__padding">
        <div className="og_ogcolor-content">
            <h2>OG customization available now</h2>
            <p>Which part of your OG tokens do you want to customize?</p>
        </div>
        <div className="og_ogcolor-radio">
            <div type="ogcontainer">
                <OgImg data={{id: props.data.ogDigit.id, svg: props.data.ogDigit.svg, useLink: false}} />
                <button type="button" onClick={props.data.mintOgDozenFunction}>Digit</button>
            </div>
            <div type="ogcontainer">
                <OgImg data={{id: props.data.ogFrame.id, svg: props.data.ogFrame.svg, useLink: false}} />
                <button type="button" onClick={props.data.mintOgDozenFunction}>Frame</button>
            </div>
            <div type="ogcontainer">
                <OgImg data={{id: props.data.ogBack.id, svg: props.data.ogBack.svg, useLink: false}} /> 
                <button type="button" onClick={props.data.mintOgDozenFunction}>Back</button>
            </div>
        </div>
        <div className="og_ogcolor-footer">
            <p><b>Customization is achieved by minting tokens of a second NFT collection: OG Color.</b></p>
            <ul>
                <li>Limited to only 2500 customizations for 10000 OG tokens</li>
                <li><a href="https://opensea.io/collection/ogcolor-nft-official" target="_blank" rel="noopener noreferrer" >Tradable</a> ERC721 tokens</li>
            </ul>
            
            <p>
            <a href="https://twitter.com/og_nft_official/status/1491512933800685571?s=20&t=oJRKh5LTxION1c8tAGV-cw" target="_blank" rel="noopener noreferrer" >Learn more about the interaction between OG and OG Color here.</a><br/>
            <br/>
                OG Color tokens will customize your OG tokens dynamically as long as they are located in the same wallet.<br/>
                Don't forget to tefresh OpenSea's metadata after minting or trading.
            </p>
        </div>
    </div>
);

export default OGColor;
