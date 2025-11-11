/*
 * encrypt-it.js
 */
(function() {
  "use strict";

  window.addEventListener("load", init);

  function init() {
    console.log("Window loaded!");

    document.getElementById("encrypt-it").addEventListener("click", handleClick);
    document.getElementById("reset").addEventListener("click", handleReset);
  }

  

  function handleClick() {
    const input = document.getElementById("input-text").value;
    const encrypted = shiftByOne(input);
    document.getElementById("result").textContent = encrypted;
    console.log("Button clicked! Encrypted:", encrypted);
  }

  
  
  function handleReset() {
    document.getElementById("input-text").value = "";
    document.getElementById("result").textContent = "";
    console.log("Reset button clicked!");
  }

  
  
  function shiftByOne(str) {
    let out = "";
    for (let ch of str) {
      if (ch >= "a" && ch <= "z") {
        out += ch === "z" ? "a" : String.fromCharCode(ch.charCodeAt(0) + 1);
      } else if (ch >= "A" && ch <= "Z") {
        out += ch === "Z" ? "A" : String.fromCharCode(ch.charCodeAt(0) + 1);
      } else {
        out += ch; // punctuation, spaces, digits stay the same
      }
    }
    return out;
  }
})();
