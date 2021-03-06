//COLORS STUFF
function toHexColor(color) {
	//for changing colors to hex
        for (var i = 0; i < 3; i++) {
                color[i] = color[i].toString(16);
                if (color[i].length <2){
                        color[i] = '0' + color[i];
                }
        }
        return '#' + color[0] + color[1] + color[2];        //this doesn't add their values only because they've already been made into strings?
}

function hexToDec(hexNumber) {
	//for changing hex colors back to dec
        var decColor = [];
        for (var i = 0; i < 3; i++) {
                decColor[i] = hexNumber.substring(((i * 2) + 1), ((i * 2) + 3));	//the "+1" skips the "#" at the beginning of a hex number
                decColor[i] = parseInt(decColor[i], 16);
        }
        return decColor;
}


function capColorBrightness(color, maxColor) {
    for (var i = 0; i < 3; i++) {
        color[i] = Math.round(Math.min(maxColor[i], color[i]));
    }
    return color;
}
    
//for adding two colors together
function addColors(colorA, colorB) {
        var newColor = [];
        for (var i = 0; i < 3; i++) {
                newColor[i] = colorA[i] + colorB[i];
        }
        return newColor;
}

function divideColors(colorA, colorB) {
        var newColor = [];
        for (var i = 0; i < 3; i++) {
                newColor[i] = colorA[i] / colorB[i];
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

//for subtracting colors from one another. Won't produce anything below zero.
function subtractColors(colorA, colorB) {
        var newColor = [];
        for (var i = 0; i < 3; i++) {
                newColor[i] = Math.max(0, (colorA[i] - colorB[i]));
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

//adds up a colors R, G, and B values in order to measure its total brightness for comparison to other colors
function sumColor(color) {
        var totalBrightness = color[0];
        for (var i = 1; i < 3; i++) {
                totalBrightness += color[i];
        }
        return totalBrightness;
}

function averageBrightness(color) {
        return Math.round(sumColor(color) / 3);
}



function valueToHue (value) {
        //receives a number between 0 and 1, inclusively.
        var hue;        //value 0 = red, val 0.25 = yellow, val 0.5 = green, val 0.75 = cyan, val 1 = blue
        if (value <= 0.25) {                            //anywhere from red to yellow
                hue = [255, (255 * (value * 4)), 0];
        }
        if (value > 0.25 && value <= 0.5) {             //anywhere from yellow to green
                hue = [Math.abs((255 * (value - 0.5)) * 4), 255, 0];     //the R value should be 0 for input 0.5 and 1 for input 0.25.
        }
        if (value > 0.5 && value <= 0.75) {
                hue = [0, 255, (255 * ((value - 0.5) * 4))];    //anywhere  from green to cyan
        }
        if (value > 0.75 && value <= 1) {             //anywhere from yellow to green
                hue = [0, Math.abs((255 * (value - 1) * 4)), 255];    //the G value should be 0 for input 0.5 and 1 for input 0.25.
        }
        return hue;
}

function brightnessToSpectrum(darkThreshold, maxBrightness, cell) {  //should send 255 as maxColor to this, probably
        //this function should take a value of 0 through one, inclusively, and map it to a spectrum of colors from Red to Yellow to Green to Cyan to Blue.
        if (averageBrightness(cell.color) >= darkThreshold) {
                var newBrightness = averageBrightness(capColorBrightness(cell.color, [255, 255, 255])),
                brightnessRange,
                currentColorParametricValueOfRange;
                brightnessRange = maxBrightness - darkThreshold;
                currentColorParametricValueOfRange = (newBrightness - darkThreshold) / brightnessRange;  //should generate a number inclusively between 1 and 0.
                //console.log((newBrightness - darkThreshold), brightnessRange);
                //console.log(currentColor);
                newColor = valueToHue(Math.min(1, currentColorParametricValueOfRange));
                //newColor = [currentColorParametricValueOfRange * 255, currentColorParametricValueOfRange * 255, currentColorParametricValueOfRange * 255];
                setCellColorGroup(currentColorParametricValueOfRange, cell);
                if (cell == cells[46] && impulses[0] !== null) {
                        //console.log(cell.color);
                        //console.log(newBrightness);
                        //console.log(currentColorParametricValueOfRange.toFixed(2));
                        //console.log(newColor[0].toFixed(0), newColor[1].toFixed(0), newColor[2].toFixed(0));
                }
                //newColor = [64 * currentColorParametricValueOfRange, 64 * currentColorParametricValueOfRange, 64 * currentColorParametricValueOfRange];
                return newColor;
        }
}

function setCellColorGroup(value, cell) {
        if (value <= 0.2) {
                cell.colorGroup = 0; 
        }
        if (value > 0.2 && value <= 0.4) {
                cell.colorGroup = 1; 
        }
        if (value > 0.4 && value <= 0.6) {
                cell.colorGroup = 2; 
        }
        if (value > 0.6 && value <= 0.8) {
                cell.colorGroup = 3; 
        }
        if (value > 0.8 && value <= 1) {
                cell.colorGroup = 4; 
        }
}

function impulseToColor (cell) {
        if (cell.colorGroup === 0 && impulses[0] !== null) {
        //if (averageBrightness(cell.color) < 255 && impulses[0] !== null) {    //this demonstrates that some flicker during impulses comes from the brightnessToSpectrum function.
                cell.color = addColors(cell.color, impulses[0].currentColor);
        }
}


//find the current, average color of a list of oscillators--essentially composites the current state of a group oscillators
function findOscillatorsColor(oscillatorsList) {    //the oscillatorsList passed should be cell.oscillators
        if (oscillatorsList.length > 0) {
                var oscillatorsColor = oscillatorsList[0].currentColor;
                if (oscillatorsList.length > 1) {
                        for (var i = 1; i < oscillatorsList.length; i++) {
                                oscillatorsColor = addColors(oscillatorsColor, oscillatorsList[i].currentColor);
                        }
                }
                return (divideColorByNumber(oscillatorsColor, oscillatorsList.length));
        }
}

function OLDfindImpulsesColor(cell) {
        var newImpulsesColor = [0, 0, 0],
        impulsesCounter = 0;
        for (var i = 0; i < impulses.length; i++) {
                if (impulses[i] !== null && impulses[i].cellsAffected.length > 0) {
                        for (var j = 0; impulses[i].cellsAffected.length; j++) {
                                if (impulses[i].cellsAffected[j] === cell) {     //this would create the wrong effect if for some reason a cell was on an impulses cellsAffected list twice, but we should make sure that never happens
                                        newImpulsesColor = addColors(impulses[i].currentColor, newImpulsesColor);
                                        impulsesCounter++;
                                }
                        }
                }
        }
        return divideColorByNumber(newImpulsesColor, Math.max(1, impulsesCounter));
}

function findImpulsesColor(impulsesList) {      //this will return a single color that is the sum of the colors of an array of impulses
        if (impulsesList.length === 1) {        //if there's only one impulse in the list
                return impulsesList[0].currentColor;    //then return its current color
        }
        var newImpulsesColor = impulsesList[0].currentColor;    //this var will hold the summed colors of a list of impulses
        for (var i = 1; i < impulsesList.length; i++) {         //going over the whole list of impulses
                addColors(newImpulsesColor, impulsesList[i].currentColor);      //and adding them to newImpulsesColor
        }
        return capColorBrightness(newImpulsesColor, [255, 255, 255]);   //returning a brightness-capped sum of all the impulses' colors
}

/*function OLDfindColorOfImpulsesAffectingCell(cell ,impulsesList) {
        var activeImpulses = findActiveImpulses(impulsesList),
        impulsesAffectingCell = [];
        if (activeImpulses.length === 0) {
                return [0, 0, 0];
        }
        for (var i = 0; i < activeImpulses.length; i++) {
                if (activeImpulses[i].colorGroupsAffected.length === 0) {
                        return [0, 0, 0];
                }
                for (var k = 0; k < activeImpulses[i].colorGroupsAffected.length; k++) {
                        if (activeImpulses[i].colorGroupsAffected[k] === cell.colorGroup) {
                                impulsesAffectingCell.push(activeImpulses[i]);
                        }
                }
        }
        if (impulsesAffectingCell.length === 0) {
                return [0, 0, 0];
        }
        return findImpulsesColor(impulsesAffectingCell);
}*/

function findColorOfImpulsesAffectingCell(cell, impulsesList) {
        var impulsesAffectingCell = [],         //this will hold all impulses that are currently affecting this cell
        activeImpulses = findActiveImpulses(impulsesList);      //this creates an array of active impulses
        for (var i = 0; i < activeImpulses.length; i++) {              //checking all active impulses
                if (activeImpulses[i].cellsAffected.indexOf(cell) >= 0) {      //checking all active impulses to see if they have the cell being draw in their array of cellsAffected
                        impulsesAffectingCell.push(activeImpulses[i]);          //and if they do, adding the impulse to an array of impulses whose color will be combined and added to the cell's color
                }
        }
        if (impulsesAffectingCell.length > 0) {         //if any active impulses were found to have this cell on their list of cells they affect (impulse.cellsAffected)
                return capColorBrightness(findImpulsesColor(impulsesAffectingCell), [255, 255, 255]);   //this function returns the sum of their colors
        } else {
                return [0, 0, 0];       //otherwise this function will return no additional color
        }
}



//find the current, average color of all a cell's neighbors
//if we could parse a cell's color from hex back into dec then this would easier and simpler.
//Work to do that is partially done, and should be completed at some point.
function findNeighborsColor(neighborsList) {    //value passed here should be cell.neighbors
        var neighborsColor = multiplyColorByNumber(findOscillatorsColor(neighborsList[0].oscillators), neighborsList[0].outputScale);
        if (neighborsList.length > 1) {
            for (var i = 1; i < neighborsList.length; i++) {
                neighborsColor = addColors(neighborsColor, multiplyColorByNumber(findOscillatorsColor(neighborsList[i].oscillators), neighborsList[i].outputScale));
            }
        }
        return divideColorByNumber(neighborsColor, neighborsList.length);
}

function findCellColor (cell, darkThreshold, warningThreshold, impulsesList) {
        var colorSourcesList = [];
        colorSourcesList.push(findOscillatorsColor(cell.oscillators), findNeighborsColor(cell.neighbors), findColorOfImpulsesAffectingCell(cell, impulsesList));
        cell.color = divideColorByNumber(addAllColors(colorSourcesList), (colorSourcesList.length - 1));        //the "1" is findColorOfImpulsesAffectingCell, as impulses shouldn't figure into dividing/averaging a cell's final color--if it did, their brief life would lower the cell's overall brightness for whole said life (esp. during cooldown), and we want them to brighten the cell for their whole life
        if (averageBrightness(cell.color) < darkThreshold) {    //if cell brightness is under dark threshold, then
                cell.color = [0, 0, 0];                                 //make cell black
        //} else { if (averageBrightness(cell.color) <= warningThreshold) {
            //            cell.color[0] += 32;        
        } else {
                cell.color = brightnessToSpectrum(darkThreshold, 255, cell);    //also assigns color groups. sets cell's color to a rainbow-esque color based on the cell's total brightness
        }
}

function findBrightestNeighbor(neighborsList) {         //not including the cell that was most recently Home Cell
        var brightestNeighbor;
        for (var i = 1; i < (neighborsList.length - 1); i++) {
                if (sumColor(hexToDec(neighborsList[i - 1].color)) > sumColor(hexToDec(neighborsList[i].color)) && neighborsList[i - 1].flags[2] === false) {
                        brightestNeighbor = neighborsList[i - 1];
                }
        }
        if (sumColor(hexToDec(brightestNeighbor.color)) < sumColor(hexToDec(neighborsList[neighborsList.length - 1].color)) && neighborsList[neighborsList.length - 1].flags[2] === false) {  //gives the last neighbor in the list a chance to be brightestNeighbor
                brightestNeighbor = neighborsList[neighborsList.length - 1];
        }
        return brightestNeighbor;
}
