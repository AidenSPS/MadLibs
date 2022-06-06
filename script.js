// Globals
var original = null;
var story = [];
var replacements = [];
var modified = null;
var replaceIndex = 1;

/* Function indexSetup  (index.html)
  * Set up index.html dashboard with body onload
  * @param none
  * @returns none
  * Note: avoids getElementById for existing ids
  */
function indexSetup(){
  let description = document.createElement("div");
  description.innerHTML = "<p><strong>Mad Libs</strong> are stories with words removed and replaced by blank spaces. Fill in the blanks for a fun story! Make sure to think outside the box. The wackier the better!</p>";
  window.header.appendChild(description);
  let instructions = document.createElement("div");
  instructions.innerHTML = "<p><strong>Setup:</strong> paste a story, poem or long quote here.  You'll then decide which words to replace, with what parts of speech.</p>";
  instructions.setAttribute("id", "instructions");
  window.actionbox.appendChild(instructions);
  let storyinput = document.createElement("textarea");
  storyinput.setAttribute("id", "storyInput");
  window.actionbox.appendChild(storyinput);
  let pastestory = document.createElement("button");
  pastestory.addEventListener("click", pasteStory);
  pastestory.innerText=("Paste Story");
  window.actionbox.appendChild(pastestory);
}

/* Function Paste Story (changes.html)
  * Creates story array from textarea, puts in local storage, loads changes.html
  * @param none
  * @returns none
  */
function pasteStory(){
  let storyinput = document.getElementById("storyInput")
  original = storyinput.value;
  localStorage.setItem('original', original);
  story = original.split(" ");
  localStorage.setItem('story', JSON.stringify(story));
  location.assign("changes.html");
}

/* Function changesSetup (changes.html)
  * Set up changes.html dashboard with body onload
  * @param none
  * @returns none
  * Note: pulls story from local storage and calls makeNumberedString to fill storyShow
  */
function changesSetup(){
  window.header.innerHTML="<h1>Mad Libs</h1><h2></h2><p></p>";
  instructions = header.getElementsByTagName("h2")[0];
  instructions.innerHTML=("Program Word Substitutions");
  instructions = header.getElementsByTagName("p")[0];
  instructions.innerHTML=("Enter word number, retype the word, and say the part of speech.");
  let storyshow = document.getElementById("storyShow");
  story = JSON.parse(localStorage.getItem("story"));
  storyshow.innerHTML=makeNumberedString();

  //Done Button
  let doneButton = document.createElement("button");
  doneButton.setAttribute("id","done");
  doneButton.setAttribute("onClick","donePOS()");
  doneButton.innerText = "Done";
  window.actionbox.appendChild(doneButton);
}

/* Function Make Numbered String  (changes.html)
  * Creates a string that numbers each word in story
  * @param array story
  * @returns string modified
  * Note: adds CSS spans to make index numbers superscripted
  */
function makeNumberedString(){
  modified = "";
  for (let word = 0; word < story.length; word++){
    modified += story[word] + "<span>" + word + "</span> ";
  }
  return modified;
}

/* Function Next Part of Speech (changes.html)
  * Pulls data from form and populates replacements array, fills storyShow with makeReplacedString
  * @param none
  * @returns none
  * Note: OrigWord is for error checking, but error check not yet implemented
  */
function nextPOS(){ //THIS IS THE PROBLEM, NOT POPULATING REPLACEMENTS ARRAY 
  let Index = document.getElementById("index").value;
  let OrigWord = document.getElementById("origWord").value;
  let pOS = document.getElementById("POS").value;
  let metaWord = [Index, OrigWord, pOS];
  // Check if word matches before adding. 
  replacements.push(metaWord);
  localStorage.setItem('replacements', JSON.stringify(replacements));
  modified = makeReplacedString();
  let storyshow = document.getElementById("storyShow");
  storyshow.innerHTML = modified;
}

/* Function Make Replaced String  (changes.html)
  * Integrates POS substitutions into modified string
  * @param array story
  * @returns string modified
  * Note: adds strong tags to highlight replacements.
  */
function makeReplacedString(){
  modified = "";
  for (let w = 0; w < story.length; w++){
    replaced = false;
    for (let r = 0; r < replacements.length; r++) {
      if (replacements[r][0] == w){
        modified += "<strong>" + replacements[r][2] + "</strong><span>" + w + "</span> ";
        replaced = true;    
      }
    }
    if (replaced == false) {
      modified += story[w] + "<span>" + w + "</span> ";
    }
  }
  return modified;
}

/*Player
    @params none
    @return none
*/
function donePOS(){ //Sends us to player.html, and brings over story
  //need to carry over replacements
  localStorage.setItem('replacements', JSON.stringify(replacements));
  document.location = 'player.html';
}
/* Function playerSetup (player.html)
  * Set up player.html dashboard with body onload
  * @param none
  * @returns none
  * Note: prompt player with the part of speech and recieve replacement words.
  */
function playerSetup(){ //Sets up the Player's Interface
  //Title Code
  window.header.innerHTML="<h1>Mad Libs</h1><h2></h2><p></p>";
  instructions = header.getElementsByTagName("h2")[0];
  instructions.innerHTML=("Enter replacement words");
  instructions = header.getElementsByTagName("p")[0];
  instructions.innerHTML=("Find a wacky word to replace, can be anything within the part of speech that is given.");

  //Div that displays the new modified story with all the parts of speech replacing the words that were initially there
  let posDiv = document.createElement("div");
  posDiv.setAttribute("id","posDiv");
  window.actionbox.appendChild(posDiv);

  //Tells the user to type in a POS (verb,noun,adjective,etc...);
  let replaceWord = document.createElement("input");
  replaceWord.setAttribute("id","newWord");
  window.actionbox.appendChild(replaceWord);

  //Done Button
  let nextButton = document.createElement("button");
  nextButton.setAttribute("id","done");
  nextButton.setAttribute("onClick","nextReplace()");
  nextButton.innerText = "Next";
  window.actionbox.appendChild(nextButton);
  firstReplacement();
}

function firstReplacement(){ //This is going to display the first modified item in the JSON.stringify array from function donePOS();
  let newWord = document.getElementById("newWord");
  let replacements = localStorage.getItem('replacements');
  let posDiv = document.getElementById("posDiv");
  posDiv.innerHTML = replacements[replaceIndex][2]; //Visits notes for more information
}