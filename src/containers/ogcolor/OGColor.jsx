import React from 'react';
import './ogcolor.css';
import { OGColorPicker } from '..';

const OGColor = (props) => (

    <div className="og_ogcolor section__padding">
        <div className="og_ogcolor-content">
            <h2>OG customization {props.data.ogColorSoldOut ? "sold out 🥳" : "available now"}</h2>
            {!props.data.connected && <p>Connect your wallet to customize your OG tokens.</p>}
            {props.data.connected && !props.data.ogColorSoldOut && <p>Choose a color and mint your OG Color tokens now.</p>}
            {props.data.connected && props.data.ogColorSoldOut && <p>Sorry, you are too late to mint. <a href="https://opensea.io/collection/ogcolor-nft-official" target="_blank" rel="noopener noreferrer" >Try to get some secondary here</a>.</p>}
        </div>
        <div className="og_ogcolor-radio" >
            <OGColorPicker data={ { application: "digit", ogId: props.data.ogDigit.id, ogSvg: props.data.ogDigit.svg, mint: props.data.mintOgColorFunction, soldOut: props.data.ogColorSoldOut, connected: props.data.connected }}/>
            <OGColorPicker data={ { application: "frame", ogId: props.data.ogFrame.id, ogSvg: props.data.ogFrame.svg, mint: props.data.mintOgColorFunction, soldOut: props.data.ogColorSoldOut, connected: props.data.connected}}/>
            <OGColorPicker data={ { application: "back", ogId: props.data.ogBack.id, ogSvg: props.data.ogBack.svg, mint: props.data.mintOgColorFunction, soldOut: props.data.ogColorSoldOut, connected: props.data.connected }}/>
        </div>
        <div className="og_ogcolor-footer">
            <p><b>Customization is achieved by minting tokens of a second NFT collection: <a href="https://opensea.io/collection/ogcolor-nft-official" target="_blank" rel="noopener noreferrer" >OG Color</a>.</b></p>
            <ul>
                <li>Limited to only 2500 customizations for 10000 OG tokens</li>
                <li><a href="https://opensea.io/collection/ogcolor-nft-official" target="_blank" rel="noopener noreferrer" >Tradable</a> ERC721 tokens</li>
            </ul>
            
            <p>
            <a href="https://twitter.com/og_nft_official/status/1491512933800685571?s=20&t=oJRKh5LTxION1c8tAGV-cw" target="_blank" rel="noopener noreferrer" >Learn more about the interaction between OG and OG Color here.</a><br/>
            <br/>
                OG Color tokens will customize your OG tokens dynamically as long as they are located in the same wallet.<br/>
                Don't forget to refresh OpenSea's metadata after minting or trading.
            </p>
        </div>
    </div>
);

export default OGColor;
