import React from 'react';
import './ogimg.css';

const OgImg = (props) => {

  return (
    <div className="og-image" >
    <a href={props.data.storeUrl + "/" + props.data.id}>
      <div dangerouslySetInnerHTML={{__html:
        props.data.svg === undefined
        ? "" // otherwise "undefined" will pop up before the svg is rendered
        : (props.data.svg + "").replace('height=\'1000\'', '').replace('width=\'1000\'', '') // eliminate height and width to do scaling
      }} />
    </a> 
  </div>
  );
};

export default OgImg;