// Get the canvas from the page.
var canvas = $('canvas')[0];
// Get a thing I can draw to.
var context = canvas.getContext('2d');

// 800x600 coordinate space, 0,0 is the top left corner.
//context.fillRect(left, top, width, height);





//MAIN LOOP
function mainLoop() {
    context.clearRect(0, 0, 800, 600);
    countFPS();
    updateCellOscillators(homeOscillators);
    updateImpulsesList(impulses);
    buttonsMakeImpulses();
    if (impulses[0] !== null) {
    //    console.log(impulses[0].cellsAffected[0].color);
    }
    drawAllCells(cells, impulses, fallThresholds);
    requestAnimFrame();
    if (frameCounter % 90 === 0) {  //show fps every three seconds
        console.log('FPS: ' + fps.toFixed(0));
    }
//    console.log(frameCounter);
}

// Every .033 seconds run the code in function mainLoop. 40(ms) is 25fps, 33.33etc.ms is 30.
setInterval(mainLoop, (33.333333333333 * 1));
