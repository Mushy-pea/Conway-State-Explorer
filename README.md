# Conway State Explorer

## A journey of discovery into cellular automata

The Game of Life was developed by mathematician John Horton Conway in 1970; see this
[Wikipedia page](https://en.wikipedia.org/wiki/Conway's_Game_of_Life) for a detailed description.
It is an example of a cellular automation where the player chooses the initial state of cells on the
board and can then watch the state evolve as a result of the rules being applied each turn.  The
intention of this app is to provide the user a mobile game of life experience with the following
features.

1.  Touch screen setting of game board patterns.

2.  Option to download many preset patterns and share patterns with other app users.

3.  Game rules that can be modified.

4.  A range of rendering options including colours and visual effects.

The app frontend is so far being developed using TypeScript, React Native and WebGL and tested in an
Android environment.  A Node.js based REST API server has been developed to allow for the pattern 
repository feature mentioned above, which has a separate repository here:
https://github.com/Mushy-pea/Conway-State-Explorer-Server.  In addition to releases on Github I hope
to deploy the app to Google Play in time.

[![Preview unavailable](https://img.youtube.com/vi/pVQ8gXEufAE/default.jpg)](https://youtu.be/pVQ8gXEufAE)
