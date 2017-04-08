//this block of code, immedialtely before "mainLoop" could all be inside a function called "initialization" or something
//makeCells(numberOfCells, cellsPerRow, cellsList, oscsPerCell, periodMin, periodMax, maxColor, phase, neighborScaling)
//"neighborScaling" is how much the state of a cell is influenced by the oscillators of its neighbors; where 1 is equally to its own oscillators, and 0.5 is half as much as its own.

//GLOBAL VARS. Should there be no global vars? If so, figure out where all these should go.
var cells = [],
buttonsGridQWERTY = [Q = 81, W = 87, E = 69, R = 82, A = 65, S = 83, D = 68, F = 70, Z = 90, X = 88, C = 67, V = 86],
homeOscillators = [],
frameCounter = 0,
fallThresholds = [0, 64],     //first member is the threshold a cell's average brightness much reach or fall below in order to be changed to pure black. The player will fall if they step on black cells. The second term is the warning threshold. Cells whose average brightness are between the blackness threshold and this one will be tinged red. Warning cells won't affect the player, but will let them know that a cell is closed to black.
//homeCell,
impulses = [];

initializeArrayWithNulls(64, impulses);


//makeCells(numberOfCells, cellsPerRow, cellsList, oscsPerCell, periodMin, periodMax, brightestColorMin, brightestColorMax, phase, inputScale, outputScale)
//"inputScale" is how much a cell is affected by its neighbors' oscillators (oscillators in its cell.oscillators array), where "1" is equally to its own "native" oscillators
//"outputScale" is how much a cell boosts its affect on its neighbors—-the inverse of "inputScale"
makeCells(3072, 64, cells, 1, 75, 150, [0, 0, 0], [24, 24, 24], Math.random(), randomNumber(3, 6), randomNumber(3, 6));
//these sets of numberOfCells and cellsPerRow work for our 800 x 600 canvas (double the number of cells pers row = 4x the number of cells overall):
//300, 20
//768, 32
//1200, 40
//3072, 64
//4800, 80      //this seems to reduce the framerate significantly, even with just one native oscillator per cell. Is there a way to optimize so that this works?
findNeighbors(cells, 64);
cells[randomNumber(0, cells.length)].flags[1] = true;     //making an initial Home Cell
//modifyCells(cells);

//makeHomeOscillators(homeOscillators, 2, 40, 40, [255, 192, 127], [255, 192, 127], 1);
//homeCell = findInitialHomeCell(cells);


//sortCellsIntoRows(cells);
//sortCellsIntoColumns(cells);

function modifyCells(cellsList) {
        var brightCell = selectRandomNonHomeCell(cellsList);
//        brightCell.oscillators.splice(0, brightCell.oscillators.length);
        brightCell.oscillators.push(makeOsc(50, 50, [127, 127, 127], Math.random()));
        brightCell.inputScale = 5;
        brightCell.outputScale = 5;
       for (var i = 0; i < brightCell.neighbors.length; i++) {
                brightCell.neighbors[i].outputScale = brightCell.outputScale * 4;
                brightCell.neighbors[i].inputScale = 3;//brightCell.inputScale * 1;
        }
//        for (var j =0; j < brightCell.neighbors.length; j++) {
  //              for (var k = 0; k < brightCell.neighbors[j].neighbors.length; k++) {
    //                    brightCell.neighbors[j].neighbors[k].outputScale = brightCell.outputScale * 1;
      //                  brightCell.neighbors[j].neighbors[k].inputScale = 1.25;//brightCell.inputScale * 1;                        
        //        }
        //}
//        for (var l =0; l < brightCell.neighbors.length; l++) {
  //              for (var m = 0; m < brightCell.neighbors[l].neighbors.length; m++) {
    //                    for (var o = 0; o <brightCell.neighbors[l].neighbors[o].length; o++) {
      //                          brightCell.neighbors[m].neighbors[o].outputScale = brightCell.outputScale * 1;
        //                        brightCell.neighbors[m].neighbors[o].outputScale = brightCell.inputScale * 1;
          //              }
            //    }
       // }             
}

function initializeFlags(numberOfFlags, flagsList) {
        for (var i = 0; i < numberOfFlags; i++) {
                flagsList[i] = false;
        }
}

function initializeArrayWithNulls(numberOfMembers, array) {
        for (var i = 0; i < numberOfMembers; i++) {
                array[i] = null;
        }
}

function initializeArrayWithArrays(numberOfMembers, array) {
        for (var i = 0; i < numberOfMembers; i++) {
                array[i] = [];
        }
}

function findInitialHomeCell(cellsList) {
        var initialHomeCell;
        for (var i = 0; i < cellsList.length; i++) {
                if (cellsList[i].flags[1] === true) {
                        initialHomeCell = cellsList[i];
                }
        }
        return initialHomeCell;
}

////////////////////
//CELLS
////////////////////

//CELLS
//Eventually I'll want cells to be able to retain (with various decay/damping characteristics) oscillations that were imparted
//to them by active oscillators.

function makeCells(numberOfCells, cellsPerRow, cellsList, oscsPerCell, periodMin, periodMax, brightestColorMin, brightestColorMax, phase, inputScale, outputScale) {
        for (var i = 0; i < (numberOfCells / cellsPerRow); i++) {    //this should happen every time a row is complete
                for (var j = 0; j < cellsPerRow; j++) {     //this should create a single row
                        var newCell = {
                                'color': [],  //should be hex rgb
                                'colorGroup': null,
                                'size': 800 / cellsPerRow,              //size
                                'left': j * (800 / cellsPerRow),        //left edge coordinate
                                'top': (800 / cellsPerRow) * i,        //should be "size * ...rowCounter" but can't get it to work      //top edge coordinate
                                'neighbors': [],        //which cells neighbor this cell, sharing influence of its color with its internal oscillators
                                'oscillators': [],	//oscillators currently acting on the cell, unless its being set externally, for instance the homeCell being affected by the homeOscillators.
				'impulses': [],		//impulses currently acting on the cell
                                'flags': [],       //boolean flags for grouping and selection selection and whatever else
                                'inputScale': inputScale,
                                'outputScale': outputScale,
                                'neighborDown': null,	//neighbor cell below current cell
                                'neighborUp': null,		//neighbor cell above current cell
                                'neighborRight': null,	//etc.
                                'neighborLeft': null,
                                'neighborDownRight': null,
                                'neighborDownLeft': null,
                                'neighborUpRight': null,
                                'neighborUpLeft': null

                        };
                        initializeFlags(16, newCell.flags);	//creating flags and setting them all to 'false'
                        makeNativeOscillators(newCell.oscillators, oscsPerCell, periodMin, periodMax, brightestColorMin, brightestColorMax, phase);	//creating the oscillators particular to this cell
                        cellsList.push(newCell);	//adding this cell to the list of all of the "geographical" cells in the level
                }
        }
}


function findNeighbors(cellsList, cellsPerRow) {
		//finds all the neighbors of a cell and fills in the cell's neighbors list and individual neighbors
		//maybe don't need the "sortCellsIntoRows/Columns" functions? But maybe is simpler, in the end, that way...
        cellsPerColumn = Math.round(cellsList.length / cellsPerRow);
        rows = sortCellsIntoRows(cellsList, cellsPerRow, cellsPerColumn);
        columns = sortCellsIntoColumns(cellsList, cellsPerRow, cellsPerColumn);
        //assigning the cells below and above a cell as its neighbors
        for (var a = 0; a < (cellsPerColumn - 1); a++) {         //all rows but the last one
                for (var b = 0; b < cellsPerRow; b++) {         //each cell in a row
                        rows[a][b].neighbors.push(rows[a + 1][b]);        //assigning the cell directly below a cell as its neighbor
                        rows[a][b].neighborDown = rows[a + 1][b];
                }
        }
        for (var c = 1; c < cellsPerColumn; c++){         //all rows but the first one
                for (var d = 0; d < cellsPerRow; d++) {         //each cell in a row
                        rows[c][d].neighbors.push(rows[c - 1][d]);        //assigning the cell directly above a cell as its neighbor
                        rows[c][d].neighborUp = rows[c - 1][d];                
                }
        }
        //assigning the cells to the right and left of a cell as its neighbors
        for (var e = 0; e < (cellsPerRow - 1); e++){         //all columns but the last one
                for (var f = 0; f < cellsPerColumn; f++) {      //each cell in a column
                        columns[e][f].neighbors.push(columns[e + 1][f]);        //assigning the cell directly to the right of a cell as its neighbor
                        columns[e][f].neighborRight = columns[e + 1][f];
                }
        }
        for (var g = 1; g < cellsPerRow; g++){         //all columns but the first one
                for (var h = 0; h < cellsPerColumn; h++) {      //each cell in a column
                        columns[g][h].neighbors.push(columns[g - 1][h]);        //assigning the cell directly to the left of a cell as its neighbor
                        columns[g][h].neighborLeft = columns[g - 1][h];
                }
        }
        //assigning the cells to the lower-right and lower-left of a cell as its neighbors
        for (var i = 0; i < (cellsPerRow - 1); i++) {         //all columns but the last one
                for (var j = 0; j < (cellsPerColumn - 1); j++) {      //each cell in a column except the last one
                        columns[i][j].neighbors.push(columns[i + 1][j + 1]);        //assigning the cell to the lower-right of a cell as its neighbor
                        columns[i][j].neighborDownRight = columns[i + 1][j + 1];
                }
        }
        for (var k = 1; k < cellsPerRow; k++) {         //all columns but the first one
                for (var l = 0; l < (cellsPerColumn - 1); l++) {      //each cell in a column except the last one
                        columns[k][l].neighbors.push(columns[k - 1][l + 1]);        //assigning the cell to the lower-left of a cell as its neighbor
                        columns[k][l].neighborDownLeft = columns[k - 1][l + 1];
                }
        }        
        //assigning the cells to the upper-right and upper-left of a cell as its neighbors
        for (var m = 0; m < (cellsPerRow - 1); m++) {         //all columns but the last one
                for (var n = 1; n < cellsPerColumn; n++) {      //each cell in a column except the first one
                        columns[m][n].neighbors.push(columns[m + 1][n - 1]);        //assigning the cell to the upper-right of a cell as its neighbor
                        columns[m][n].neighborUpRight = columns[m + 1][n - 1];
                }
        }
        for (var o = 1; o < cellsPerRow; o++) {         //all columns but the first one
                for (var p = 1; p < cellsPerColumn; p++) {      //each cell in a column except the first one
                        columns[o][p].neighbors.push(columns[o - 1][p - 1]);        //assigning the cell directly to the upper-left of a cell as its neighbor
                        columns[o][p].neighborUpLeft = columns[o - 1][p - 1];
                }
        }        
}


function sortCellsIntoRows(cellsList, cellsPerRow, cellsPerColumn) {
        var rows = [];
        for (var i = 0; i < cellsPerColumn; i++) {
            var newRow = [];
            for (var j = 0; j < cellsPerRow; j++) {
                newRow.push(cellsList[j + (i * cellsPerRow)]);
            }
            rows.push(newRow);
        }
        return rows;
}

function sortCellsIntoColumns(cellsList, cellsPerRow, cellsPerColumn) {
        var columns = [];
        for (var i = 0; i < cellsPerRow; i++) {
            var newColumn = [];
            for (var j = 0; j < cellsPerColumn; j++) {
                newColumn.push(cellsList[(j * cellsPerRow) + i]);
            }
            columns.push(newColumn);
        }
        return columns;
}

/////////////////////
//OSCILLATORS
/////////////////////

function makeNativeOscillators(oscillatorsList, oscsPerCell, periodMin, periodMax, brightestColorMin, brightestColorMax, phase) {     //oscillators list should be passed newCell.oscillators
        for (var i = 0; i < oscsPerCell; i++) {
            var nativeOsc = makeOsc(periodMin, periodMax, brightestColorMin, brightestColorMax, phase);
            nativeOsc.flags[0] = true; //flags this oscillator as a "native" oscillator--an oscillator that is part of the "home state" of a cell. The "home state" is the state that is added to by other conditions, but never subtracted from (except via a cancellation effect of other, added oscillators). Flags applied temporarily (i.e. due to selection, or ones that decay) will take other flags so that they can be selected for deletion later by checking for certain flags.
            oscillatorsList.push(nativeOsc);
        }
}

function makeHomeOscillators(oscillatorsList, oscsPerCell, periodMin, periodMax, brightestColorMin, brightestColorMax, phase) {     //oscillators list should be passed newCell.oscillators
        for (var i = 0; i < oscsPerCell; i++) {
            var homeOsc = makeOsc(periodMin, periodMax, brightestColorMin, brightestColorMax, phase);
            homeOsc.flags[1] = true;    //flags this oscillator as a Home Cell Selected oscillator so that it can be recognized for deletion when a cell ceases being the/a Home Cell
            oscillatorsList.push(homeOsc);
        }
}




function makeOsc(periodMin, periodMax, brightestColorMin, brightestColorMax, phase) {
        var newRed = randomNumber(brightestColorMin[0], brightestColorMax[0]);
        var newGreen = randomNumber(brightestColorMin[1], brightestColorMax[1]);
        var newBlue = randomNumber(brightestColorMin[2], brightestColorMax[2]);
        var maxColor = [newRed, newGreen, newBlue];
        var newOsc = {
                'period': 0,//randomNumber(periodMin, periodMax), //number of frames per cycle--waxing and waning will each be half of this, though there should be ways to change that eventually
                'waxing': true,    //whether it's waxing or waning. Boolean.
                'frameCounter': 0,//Math.round((newOsc.period / 2) * phase),
                'maxColor': maxColor, //maximum color the oscillator will contribute to a cell, in non-hex color values, i.e. [255, 255, 255].
                'colorPerFrame': 0,//(period / 2)),      //how much the color changes per frame, calculated automatically
                'currentColor': [0, 0, 0],//[colorPerFrame[0] * frameCounter, colorPerFrame[1] * frameCounter, colorPerFrame[2] * frameCounter],//[0, 0, 0],         //current itensity--the part that's sent to the cells
                'flags': []     //boolean flags for grouping and selection and whatever else
        };
        newOsc.period = randomNumber(periodMin, periodMax);
        newOsc.colorPerFrame = divideColorByNumber(newOsc.maxColor, (newOsc.period /2));
        newOsc.frameCounter = Math.round((newOsc.period / 2) * phase);
        newOsc.currentColor = [(newOsc.colorPerFrame[0] * newOsc.frameCounter), (newOsc.colorPerFrame[1] * newOsc.frameCounter), (newOsc.colorPerFrame[2] * newOsc.frameCounter)];
        if (phase < 0.5) {
                newOsc.waxing = true;
        } else {
                newOsc.waxing = false;
        }
        initializeFlags(16, newOsc.flags);
        return newOsc;
}


//for processing the activity of created oscillators
function updateOscillator(osc) {
        if (osc.waxing === true) {
                osc.currentColor = addColors(osc.currentColor, osc.colorPerFrame);
        }
        if (osc.waxing === false) {
                osc.currentColor = subtractColors(osc.currentColor, osc.colorPerFrame);
        }
        if (osc.frameCounter >= Math.round((osc.period / 2))) {
                osc.waxing = !osc.waxing;
                osc.frameCounter = 0;
        } else {
                osc.frameCounter++;
        }
}


//applying updateOscillator to all oscillators (in a list, though there's only one list for now)
function updateAllOscillators(cellsList) {      //cellsList should be (cells) is this function is called in the mainLoop
        for (var i = 0; i < cellsList[i].oscillators.length; i++) {
                for (j = 0; j < cellsList[i].oscillators.length; j++) {
                        updateOscillator(oscillatorsList[i].oscillators[j]);
                }
        }
}

function updateCellOscillators(oscillatorsList) {      //oscillatorsList should be cell.oscillators
        for (var i = 0; i < oscillatorsList.length; i++) {
                updateOscillator(oscillatorsList[i]);
        }
}

////////////////////////
//MISC
////////////////////////

function randomNumber(minPossibleNumber, maxPossibleNumber) {
        var newRandomNumber = Math.round(minPossibleNumber + (Math.random() * ((maxPossibleNumber - 1) - minPossibleNumber)));
        return newRandomNumber;
}


function selectRandomNonHomeCell(cellsList) {
        var randomCellIndex = Math.round(randomNumber(0, cellsList.length));
        for (var i = 0; i < cellsList.length; i++) {
                if (cellsList[randomCellIndex].flags[1] !== true) {
                        return cellsList[randomCellIndex];
                } else {
                        randomCellIndex = Math.round(randomNumber(0, cellsList.length));
                }
        }
}

function countFPS() {   //have to turn on time stamps in Chrome inspector for this to work (options menu in upper right of inspect-->console)
    if (frameCounter % 300 === 0) {
        
        //console.log('Frame: ' + (frameCounter + 1));  //should be ten seconds apart at 30fps
    }
    frameCounter++;
}

//FROM STACK OVERFLOW.COM for counteing fps
var lastCalledTime;
var fps;

function requestAnimFrame() {

  if(!lastCalledTime) {
     lastCalledTime = Date.now();
     fps = 0;
     return;
  }
  delta = (Date.now() - lastCalledTime)/1000;
  lastCalledTime = Date.now();
  fps = 1/delta;
} 

//FROM CHRIS
//this is from Chris and he adapted it from an online source. I have no idea how it works.
//It can be used for debugging (through viewing a serialized version of) objects that contain circular references.
function serialize(data) {
    var seenObjects = [];
    return JSON.stringify(data, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            // Check if we've already seen this object before.
            var oldIndex = seenObjects.indexOf(value);
            if (oldIndex !== -1) {
                // Show an indicator that this object was serialized.
                return '[object ' + oldIndex +']';
            }
            // Record that this value has been serialized already.
            seenObjects.push(value);
        }
        return value;
    });
}