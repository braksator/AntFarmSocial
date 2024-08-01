# Ant Farm Social

## Developers

I'm reluctant to maintain contributions, excepting egregious bugs.  Feel free
to remix this into your own game.  If you're doing that, or you're future me
finding this and confused about how to get back into it, here are some tips:

- Install NodeJS on your machine.
- Open repository folder in Visual Studio Code or similar editor.
- Run "npm update" in the command line terminal.
- DON'T EVER edit "index.html", "afs.min.js", or "afs.min.css"!
- Generate those files by running the command "gulp", or alternatively 
  "gulp --dev" which is easier for debugging.
- Gulp will then wait and watch for changes in the /css, /js, /html
  directories as long as it is left running.  You should read the gulpfile
  so that you are aware of some of the quirks in this project.
- If you create new css/js/html files, you'll need to study the gulpfile
  to figure out where to properly handle that.  Quit and restart gulp to test!
- You'll notice aliases used in the JS for common properties and functions,
  this is for the benefit of the terser minifier.  Try to keep up these
  optimisatations by: 1) Being familiar with the existing aliases, and 
  2) Keeping an eye on the string analysis in the gulp output for hints
  about inefficiencies.
- You can edit antViewer.html (or create a similar file) to test out
  animations and other ideas.
- Other than that, take your cues from what is already there.
- Prior to releasing code, update the app version by running
  'npm version patch', 'npm version minor' etc.., or modifying the package.json
  as the version is shown in the UI.

