# Ising Applet #

### What is this repository for? ###

Testing ground-states of small (< 18-20 node) Ising Graphs. You can think of an Ising Graph as a representation of a Quadratic Polynomial with variables in the range {-1, +1} (also known as a Hamiltonian). Each vertex of the graph corresponds to a variable, and the edges correspond to quadratic terms in those variables.

<img src="https://github.com/SamTonetto/p5sketches/blob/master/Ising/Hamiltonian.png" alt="drawing" width="500"/>

### How do I get set up? ###

Download repository and click on "index.html" to run.

### Instructions for use ###

After running "index.html", you can construct an Ising Graph in the embedded canvas.

Mouse operations:

- Left-click to create a node or edit a weight
- Left-click two nodes to create an edge
- Right-click to remove a node or edge
- When editing an edge-weight, TAB to cycle through edge-weights

After creating a graph, press buttons to do stuff.

### Wish-list / To-do ###

- Built-in standard graphs (Petersen, Chimera etc.)
- Grid snap-to / grid-lines
- Place weights more neatly and unambiguously
- Ability to set default weight
- Enable drag-move of vertices, weights, edges
- Enable filtering of solutions by energy range or nth excited level
- Enable saving of energy spectrum

### Acknowledgments ###

FileSaver.js

https://github.com/eligrey/FileSaver.js/

P5.js

https://p5js.org/

jQuery

https://jquery.com/
