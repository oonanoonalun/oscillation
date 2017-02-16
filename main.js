//CURRENT ISSUE/S:
//Line 254 has a line of code that is copied from a console.log line in the main loop that appears to be returning good values (in the log),
//      but it isn't working at line 254. The only difference is that in the console log it's "nodes[0].neighbors" and in line 254 it's "node.neighbors."
//      In line 254, replacing the tract "divideColorByNumber(findNeighborsColor(node.neighbors), 2)), 2));" with "[59, 21, 87]), 2)); makes it function fine.
//      The error reported in the browser's console is:
//Uncaught TypeError: Cannot read property 'currentIntensity' of undefined
//    at findOscillatorsColor (main.js:260)
//    at findNeighborsColor (main.js:269)
//    at drawNode (main.js:254)
//    at drawAllNodes (main.js:288)
//    at mainLoop (main.js:335)
//              "Cannot read property 'currentIntensity' of undefined" seems suggests that a node isn't being located when
//                      "findNeighborsColor" is being sent the currently-being-drawn node's neighbors list.
//                      "findNeighborsColor," as demonstrated by the console.log line, seems to be working.












//Neighbors-finding function isn't doing anywhere near what it's supposed to, line 137.

//GAME IDEA:
//You can only interact with a node when it's near its brightest (i.e. it's "closer" vs. the recession of darkness).
//      - Add a boolean object element "accessible" to nodes.
//      - Have it get put to "true" when its brightness (either any of rgb or their average) gets to be 75% of its maxIntensity (or of maxBrightness).
//      - It should change color in this state so that it can be recognized.
//      - What would be the nature of your interaction with it?
//The whole "net" can "get away from you" (i.e. become too distant to interact with) if you don't foster its "closeness." This would be a failure condition.
//The gameplay objectives should be cyclical, so that if secure something in a self-reinforcing feeback loop of "closeness,"
//      then the objective becomes something new, eventually leading back to needing to "secure it close."
//Later, each node should have intelligence, and perhaps some further markes to tell you about their states (i.e something in the middle).

//Next step is to make it so that:
//      - when a node is selected
//              - it picks up the influence of all currently-selected oscillators
//              - and retains those influences regardless of whether
//                      - it or any of the oscillators by which it is currently affected are *de*selected
//Also, there needs to be a way to clear/blank a node of oscillator influences, and probably remove an individual oscillator from it as well.
//It might be good to make selected nodes highlight, by adding a red tinge to them, for instance.

//APPLYING OSCILLATORS: An oscillator's influence would slowly ramp up the longer you held its key down (or decrease
        //if you held down a modifier key like spacebar + the oscillator's key). Then you could carefully control how strongly a node was
        //being affected.
        
//IMPLEMENTATIONS: How are the the oscillator effects going to be stored and applied to the nodes? How are the neighbors' influences going
        //to be transmitted?
        //SOME POSSIBILITIES:
                //- Nodes each have a "readOscillators: []" component, and oscillators are added to and deleted from it dynamically.

//QUESTION: where are the pure osc's represented, for the user's reference?

//MARGINAL: PHASE REVERSAL?: It'd be nice if holding a modifier (i.e. spacebar) would invert the phase of an oscillator. This wouldn't be important
        //if you could just remove an oscillator, as it would just cancel things out. When would it be useful? Probably only in a game-like
        //situation where something outside of your control was applying oscillators, and you had to match and invert which ones you saw.
        //It might also make more sense of their were a variety of amplitudes, or the longer you held down an oscillator key, the more-strongly
        //it would apply.



// Get the canvas from the page.
var canvas = $('canvas')[0];
// Get a thing I can draw to.
var context = canvas.getContext('2d');

// 800x600 coordinate space, 0,0 is the top left corner.
//context.fillRect(left, top, width, height);

//GLOBAL VARS. Should there be no global vars? If so, figure out where all these should go.
var maxBrightness = [95, 95, 95],  //these should never be over 255
oscillators = [],
nodes = [],
buttonsGridQWERTY = [Q = 81, W = 87, E = 69, R = 82, A = 65, S = 83, D = 68, F = 70, Z = 90, X = 88, C = 67, V = 86],
nodesSelected = [];

//Individual oscillators are also global vars right now, just under the "makeOsc" function.

//COLORS STUFF
//for changing colors to hex
function toHexColor(color) {
        for (var i = 0; i < 3; i++) {
                color[i] = Math.round(Math.min(maxBrightness[i], color[i]));
                color[i] = color[i].toString(16);
                if (color[i].length <2){
                        color[i] = '0' + color[i];
                }
        }
        return '#' + color[0] + color[1] + color[2];        //this doesn't add their values only because they've already been made into strings?
}
function toDecColor(hexColor) {
        
}

//for adding two colors together
function addColors(colorA, colorB) {
        var newColor = [];
        for (var i = 0; i < 3; i++) {
                newColor[i] = colorA[i] + colorB[i];
        }
        return newColor;
}

var testColorGroup = [[71, 36, 19], [41, 8, 30], [61, 89, 42], [28, 71, 80], [17, 31, 57]];


function addAllColors(colorsArray) {     //colorGroup should be an array of colors
        var newColor = colorsArray[0];
        for (var i = 1; i < colorsArray.length; i++) {
                for (var j = 0; j < 3; j++) {
                        newColor[j] += colorsArray[i][j];
                }
        }
        return newColor;
}

//for subtracting colors from one another. Could you just use "addColors" for this and add a negative sign in front of the second color?
function subtractColors(colorA, colorB) {
        var newColor = [];
        for (var i = 0; i < 3; i++) {
                newColor[i] = colorA[i] - colorB[i];
        }
        return newColor;
}

//for dividing each of the elements of color be a single divisor--mostly for bringing values back under the brightness cap after they've been added together
function divideColorByNumber(color, divisor) {
        var newColor = [];
        for (var i = 0; i < 3; i++) {
                newColor[i] = color[i] / divisor;
        }
        return newColor;
}

//could just divide numbers by a decimal/fraction (i.e. x / 0.25), but implemented this anyway. Maybe avoids some floating-point imprecision.
function multiplyColorByNumber(color, multiplier) {
        var newColor = [];
        for (var i = 0; i < 3; i++) {
                newColor[i] = color[i] * multiplier;
        }
        return newColor;
}

function colorToFixed(color) {
        var abbreviatedColor = [];
        for (var i = 0; i < 3; i++) {
                abbreviatedColor[i] = Math.round(color[i]);     //wanted this to be "color[i].toFixed(2);" but for some reason that wasn't working.
        }
        return abbreviatedColor;
}

//END OF COLORS STUFF
//===================================

//THIS IS A MESS
function findNeighbors(nodesList) {     //only works with 4x3 grid. Could later use "nodesPerRow" var and include this function in the makeNodes function.
        for (var i = 0; i < nodesList.length; i++) {
                nodesList[i].neighbors.push(nodesList[(i - 1 + nodes.length) % nodes.length], nodesList[(i + 1 + nodes.length) % nodes.length]);
        }

}

//NODES
//Eventually I'll want nodes to be able to retain (with various decay/damping characteristics) oscillations that were imparted
//to them by active oscillators. Not sure how they will "buffer" oscillator activity. Create and eventually (usually) delete
//tempoary oscillators whose activity is decaying?
function makeNodes(numberOfNodes, nodesList) {
        var nodesPerRow = 4;
        for (var i = 0; i < (numberOfNodes / nodesPerRow); i++) {    //this should happen every time a row is complete
                for (var j = 0; j < nodesPerRow; j++) {     //this should create a single row
                        var newNode = {
                                'color': [],  //should be hex rgb
                                'size': 800 / nodesPerRow,              //size
                                'left': j * (800 / nodesPerRow),        //left edge coordinate
                                'top': (800 / nodesPerRow) * i,        //should be "size * ...rowCounter" but can't get it to work      //top edge coordinate
                                'neighbors': [],        //which nodes neighbor this node, sharing influence
                                'readOscillators': [],      //which oscillators are affecting/"attached to" this node, currently
                                'selected': false       //whether the node is currently selected or not
                        };
                        nodes.push(newNode);
                        //need to assign neighbors here. No wrapping, and maybe assign nice clear values, like "neighbor.upperRight" etc.
                }
        }
        findNeighbors(nodesList);
}


//PROBABLY NEED TO ADD PHASE!!
function makeOsc(halfPeriod, maxIntensity) {
        var newOsc = {
                'halfPeriod': halfPeriod, //0.5 * number of ticks per cycle
                'waxing': true,    //whether it's waxing or waning. Boolean.
                'maxIntensity': maxIntensity, //maximum intensity the oscillator will contribute to a node, in non-hex color values, i.e. [255, 255, 255].
                'intensityPerTick': divideColorByNumber(maxIntensity, halfPeriod),      //how much the intensity changes per tick, calculated automatically
                'currentIntensity': [0, 0, 0],         //current itensity--the part that's sent to the nodes
                'tickCounter': 0,
                'selected': false
        };
        oscillators.push(newOsc);
}




var osc0 = makeOsc(46, multiplyColorByNumber(maxBrightness, 1)),
osc1 = makeOsc(20, multiplyColorByNumber(maxBrightness, 1)),
osc2 = makeOsc(33, multiplyColorByNumber(maxBrightness, 0.5)),
osc3 = makeOsc(12, multiplyColorByNumber(maxBrightness, 0.5));


//for processing the activity of created oscillators
function updateOscillator(osc) {
        if (osc.waxing === true) {
                osc.currentIntensity = addColors(osc.currentIntensity, osc.intensityPerTick);
        }
        if (osc.waxing === false) {
                osc.currentIntensity = subtractColors(osc.currentIntensity, osc.intensityPerTick);
        }
        if (osc.tickCounter >= osc.halfPeriod) {
                osc.waxing = !osc.waxing;
                osc.tickCounter = 0;
        } else {
                osc.tickCounter++;
        }
}


//applying updateOscillator to all oscillators (in a list, though there's only one list for now)
function updateAllOscillators(oscillatorsList) {
        for (var i = 0; i < oscillatorsList.length; i++) {
                updateOscillator(oscillatorsList[i]);
        }
}




//DRAWING NODES
function drawNode(node, oscillatorsList) {
    context.fillStyle = node.color;
    context.fillRect(node.left, node.top, node.size, node.size);
    if (node.selected === true) {
        node.readOscillators = [oscillatorsList[0], oscillatorsList[1], oscillatorsList[2], oscillatorsList[3]];        //this is arbitrary right now. This should in the future be "node.readOscillors = selected oscillators"
                                                                    //and later still it might be different, as nodes might retain the influence of an oscillator
    } else {
        node.readOscillators = [oscillatorsList[2], oscillatorsList[3]];
    }
//    node.color = toHexColor(divideColorByNumber(addColors(findOscillatorsColor(node.readOscillators), [59, 21, 87]), 2));     //this works. "[59, 21, 87]" is a placeholder for "findNeighborsColor(node.neighbors)," which isn't working.
    node.color = toHexColor(divideColorByNumber(addColors(findOscillatorsColor(node.readOscillators), divideColorByNumber(findNeighborsColor(node.neighbors), 2)), 2)); //this still doesn't work even if "node.neighbors" is changed to "nodes[0].neighbors," which returns good values in when logged in the console.
    //node.color = toHexColor(findNeighborsColor(node.neighbors));
}

//find the current, average color of a list of oscillators--essentially composites the current state of a group oscillators
function findOscillatorsColor(oscillatorsList) {    //the oscillatorsList passed should be node.readOscillators
        var readOscillatorsColor = oscillatorsList[0].currentIntensity;
        for (var i = 1; i < oscillatorsList.length; i++) {
                readOscillatorsColor = addColors(readOscillatorsColor, oscillatorsList[i].currentIntensity);
        }
        return (divideColorByNumber(readOscillatorsColor, oscillatorsList.length));
}

//find the current, average color of all a node's neighbors
function findNeighborsColor(neighborsList) {    //value passed here should be node.neighbors
        var neighborsColor = findOscillatorsColor(neighborsList[0].readOscillators);
        for (var i = 1; i < neighborsList.length; i++) {
                neighborsColor = addColors(neighborsColor, findOscillatorsColor(neighborsList[i].readOscillators));
        }
        return divideColorByNumber(neighborsColor, neighborsList.length);
}

//this doesn't work because nodes[x].color is in hex
//function findNeighborsColor(neighborsList) {    //should be passed node.neighbors
  //      var neighborsColor = toDecColor(neighborsList[0].color);        
    //    for (var i = 1; i < neighborsList; i++) {
      //          neighborsColor = addColors(neighborsColor, toDecColor(neighborsList[i].color));
        //}
//        return divideColorByNumber(neighborsColor / neighborsList.length);
        //return neighborsColor;
//}

function drawAllNodes(nodesList, oscillatorsList) {     
        for (var i = 0; i < nodesList.length; i++) {       
                drawNode(nodesList[i], oscillatorsList);
        }
}

//INTERFACE


function nodeSelect(nodesList, buttonsList) {
        $('body').on('keydown', function (event) {
                //console.log(event.which);
                for (i = 0; i < Math.min(nodesList.length, buttonsList.length); i++) {
                        if (event.which == buttonsList[i]) {
                                nodesList[i].selected = !nodesList[i].selected;
                                setTimeout(nodeSelect, 200);    //This keeps a button press from registering a bunch on times in a row if you hold it down for moment //I think maybe this is causing an error that shows up in the console but doesn't seem
                        }                                               //to keep anything from working.
                }                        
        });
};

function oscillatorSelect(oscillatorsList, buttonsList) {
        $('body').on('keydown', function (event) {
                //console.log(event.which);
                for (i = 0; i < Math.min(oscillatorsList.length, buttonsList.length); i++) {
                        if (event.which == buttonsList[i]) {
                                oscillatorsList[i].selected = !oscillatorsList[i].selected;
                                setTimeout(nodeSelect, 200);    //I think maybe this is causing an error that shows up in the console but doesn't seem
                        }                                               //to keep anything from working.
                }                        
        });
};
        






makeNodes(12, nodes);

//found this function online
//function hexToDec(hexNumber) {       //maybe would work if I could remove the "#" in front of the color.
//        return parseInt(hexNumber,16);
//}

//MAIN LOOP
function mainLoop() {
    context.clearRect(0, 0, 800, 600);
    drawAllNodes(nodes, oscillators);
    updateAllOscillators(oscillators);
//    oscillatorsSelect(oscillators, buttonsGridUIOP);
    nodeSelect(nodes, buttonsGridQWERTY);
        console.log(divideColorByNumber(addColors(findOscillatorsColor(nodes[0].readOscillators), divideColorByNumber(findNeighborsColor(nodes[0].neighbors), 2)), 2));
}




// Every .033 seconds run the code in function mainLoop. 40(ms) is 25fps, 33.33etc.ms is 30.
setInterval(mainLoop, (33.333333333333333333333 * 1));
