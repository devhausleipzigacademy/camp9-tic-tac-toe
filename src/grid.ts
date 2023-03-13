import "./style.css";

// type declarations

type Coordinates = [number, number];

type Player = {
	name: string;
	symbol: "x" | "o";
	score: number;
};

type CellState = {
	markedBy: string | null;
	element: Element;
};

// utility functions or tools that will help me keep track of things

// the argument will look like [2 , 3] and will return "2-3"
function coordToId(coord: Coordinates): string {
	const [row, col] = coord;
	return `${row}-${col}`;
}

// "2" vs 2

// the argument will look like "2-3" and we will return [2,3]
function idToCoord(id: `${number}-${number}`): Coordinates {
	const [row, col] = id.split("-");
	return [parseInt(row), parseInt(col)];
}

// game settings
const gridSize = 3;
const gridCellStyling = ["h-[200px]", "w-[200px]", "border", "border-black"];

// grab my grid-container from the dom
const gameGrid = document.getElementById("grid-container")!;

// grab my player
const currentPlayerElement = document.getElementById(
	"current-player"
) as Element;

// grab button
const resetButton = document.getElementById("reset-button");

// make players
const players: Array<Player> = [
	{ name: "Player 1", symbol: "x", score: 0 },
	{ name: "Player 2", symbol: "o", score: 0 },
];

// game initial state

// this is where we have the turns set to 0 as the default
let turn = 0;

// this is where we keep track of whether the game has reached the end, and that we must stop the game from being further played
let gameEndState = false;

// this is the string that we are rendering on top of our tic tac toe grid that displays the users whose turn is it, and if a player won the game, or it was a draw, we might also use this space to display our message. So, kind of a message board where we interact with the user ?
currentPlayerElement.textContent = `The current player is: ${players[0].name}`;

// this is where we are tracking the game from the point of initial state, to the point when we reach the end state. Everything in between. CellState here refers to the type declared above, which is pointing at the activities allowed with the cell?
let gameState: Record<string, CellState> = {};

const winConditions = [
	["0-0", "0-1", "0-2"],
	["1-0", "1-1", "1-2"],
	["2-0", "2-1", "2-2"],
	["0-0", "1-0", "2-0"],
	["0-1", "1-1", "2-1"],
	["0-2", "1-2", "2-2"],
	["0-0", "1-1", "2-2"],
	["2-0", "1-1", "0-2"],
];

function makeMyGrid() {
	for (let row = 0; row < gridSize; row++) {
		for (let col = 0; col < gridSize; col++) {
			// create gridcell
			const cell = document.createElement("div");
			//add some styling
			cell.classList.add(...gridCellStyling);

			// attach ids to the cells

			//generate the ids
			const id = coordToId([row, col]);
			cell.id = id;

			// we initialize the cell state here, so that this can be tracked. We can also track them when adding event listeners for player symbols of "x" or "o"
			gameState[id] = {
				markedBy: null,
				element: cell,
			};

			// append the child to the dom
			gameGrid.appendChild(cell);

			//add eventListeners to the cells

			cell.addEventListener("click", (event) => {
				if (!gameEndState) {
					//need to know whose turn it is
					const currentPlayer = players[turn];

					//whichever player`s turn it is, add their symbol, to the "markedBy" key for each specific cell
					const cellState = gameState[id];

					const isMarked = Boolean(cellState.markedBy);

					if (!isMarked) {
						cellState.markedBy = currentPlayer.name;

						//update the cell to render the symbol on the tic tac toe

						cell.innerHTML = `<div class= "flex justify-center items-center h-full"><p class="text-3xl">${currentPlayer.symbol}</p></div>`;

						//here we have to bring our function for checking win condition

						// go to the next turn, and one can always wrap around
						turn = (turn + 1) % players.length;

						const nextPlayer = players[turn];

						currentPlayerElement.textContent = `The current player is: ${nextPlayer}`;
					}
				}
			});
		}
	}
}

makeMyGrid();
