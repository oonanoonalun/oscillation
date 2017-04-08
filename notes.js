//NOTES:
//CURRENT ISSUE/S:
//The function "findImpulsesColor" seems to be freezing up the program wherever it's run. I've tried just running it in the main loop, which froze things.
//	For now, its call in findCellColor is just commented out.
//	Maybe fixing the addCellsToImpulses issues will fix this too?

//The function addCellsToImpulses (in impulses.js) either adds all cells whose colorGroup is the same as one of the impulse's colorGroupsAffected EVERY FRAME,
//	or none at all,
//	even though I think my code should prevent that.
//	I keep thinking that the process of comparing an object to objects in an array isn't working, but all my tests say that the basic
//		way I'm trying to implement it works.

//DIFFERENT-ISH APPROACH IDEA:
//	Every frame, sort all cells into global arrays for each color group (on global array of arrays)
//		or don't make it global? but would be easier to...
//	Every frame, check each active impulse's colorGroupsAffected
//		and check the array for that color group against the impulse's array of cellsAffected
//		and add any cells that aren't already on the list
//		and never delete any cells.
//		Maybe that will work more easily and/or be better


//Pseudo code for what I'm trying to work on(addCellsToImpulses)
//While any impulses are active
//	every frame, check each cell to cell if it belong to the same color group the active impulse is affecting
//		if it is, and the cell is not already on the active impulse's list of cells it affects, then add that cell to the active impulse's list of cells it affects (cells will never be deleted from this list--the impulse will simply expire)

//more broken down of the same:
//as each cell is drawn (in drawAllCells --> drawCell)
//cycle through the "impulses" array looking for those that aren't null; or if implemented another way, cycle through each of them if impulses.length > 0
//for any active impulses, compare their list of colorGroupsAffected against the cell's colorGroup
//if there are any matches
//check the impulse's list of cells affected
//if the current cell is not on that list, then add it to that list


//Should I be using "while" loops instead of "for" loops sometimes? I should check out what they do...




//GOAL: When an impulse activates:
//	add cells to *its* list
//	don't remove any cells until it dies
//	add cells that become its affected color group even after its activated

//In adding impulses to a cell's list of impuleses (cell.impulses) EVERY FRAME we've recreated the FLICKERING problem from before.
//	I want impulses, once added to cell.impulses, to not be removed from that array until they're expired.
//	This seems like it should be simple by, in addImpulsesToCell (under interface.js doc) checking each of the impulses
//		in a cell's list of impulses (cell.impulses) CURRENTLY:****against the currently-being-checked impulse and not adding it if there's a match.*****
//		For some reason this wasn't working when I tried to do it. Is there a problem checking object against each other? They should be
//		the same objects, just different pointers (in cell.impulses[] and impulses[]), right?
//		But the code I'm trying to use to avoid duplicate impulses in cells impulse list leaves *no* impulses in the list instead.
//		If I don't remove all the impulses from a cell's impulse list each frame (like I am now), then the same impulse gets added
//			to the cell's list each frame.
//		If I *do* remove all the impulses from the cell's list each frame, then I get the flickering I have now.
//Cells only have one colorGroup. If we make them have more at some point, then addImpulsesToCell in interface needs to be slightly rewritten.


//FLICKERING AND COLOR GROUPS AND IMPULSES -- LONG-TERM PROBLEM
//setCellColorGroup, under the colors.js doc, is not assigning cell.colorGroup whenever any impulse in impulses[] is active.
//	This keeps impulses from causing cells to flicker as they:
//		rise in brightness due to the impulses influence, then
//		have their colorGroup changed due to their new color, then
//		are no longer affected by the impulse because their colorGroup is no longer the one the impulse is affecting
//		so their brightness drops, so
//		they're assigned back to the colorGroup that's being affected by the active impulse, which
//		starts the cycle over again.
//	BUT!!, long-term it will probably be important to have a more-responsive/-selective system of preventing the flickering.
//		As things are, having multiple impulses affecting multiple color groups probably wouldn't work very well.
//	Another issue with the current setup is that:
//		if an impulse is active (say brightening reds so that they become greens),
//		it looks weird when the impulse is active and a lot of red is being brightened to green, but
//		but other cells have become red *during* the active phase of hte impulse, and yet
//		aren't being affected by the impulse.
//		I.e. while the impulse is active, it should "sweep up" cells into its influence that have
//			moved into the impulse's "aegis" in the time since the impulse was activated.





//Could try making cell spectrum location (i.e. height, hue, brightness) influence native oscillator/s period duration.

//Cells should have a height, not just color. That way draw order won't matter, or some other purely visual factors. Or maybe not? Something else?



//Impulses have become the main language through which the player can act and maybe through any actions take place during the game.
//There should probably be a language of impulses that includes linking and cancelling/chaining a la fighting games.
//	But in which the "timers" are exposed to reveal windows (i.e. cooldown frames during which a link can take place).
//	Also, the "combos" should all be straight-forwardly comprehensible, not resting on arbitrary relationships that must be memorized.

//Someday may want oscillators and impulses to be able to work with non-triangle waves (and non-saw waves in the case of impulses).
//May want to work out some kind of asymtotic curve for how brightness is mapped to the rainbow.




////////////////////////////////
//BROADER CONCEPTUAL ISSUES:
//I've gone to a more conventional "control the localized player thing" from what I had originally wanted. Maybe I should back away from that again?
//	I ended up "going there" because it's hard to dictate what one is interacting with without some kind of center or "local source" of how your input radiates into effect.

//Maybe "try to make everything green" could be a goal. Later, the goal could come from awareness of a broader circumstance (i.e. "if [x], then try to make the screen [y],
//	where "y" could be a color or a condition, such as a heavy split of warm and cool colors).

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
//Flags and other arrays lists:

//cell.flags (stated function is if the flag is "true")
//0 = red or orange
//1 = yellow
//2 = green
//3 = cyan
//4 = blue


//oscillator.flags
//0 = "native"--oscillators a cell spawns with, or that are considered part of its "home state" that persists even as other influences are added and removed


///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

//FILE ORGANIZATION
//Stuff that should be in "cells.js," "oscillators.js" and "misc.js" are all in "initialization.js" until I sort out dependencies,
//	which Chris describes in the "oscillation programming thread part II" email thread.