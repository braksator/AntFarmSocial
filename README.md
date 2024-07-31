# AntFarmSocial

Ant Simulator

===========


![Ant Farm Social](./img/antFarm.png)


A web browser-based ant simulator game that is best played with a large 
monitor and a lot of spare time. Game doesn't run properly in the background.

> Influenced by Matt & Mattingly's Ice Cream Social podcast, and Scoop Group.


## Developing

Probably not interested in contributions, excepting egregious bugs.  Feel free
to remix this into your own game.  If you're doing that, or you're future me
finding this and confused about how to get back into it, here are some tips:

Install NodeJS, load the folder in Visual Studio Code (or similar), run 
"npm update" in the command line, don't edit "afs.min.js" or "afs.min.css",
those are generated by the command "gulp", which will then sit and watch for 
file changes in the "js" and "css" directories.  You'll notice the js aliases
a lot of common properties and functions, this is for the benefit of the 
terser minifier - try to keep optimising that by analyzing the minified code 
for repeated strings and being familiar with the existing aliases.
You can edit antViewer.html or create a similar file to test out animations
and other ideas.  Other than that, take your cues from what is already there.


*************************************
Created by D.A. Braksator, 2023-2024.
