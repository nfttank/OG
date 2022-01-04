import React from 'react';
import './ogimg.css';

const OgImg = (props) => {

  return (
    <div className="og-image" >
    <a href={props.data.storeUrl + "/" + props.data.id}>
      {/* eliminate height and width to do scaling */}
      <div dangerouslySetInnerHTML={{__html: (props.data.svg + "").replace('height=\'1000\'', '').replace('width=\'1000\'', '')}} />
    </a> 
  </div>
  );
};

export default OgImg;