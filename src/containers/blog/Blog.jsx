import React from 'react';
import { OgImg } from '../../components';
import './blog.css';

const Blog = (props) => (
  <div className="og__blog section__padding" id="blog">
    <div className="og__blog-heading">
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
    <div className="og__blog-container">
    {
      props.data.ownedOgs.map((og) => {
      return (<OgImg data={{storeUrl: props.data.storeUrl, id: og.id, svg: og.svg}} />)
    })}
    </div>
  </div>
);

export default Blog;
