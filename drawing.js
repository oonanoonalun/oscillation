//DRAWING CELLS
function drawCell(cell, impulsesList, fallThresholdsList) {
        //whichCellIsBeingDrawn(cell);
        updateCellOscillators(cell.oscillators);
        addCellToImpulses(cell, impulses);
        findCellColor(cell, fallThresholdsList[0], fallThresholdsList[1], impulsesList);      //second argument is darkThreshold--anything <= this will be pure black; third is warningThreshold--anything under this but above the darkThreshold will be tinged red
        capColorBrightness(cell.color, [255, 255, 255]);     //this also rounds the numbers to integers
      //  if (cell == cells[140] && impulses[0] !== null) {
                //console.log(cell.color);
        //        console.log(impulses[0].currentColor[0].toFixed(0), impulses[0].currentColor[1].toFixed(0), impulses[0].currentColor[2].toFixed(0));
        //}
        cell.color = toHexColor(cell.color);
        context.fillStyle = cell.color;
        context.fillRect(cell.left, cell.top, cell.size, cell.size);
}


function whichCellIsBeingDrawn(cell) {  //this function slows things to a crawl (< 2fps). I guess because of the logging itself--3072 logs per frame.
        //Compares the currently-being-drawn cell (when placed inside of the drawCell function) to the "cells[]" array's contents,
        //      telling us, hopefully, which index of cells[] is currently being drawn.
        //This is a test of trying to compare an object to a member of an array
        //      because some things that rely on that process don't seem to be working, but my tests of the process do,
        //      so maybe a failure in that comparison process isn't the problem.
        for (var i = 0; i < cells.length; i++) {
                if (cell === cells[i]) {
                        console.log('(In drawing.js:) The cell being drawn is cells[' + i + '] at frame ' + frameCounter + '. The current fps is ' + fps + '.');
                        break;
                }
        }
}
//shows homeCell and related things in simple colors so it's easy to see what they're doing

function homeCellOverlay(cell) {
        if (cell.flags[1] === true) {
                cell.color = capColorBrightness(divideColorByNumber(addColors([0, 0, 0], homeOscillators[0].currentColor), 1.5), [255, 255, 255]);
        }
        
 //       if (cell.flags[2] === true) {
   //             cell.color = capColorBrightness(divideColorByNumber(addColors([0, 0, 0], homeOscillators[0].currentColor), 3), [255, 255, 255]);
     //   }        
}




//USES GLOBAL VAR "homeCell"
function homeCellTestingOverlay(cell) {
        //homeCell is cyan
        if (cell.flags[1] === true) {
                cell.color = [0, 255, 255];
                if (playerFlags[0] === true) {
                        cell.color = [255, 127, 0];
                }
        }
        //changes homeCell's neighbors to a green tint
        for (var i = 0; i < homeCell.neighbors.length; i++) {
                if (cell == homeCell.neighbors[i]) {
                        cell.color = addColors(cell.color, [0, 32, 0]);
                }
        }
}


function drawAllCells(cellsList, impulsesList, fallThresholdsList) {
        for (var i = 0; i < cellsList.length; i++) {       
                drawCell(cellsList[i], impulsesList, fallThresholdsList);
        }
}
