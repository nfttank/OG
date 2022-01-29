import React from 'react';
import './ogimg.css';

const OgImg = (props) => {

  const cleanSvg = props.data.svg === undefined
  ? ""
  : (props.data.svg + "")
      .replace('height=\'1000\'', '')             /* eliminate height and width to do scaling */
      .replace('width=\'1000\'', '')              /* eliminate height and width to do scaling */
      .replace(/back/g, "back" + props.data.id)   /* make color fills unique, otherwise svgs would reuse the fills of others on the pages */
      .replace(/frame/g, "frame" + props.data.id)
      .replace(/digit/g, "digit" + props.data.id)
      .replace(/slug/g, "slug" + props.data.id)

  const link = props.data.useLink ? props.data.storeUrl + "/" + props.data.id : ""

  return (
    <div className="og-image" >
      {
        props.data.useLink && 
        <a href={link} target="_blank" rel="noopener noreferrer">
          <div dangerouslySetInnerHTML={{__html: cleanSvg }} />
        </a>
      }
      {
        !props.data.useLink && 
          <div dangerouslySetInnerHTML={{__html: cleanSvg }} />
      }
  </div>
  );
};

export default OgImg;