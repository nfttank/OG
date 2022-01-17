import React from 'react';
import './ogimg.css';

const OgImg = (props) => {

  return (
    <div className="og-image" >
      <a href=
      {
        props.data.useLink
        ? props.data.storeUrl + "/" + props.data.id
        : ""
      }>
      <div dangerouslySetInnerHTML={{__html:
        props.data.svg === undefined
        ? "" // otherwise "undefined" will pop up before the svg is rendered
        : (props.data.svg + "")
          .replace('height=\'1000\'', '')             /* eliminate height and width to do scaling */
          .replace('width=\'1000\'', '')              /* eliminate height and width to do scaling */
          .replace(/back/g, "back" + props.data.id)   /* make color fills unique, otherwise svgs would reuse the fills of others on the pages */
          .replace(/frame/g, "frame" + props.data.id)
          .replace(/digit/g, "digit" + props.data.id)
          .replace(/slug/g, "slug" + props.data.id)
      }} />
      </a>
  </div>
  );
};

export default OgImg;