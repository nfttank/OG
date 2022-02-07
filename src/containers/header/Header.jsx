import React from 'react';
import { OgImg } from '../../components';
import './header.css';

const Header = (props) => (

  <div className="og__header section__padding" id="home">
    <div className="og__header-content">
      <h1 className="gradient__text">OG by Tank</h1>
      <p>
        We are punks. We are apes. We are cats, dogs, toads and even fucking pickles.<br/>
        We are just fooling around but we are already shaping the future of the internet.
      </p>
      <p>
        Whatever profile picture we are spinning up: In the end, it's a number that identifies us within the collection we are most proud of.<br/>
      </p>
      <p>But we are more than different collections competing with each other.</p>
      <p className="gradient__text"><b>We are one big community and OG is a big fat *thank you* for being a number with me.</b></p>
      <p></p>
      <div className="og__header-content__input">
        { props.data.canMint && !props.data.soldOut && props.data.walletLoaded && props.data.remainingMintsForWallet !== 0 && <button className="plusminus" onClick={() => props.data.mintCountAdd(-1)} type="button">-</button> }
        { props.data.canMint && 
          <button onClick={props.data.mintFunction} type="button">
          {
            props.data.soldOut
            ? "Sold out 🥳"
            : (
                props.data.walletLoaded ? 
                (
                  props.data.remainingMintsForWallet === 0 
                    ? "Wallet limit of " + props.data.maxPerWallet + " reached."
                    : "Mint " + props.data.mintCount.toString()
                )
                : "Mint OG"
              )
          }
        </button>
        }
        { props.data.canMint && !props.data.soldOut && props.data.walletLoaded && props.data.remainingMintsForWallet !== 0 && <button className="plusminus" onClick={() => props.data.mintCountAdd(+1)} type="button">+</button> }
      </div>
      { props.data.canMint && 
        <p className="smalltext">Mints are free but limited to {props.data.maxPerWallet} per wallet. 
        {
            props.data.walletLoaded
            ? <span className="gradient__text"><b>{(9999 - props.data.totalSupply).toString()} left.</b></span>
            : ""
        }
        </p>
      }
      { 
      !props.data.canMint && <h2><span className="gradient__text">Tuesday 08, Feb. 2022 8:00 PM CET</span></h2>
      }
    </div>
    <div className="og__header-image">
      <OgImg data={{storeUrl: props.data.storeUrl, id: props.data.featuredOg.id, svg: props.data.featuredOg.svg, useLink: props.data.featuredOgExists}} />
    </div>
  </div>
);

export default Header;