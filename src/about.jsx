import { useState } from "react";
import ojisan from "./assets/salaryman_ojisan.png";
export default function About() {

    const [flipped, setFlipped] = useState(false);

  return (
    <div id="about">
<div class="App">
<h1>What is this?</h1>
  <div class="card-container">
      <div 
            className={`card ${flipped ? "flipped" : ""}`} 
            onClick={() => setFlipped(!flipped)}
          >
      <div class="front">
        <div class="flip-icon"><i class="fas fa-sync-alt"></i></div>

    <p>I wanted some quick shortcut on my phone to launch japanese flashcards. I could have used any other app, but why not build one myself,   
      and here it is. In the end I decided to create it myself, small, not 
      fancy, but straight to the point and clean.</p>
    <p></p>
    <h2 className="nihongo">守護天使</h2>
      </div>
      <div class="back">
        <div class="flip-icon"><i class="fas fa-sync-alt"></i></div>
       <h2>Sources</h2>
    <p>Dataset is based on <a href="https://jlpt-vocab-api.vercel.app/">JLPT-vocab-api</a> plus <a href="https://github.com/scriptin/jmdict-simplified">JMDict-simplified</a></p>
    <p>this is built with react, vite, tears, 悲しみ, and a lot of help from AI</p>
    <p><img src={ojisan} width="100" height="100" /></p>
      </div>
    </div>
  </div>
</div>
    
    <p>I wanted some quick app on my phone to launch quick flashcards. A lot of apps exists, but I was never satisfied. 
        I then decided to create it myself, a little app that brings me right into the action, not big, not fancy, but straight and clean</p>
    <h2>Sources</h2>
    <p>Dataset is based on <a href="https://jlpt-vocab-api.vercel.app/">JLPT-vocan-api</a> plus 
    <a href="https://github.com/scriptin/jmdict-simplified">JMDict-simplified</a></p>
    <h2>More tech</h2>
    <p>this is built with react, vite, tears, 悲しみ, and a lot of help from AI</p>
    </div>
  );
}
