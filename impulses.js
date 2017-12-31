function makeImpulse(durationMin, durationMax, maxColorMin, maxColorMax, startupFramesMin, startupFramesMax, cooldownFramesMin, cooldownFramesMax, affectsColorGroupsArray) { //startupFramesMax + cooldownFramesMax should equal < durationMin. affectsColorGroups should be an array or null, and might eventually be fed "selectedColorGroups"--just an array full of all the color groups a player wants to affect with the next keypress
	//duration in frames, magnitude as a color ([x, y, z]), size in number of cells
	var newMaxColor = [];
	for (var i = 0; i < 3; i++) {
		newMaxColor[i] = randomNumber(maxColorMin[i], maxColorMax[i]);
	}
	var newDuration = randomNumber(durationMin, durationMax),
	newStartupFrames = randomNumber(startupFramesMin, startupFramesMax),
	newCooldownFrames = randomNumber(cooldownFramesMin, cooldownFramesMax),
	newDecayFrames = newDuration - newStartupFrames - newCooldownFrames,
	newColorPerFrameStartup = divideColorByNumber(newMaxColor, newStartupFrames),
	newColorPerFrameDecay = divideColorByNumber(newMaxColor, newDecayFrames),
	newColorGroupsAffected = affectsColorGroupsArray;
	var newImpulse = {
		'duration': newDuration,	//how long the impulse will last, total. Might not need this property
		'startupFrames': newStartupFrames,	//how long the impulse takes to reach its maximum value
		'decayFrames': newDuration - newStartupFrames - newCooldownFrames,	//how the impulse takes to decay and disappear after it reaches its max value
		'cooldownFrames': newCooldownFrames,
		'maxColor': newMaxColor,			//how intense the impulse will be at its maximum value
		'colorGroupsAffected': newColorGroupsAffected,
		'cellsAffected': [],
		'currentColor': [0,0,0],			//the impulse's current intensity
		'colorPerFrameStartup': newColorPerFrameStartup,		//how much the impulse will intesnify per frame as it's starting up
		'colorPerFrameDecay': newColorPerFrameDecay,			//how much the impulse will de-intensify per frame after its reached its max value. Might be cool for impulse to "wash out," hovering at their max value for a few frames before decaying
		'flags': [],										//boolean flags for any use
		'frameCounter': 0				//where the impulse is in its life cycle
	};
	initializeFlags(16, newImpulse.flags);
	return newImpulse;
}

function updateImpulse(impulse) {	//this function would be more streamlined if active impulses were pushed to an array that this checked instead of it checking a list with a bunch of nulls on it. Then the impulse in the un-streamlined array could write its array location to an "identity" var in itself in order to preserve some identity about itself that now has to be simply registered by the impulses index in the impulses array.
	if (impulse !== null) {
		if (impulse.frameCounter <= impulse.startupFrames) {	//impulse is in startup frames
			impulse.currentColor = addColors(impulse.currentColor, impulse.colorPerFrameStartup);
		} else {
			if (impulse.frameCounter <= impulse.duration - impulse.cooldownFrames) {	//impulse is decaying
				impulse.currentColor = subtractColors(impulse.currentColor, impulse.colorPerFrameDecay);
			} else {
				if (impulse.frameCounter > impulse.duration - impulse.cooldownFrames) {	//impulse is cooling down
					impulse.currentColor = [0, 0, 0];
				}
			}
		}
		impulse.frameCounter++;
	}
}


function addCellToImpulses(cell, impulsesList) {	//call this to see if a cell is in a color group affected by any active impulses
	var activeImpulses = findActiveImpulses(impulsesList);	//check for active impulses in an array of impulses
	if (activeImpulses.length > 0) {	//if there are any active impulses--maybe this is unnecessary?
		for (var i = 0; i < activeImpulses.length; i++) {	//then check each one
			if (compareColorGroupsBetweenCellAndImpulse(cell, activeImpulses[i]) === true && isCellADuplicate(cell, activeImpulses[i]) === false) {	//and see if the current cell belongs to a color group it affects && isn't already on the impulse's list of cells it affects
				activeImpulses[i].cellsAffected.push(cell);	//if they share a color group, add this cell to the impulse's list of cells it affects
			}
		}
	}
}

function isCellADuplicate(cell, impulse) {
	return impulse.cellsAffected.indexOf(cell) >= 0;
}

function compareColorGroupsBetweenCellAndImpulse(cell, impulse) {	//return "true" if an impulse influences a colorGroup to which a cell belongs
	if (impulse.colorGroupsAffected.length > 0) {	//if an impulse affects any color groups
		for (var i = 0; i < impulse.colorGroupsAffected.length; i++) {	//check each of its affected color groups
			if (cell.colorGroup === impulse.colorGroupsAffected[i]) {	//to see if it's equal to the cell's color group
				return true;	//and if it is, return "true"
			}
		}
	}
}

function findActiveImpulses(impulsesList) {	//call this to find the active members of an array of impulses that will contain nulls for non-active impulse slots
	var activeImpulses = [];	//this will hold any active impulses found in an array of impulses that may contain null, inactive impulses
	for (var i = 0; i < impulsesList.length; i++) {	//check each member of impulsesList
		if (impulsesList[i] !== null) {				//then, if any are active
			activeImpulses.push(impulsesList[i]);	//add them to an array of active impulses
		}
	}
	return activeImpulses;		//return an array of active impulses
}



function addImpulsesToCell(cell) {
        //adds any impulse that affects the colorGroup to which cell belongs to that cell's internal impulse list
        //cell.impulses = [];
        for (var i = 0; i < impulses.length; i++) {
                if (impulses[i] !== null && impulses[i].colorGroupsAffected !== null && impulses[i].colorGroupsAffected.length > 0) {   //seems like having to check for null and length > 0 should be unnecessary here
                        for (var j = 0; j < impulses[i].colorGroupsAffected.length; j++) {
                               // for (var k = 0; k < cell.impulses.length; k++) {
                                        //if (cell.impulses[k] !== impulses[i]) {        
                                                if (impulses[i].colorGroupsAffected[j] === cell.colorGroup) {    //maybe could/should be ===, not ==
                                                        cell.impulses.push(impulses[i]);
                                            //            break;
                                                }
                                          //      break;
                                        //}
                                //}
                        }
                }
        }
}

function updateImpulsesList(impulsesList) {
	for (var i = 0; i < impulsesList.length; i++) {
		if (impulsesList[i] !== null) {
			updateImpulse(impulsesList[i]);
			if (impulsesList[i].frameCounter > impulsesList[i].duration) {
				impulsesList[i] = null;
			}
		}
	}
}

function updateCellImpulses(cell) {
	if (cell.impulses !== undefined && cell.impulses.length > 0) {
		for (var i = 0; i < cell.impulses.length; i++) {
			updateImpulse(cell.impulses[i]);
		}
	}
	removeExpiredImpulses(cell.impulses);
}

function removeExpiredImpulses(impulsesList) {
	var impulsesToRemove = [];
	if (impulsesList !== undefined && impulsesList.length > 0) {
		for (var i = 0; i < impulsesList.length; i++) {
			if (impulsesList[i].frameCounter > impulsesList[i].duration) {	//finding all expired impulses
				impulsesToRemove.push(i);									//adding them to a list of impulses to remove from the cell's list of impulses.
			}
		}
	}
	for (var j = 0; j < impulsesToRemove.length; j++) {
		impulsesList.splice((impulsesToRemove[j] - j), 1);			//removing the expired impulses from cell.impulses
	}
}