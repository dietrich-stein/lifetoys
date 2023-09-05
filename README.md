# LifeToys

This project is based on code originally developed for [The Life Engine](https://thelifeengine.net/). It is a simulator and visualizer for cellular organisms to demonstrate behaviors that mimic aspects of biological evolution. The organisms eat, move, mutate, adapt, and reproduce. The ones that survive will successfully produce more offspring and in turn will naturally propagate throughout the environment as they dominate their competition.

## Developer Overview

### Project History

Awhile back, in an older repo, the original code was converted into TypeScript and some enhancements were made:

- Partial progress converting the controls to dat.GUI
- A cell type for Brain, to pave the way for decision option and mutation enhancement based on count.
- Eyes are now useless unless a brain cell is also present.
- All organism anatomies automatically track `has_` flags and counts for all cell states/types.
- Mover cell counts affect move range and reproduction

More recently, this repo was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) TS template.

Even more recently, significant portions of that older TypeScript repo were brought over into this repo file-by-file in order to reign them into React components with a Redux store.

Probably none of the HTML from the original code remains. Aside from rendered simulation and cell color choices, nothing visual from the original code is used. To pull that off, this repo replaces the custom control panel interfaces with dat.GUI control panels. Only, instead of dat.GUI we use dis-gui. Oh, and only, instead of dis-gui we have our own custom fork that has been upgraded from React 16 to React 18.

---

## Scripts

In the project directory, you can run any of the following commands:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

> Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

> You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

---

## How the Simulation Works

### The Environment

The environment is a simple grid system made up of cells, which at every tick have a certain type. The environment is populated by organisms, which are structures of multiple cells.

### Cells

A cell can be one of the following types.

#### Independent Cells

Independent cells are not part of organisms.

- Empty - Dark blue, inert.
- Food - Grayish-blue, provides nourishment for organisms.
- Wall - Gray, blocks organisms movement and reproduction.

#### Organism Cells

Organism Cells are only found in organisms, and cannot exist on their own in the grid.

- Mouth - Orange, eats food in directly adjacent cells.
- Producer - Green, randomly generates food in directly adjacent empty cells.
- Mover - Light blue, allows the organism to move and rotate randomly.
- Stinger - Red, harms organisms in directly adjacent cells (besides itself).
- Armor - Purple, negates the effects of stinger cells.
- Eye - Light purple with a slit, allows the organism to see and move intelligently. See further description below.

### Organisms

Organisms are structures of cells that eat food, reproduce, and die.
When an organism dies, every cell in the grid that was occupied by a cell in its body will be changed to food.
Their lifespan is calculated by multiplying the number of cells they have by the hyperparameter `Lifespan Multiplier`. They will survive for that many ticks unless killed by another organism.
When touched by a stinger cell, an organism will take damage. Once it has taken as much damage as it has cells in its body, it will die. If the hyperparameter `One touch kill` is on, an organism will immediatly die when touched by a stinger cell.

### Reproduction

Once an organism has eaten as much food as it has cells in its body, it will attempt to reproduce.
First, offspring is formed by cloning the current organism and possibly mutating it (see below).
The offspring birth location is then chosen a certain number of cells in a random direction (up, down, left, right). This number is calculated programmatically such that it is far enough away that it can't intersect with it's parent.
Additionally, a random value between 1 and 3 is added to the location to introduce a little variance.
Reproduction can fail if the offspring attempts to occupy non-empty cells, like other organisms and food. If reproduction fails, the food required to produce a child is wasted.

### Mutation

Offspring can mutate their anatomies in 3 different ways: change a cell, lose a cell, or add a cell. Changing a cell sets a random cell to a random type. Losing a cell removes a random cell. Note that this can result in organisms with "gaps" and cells disconnected from the rest of its body. I consider this a feature, not a bug.
To add a cell the organism first selects a cell it already has in its body, then grows a new cell with a random type in a location adjacent to the selected cell.

If an organism mutates, there is a 10% chance that mutation will alter the movement patterns of the organism (see below).

### Movement and Rotation

Organisms with mover cells (light blue) are permitted to move freely about the grid. Only a single mover cell is required and adding more doesn't do anything. By default, an organism selects a random direction and moves one cell per tick in that direction for a certain number of ticks. This number is called "Move range", and it can mutate over time.

Organisms can also rotate around a central pivot cell. This cell can never be removed by mutation, though it can change type. Movers rotate randomly when they change direction, and their rotation is not necessarily the same as their movement direction, ie, they aren't always facing the direction they are moving. Offspring of all organisms (including static ones) rotate randomly during reproduction. This rotation can be toggled in the simulation controls.

### Eyes and Brains

Any organism can evolve eyes, but when an organism has both eyes and mover cells it is given a brain. The eye, unlike other cells, has a direction, which is denoted by the direction of the slit in the cell. It "looks" forward in this direction and "sees" the first non-empty cell within a certain range. It checks the type of the cell and informs the brain, which then decides how to move. The brain can either ignore (keep moving in whatever direction), chase (move towards the observed cell), or retreat (move in the opposite direction of the observed cell). The brain maps different observed cell types to different actions. For instance, the brain will chase when it sees food and retreat when it sees a stinger cell. These behaviors can mutate over time.
