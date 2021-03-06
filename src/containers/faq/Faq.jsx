import React from 'react';
import './faq.css';

const Rules = (props) => (
  <div className="og__faq section__padding">
    <div className="og__faq-content">
      
      <h2 className="gradient__text">Why should I mint? These are just numbers, right?</h2>
      <p>Yes. Every OG token represents a number from <span className="gradient__text"><b>1</b></span> to <span className="gradient__text"><b>9999</b></span>.<br/>
      But holding OG is more than just holding numbers: It's a bet on Tank and Tank's upcoming projects.</p>
      
      <h2 className="gradient__text">So it's kind of a whitelist, too?</h2>
      <p>Yes.</p>
            
      <h2 className="gradient__text">Is there a roadmap?</h2>
      <p>Yes and no. OG is completed but will be a part in upcoming projects.</p>

      <h2 className="gradient__text">Is there some additional utility?</h2>
      <p>Same as above.</p>

      <h2 className="gradient__text">Can I customize my OG tokens or do I have to live with black and white?</h2>
      <p>Simplicity is key. But someone loves easter eggs.</p>

      <h2 className="gradient__text">Is there a rarity score?</h2>
      <p>Most people might think that token <span className="gradient__text"><b>1</b></span> should be superior to token <span className="gradient__text"><b>4227</b></span> but it's up to everyone.<br/>
      There's no rarity beside this except - you name it - memes.</p>

      <h2 className="gradient__text">Why just a number?</h2>
      <p>A lot of web3 pioneers identify themselves with numbers online, especially within the CryptoPunks and BAYC collections. They are building brands around simple numbers today, OG is to honor those.</p>

    </div>
  </div>
);

export default Rules;