// Get the canvas from the page.
var canvas = $('canvas')[0];
// Get a thing I can draw to.
var context = canvas.getContext('2d');

// 800x600 coordinate space, 0,0 is the top left corner.
//context.fillRect(left, top, width, height);



//the titles stuff is for a story, not the game
var titlesWords = [];
titlesWords[0] = 'sounding';
titlesWords[1] = 'fathom';
//titlesWords[2] = 'depth';
titlesWords[3] = 'gradient';
titlesWords[4] = 'slope';
titlesWords[5] = 'auto';
//titlesWords[6] = 'grade';
//titlesWords[7] = 'deep';

var titlesWordsGood = [];

function sortTitlesWords(wordsListUnsorted, wordsListSorted) {
    for (var i = 0; i < wordsListUnsorted.length; i++) {
        if (wordsListUnsorted[i] !== undefined) {
            wordsListSorted.push(wordsListUnsorted[i]);
        }
    }
}

function makeRandomTitles(wordsList) {
    for (var i = 0; i < wordsList.length; i++) {
        for (var j = 0; j < wordsList.length; j++) {
            if (i !== j) {
                console.log(wordsList[i] + ' ' + wordsList[j]);
            }
        }
    }
}



sortTitlesWords(titlesWords, titlesWordsGood);
//makeRandomTitles(titlesWordsGood);

//MAIN LOOP
function mainLoop() {
    context.clearRect(0, 0, 800, 600);
    countFPS();
    updateCellOscillators(homeOscillators);
    updateImpulsesList(impulses);
    buttonsMakeImpulses();
    if (impulses[0] !== null) {
        console.log(impulses[0].cellsAffected);
    }
    drawAllCells(cells);
    requestAnimFrame();
    if (frameCounter % 90 === 0) {  //show fps every three seconds
        console.log('FPS: ' + fps.toFixed(0));
    }
//    console.log(frameCounter);
}

// Every .033 seconds run the code in function mainLoop. 40(ms) is 25fps, 33.33etc.ms is 30.
setInterval(mainLoop, (33.333333333333 * 1));
