import React from 'react';
import og1 from '../../assets/OG1.svg';
import './header.css';

const Header = (props) => (
  <div className="gpt3__header section__padding" id="home">
    <div className="gpt3__header-content">
      <h1 className="gradient__text">&#35;iamanumber</h1>
      <p>Yet bed any for travelling assistance indulgence unpleasing. Not thoughts all exercise blessing. Indulgence way everything joy alteration boisterous the attachment. Party we years to order allow asked of.</p>

      <div className="gpt3__header-content__input">
        <button type="button">Mint {props.data.totalSupply}</button>
      </div>

    </div>

    <div className="gpt3__header-image">
      <img src={og1} />
    </div>
  </div>
);

export default Header;
