// A regex expression designed to find a collection of the most common redundant words.
var expression = /(?:www\.|\.com|\W|\d|\bvideo\b|\bsubscribe\b|\bphoto\b|\bvideos\b|\bworking\b|\bout\b|\band\b|\btime\b|\bperson\b|\byear\b|\bway\b|\bday\b|\bthing\b|\bworld\b|\blife\b|\bhand\b|\bpart\b|\beye\b|\bplace\b|\bweek\b|\bcase\b|\bpoint\b|\bgovernment\b|\bcompany\b|\bnumber\b|\bgroup\b|\bproblem\b|\bfact\b|\bbe\b|\bhave\b|\bdo\b|\bsay\b|\bget\b|\bmake\b|\bgo\b|\bknow\b|\btake\b|\bsee\b|\bcome\b|\bthink\b|\blook\b|\bwant\b|\bgive\b|\buse\b|\bfind\b|\btell\b|\bask\b|\bseem\b|\bfeel\b|\btry\b|\bleave\b|\bcall\b|\bgood\b|\bnew\b|\bfirst\b|\blast\b|\blong\b|\bgreat\b|\blittle\b|\bown\b|\bother\b|\bold\b|\bright\b|\bbig\b|\bhigh\b|\bdifferent\b|\bsmall\b|\blarge\b|\bnext\b|\bearly\b|\bimportant\b|\bfew\b|\bpublic\b|\bbad\b|\bsame\b|\bable\b|\bto\b|\bof\b|\bin\b|\bfor\b|\bon\b|\bwith\b|\bat\b|\bby\b|\bfrom\b|\bup\b|\babout\b|\binto\b|\bover\b|\bafter\b|\bthe\b|\band\b|\ba\b|\bthat\b|\bI\b|\bit\b|\bnot\b|\bhe\b|\bas\b|\byou\b|\bthis\b|\bbut\b|\bhis\b|\bthey\b|\bher\b|\bshe\b|\bor\b|\ban\b|\bwill\b|\bmy\b|\bone\b|\ball\b|\bwould\b|\bthere\b|\btheir\b|\byour\b|\bs\b|\bhow\b|\bthese\b|\bcan\b|\bis\b|\bt\b|\bwhat\b|\bsays\b|\bways\b|\breally\b|\bthings\b|\bwhy\b|\bare\b|\binformation\b|\bmyself\b|\bshares\b|\breveals\b|\bpeople\b|\bneed\b|\bpacked\b|\bgoing\b|\bwas\b|\bloss\b|\bthan\b|\beasier\b|\bdonate\b|\bsome\b|\bhandle\b)/ig





// Array created out of the page's meta tags: 'description' and 'keywords' + h1-h3 textContent, and all img.alts.
//var allKeySources = [...document.querySelectorAll('meta[name="description"],meta[name="keywords"],h1,h2,h3,img[alt]:not([alt=""]')]
var allKeySources = Array.prototype.slice.call(document.querySelectorAll('meta[name="description"],meta[name="keywords"],h1,h2,h3,img[alt]:not([alt=""]')
);

function funnelWords(arr){
var allKeyWords = [];

//For loop designed to extract all strings out of allKeySources.
for(var i = 0; i<arr.length; i++ ){
switch (allKeySources[i].tagName.toLowerCase()) {
  case 'meta':
allKeyWords.push(allKeySources[i].content);
    break;
case 'img':
allKeyWords.push(allKeySources[i].alt);
    break;
case 'h1':
case 'h2':
case 'h3':
allKeyWords.push(allKeySources[i].textContent);
    break;
}
}
// We turn the strings into one string, replace the redundant words with whitespace, turn the string back into
// an array, and delete empty strings.
return allKeyWords.toString().replace(expression,' ').toLowerCase().split(' ').filter(function(word){return word.length>2});
}

//Function designed to organize an array by most frequent appearence in it, and then delete the each string's doubles.
function sortByFrequency(array) {
    var frequency = {};

    array.forEach(function(value) { frequency[value] = 0; });

    var uniques = array.filter(function(value) {
        return ++frequency[value] == 1;
    });

    return uniques.sort(function(a, b) {
        return frequency[b] - frequency[a];
    });
}

// Collect key words in var.
var allKeyWords = funnelWords(allKeySources);
// Return most frequent key words by order of appearing most.
var wordsForAds = sortByFrequency(allKeyWords);




//HTML INJECTION

// Creating a word class that will help automate the injection of each new recommended content box later on.
function wordClass(word, frequency){
this.word = word;
this.frequency = frequency;

this.create = function(placementSelector){
var aEl = document.createElement('a');
aEl.setAttribute('href', '#');
aEl.innerHTML += '<li style="display: block;width: 24%;height: 100%; background-color: #333333; float: left;\
margin-left:'+(frequency === 0? '.5' : '1')+'%;position: relative;"><p style="text-decoration:none; color: #fff;text-transform: uppercase;text-align: center;top: 10%;font-size:80%;margin:10px 5px 0px 5px;">\
content related to this site\'s most common keyword #'+(this.frequency + 1)+':</br><strong>'+this.word+'</strong></p></li>';

// Instruction to inject html to the relevant placement selector.
Array.prototype.forEach.call(document.querySelectorAll(placementSelector),function(el){
el.appendChild(aEl)
});
}
}

// Create an array of top 4 used words as each as wordClass, each with a matching index to signify its frequency-of-appearence hierarchy.
var specialWordsClasses = wordsForAds.splice(0,4).map(function (word, index){
return new wordClass(word, index);
});

// Create the nesting div inside which we will nest the content boxes with the script's activation.
var newDiv = document.createElement('div');
newDiv.setAttribute('id', 'hal-ad-box');
newDiv.innerHTML += 
'<div style="max-width: 1140px; margin:0 auto;margin-bottom: 5vh;margin-top: 5vh;">\n'+
'<ul style="zoom:1; list-style: none; width: 100%; height: 30vh;">\n'+


'</ul>\n'+
'<div style="content: ".";clear: both;display: block;height: 0;visibility: hidden;"></div>\n'+
'</div>';

// This area defines the point of injection and must be tweaked for each websites needs.
var footer = document.querySelector('footer');

// Test to prevent adding the content boxes more than once.
if (!document.querySelector('#hal-ad-box')){
document.body.insertBefore(newDiv,footer);

// Activating the specialWordsClasses method: 'create' and giving it a placement selector.
specialWordsClasses.forEach(function(word){
word.create('#hal-ad-box ul');
});    
}
