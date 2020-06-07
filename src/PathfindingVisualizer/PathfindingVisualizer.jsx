import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import dijkstra from "../algorithms/dijkstra";
import dfs from "../algorithms/dfs";
import bfs from "../algorithms/bfs";
import greedyBfs from "../algorithms/greedy-bfs";
import getNodesInShortestPathOrder, {
  manhattanDistance,
} from "../algorithms/algorithmUtils";
import aStar from "../algorithms/a-star";

const START_NODE_ROW = 10;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 40;

const GRID_HEIGHT = 20;
const GRID_WIDTH = 50;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      currentAlgorithm: "dijkstra", // default
    };
  }

  componentDidMount() {
    const grid = createInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    // if buttons are disabled, don't produce walls either
    const button = document.getElementById("viz-btn");
    if (button.disabled === true) {
      return;
    }
    const newGrid = createNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    const button = document.getElementById("viz-btn");
    if (!this.state.mouseIsPressed || button.disabled === true) return;
    const newGrid = createNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  toggleInputs(disable = false) {
    const navbar = document.getElementById("navbar");
    const buttons = navbar.getElementsByTagName("button");
    if (disable === true) {
      for (let button of buttons) {
        button.disabled = true;
      }
    } else {
      for (let button of buttons) {
        button.disabled = false;
      }
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        console.log(node);
        if (nodesInShortestPathOrder.length > 1) {
          if (i === 0) {
            document.getElementById(
              `node (${node.row},${node.col})`
            ).className = "node start-node-shortest-path";
          } else if (i === nodesInShortestPathOrder.length - 1) {
            document.getElementById(
              `node (${node.row},${node.col})`
            ).className = "node finish-node-shortest-path";
            this.toggleInputs(false);
          } else {
            document.getElementById(
              `node (${node.row},${node.col})`
            ).className = "node node-shortest-path";
          }
        } else {
          this.toggleInputs(false);
        }
      }, 30 * i);
    }
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    // disable button input while the algorithm is running
    this.toggleInputs(true);
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (i === 0) {
          document.getElementById(`node (${node.row},${node.col})`).className =
            "node start-node-visited";
        } else if (
          i === visitedNodesInOrder.length - 1 &&
          nodesInShortestPathOrder.length > 1
        ) {
          document.getElementById(`node (${node.row},${node.col})`).className =
            "node finish-node-visited";
        } else {
          document.getElementById(`node (${node.row},${node.col})`).className =
            "node node-visited";
        }
      }, 10 * i);
    }
  }

  visualizeDijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeDFS(grid, startNode, finishNode) {
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeBFS(grid, startNode, finishNode) {
    const visitedNodesInOrder = bfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeGreedyBFS(grid, startNode, finishNode) {
    const visitedNodesInOrder = greedyBfs(
      grid,
      startNode,
      finishNode,
      manhattanDistance
    );
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAStar(grid, startNode, finishNode) {
    const visitedNodesInOrder = aStar(
      grid,
      startNode,
      finishNode,
      manhattanDistance
    );
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAlgorithm() {
    this.clearGrid(true);
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    switch (this.state.currentAlgorithm) {
      case "dijkstra":
        this.visualizeDijkstra(grid, startNode, finishNode);
        break;
      case "dfs":
        this.visualizeDFS(grid, startNode, finishNode);
        break;
      case "bfs":
        this.visualizeBFS(grid, startNode, finishNode);
        break;
      case "greedy-bfs":
        this.visualizeGreedyBFS(grid, startNode, finishNode);
        break;
      case "a-star":
        this.visualizeAStar(grid, startNode, finishNode);
        break;
      default:
    }
    this.showAlgoDescription();
  }

  changeCurrentAlgo() {
    const algorithmSelect = document.getElementById("algorithm-select");
    const selectedAlgorithm =
      algorithmSelect.options[algorithmSelect.selectedIndex].value;
    switch (selectedAlgorithm) {
      case "dijkstra":
        this.setState({ currentAlgorithm: "dijkstra" });
        break;
      case "dfs":
        this.setState({ currentAlgorithm: "dfs" });
        break;
      case "bfs":
        this.setState({ currentAlgorithm: "bfs" });
        break;
      case "greedy-bfs":
        this.setState({ currentAlgorithm: "greedy-bfs" });
        break;
      case "a-star":
        this.setState({ currentAlgorithm: "a-star" });
        break;
      default:
    }
  }

  resetNode(node, keepWall = false) {
    node.distance = Infinity;
    node.isVisited = false;
    node.previousNode = null;
    if (!keepWall) {
      node.isWall = false;
    }
  }

  clearGrid(keepWall = false) {
    const { grid } = this.state;
    for (let row of grid) {
      for (let node of row) {
        if (node.row === START_NODE_ROW && node.col === START_NODE_COL) {
          document.getElementById(`node (${node.row},${node.col})`).className =
            "node node-start";
        } else if (
          node.row === FINISH_NODE_ROW &&
          node.col === FINISH_NODE_COL
        ) {
          document.getElementById(`node (${node.row},${node.col})`).className =
            "node node-finish";
        } else if (node.isWall && keepWall) {
          continue;
        } else {
          document.getElementById(`node (${node.row},${node.col})`).className =
            "node ";
        }
        this.resetNode(node, keepWall);
      }
    }
  }

  toggleInstructions() {
    const instr = document.getElementById("instructions");
    if (instr.style.display === "none") {
      instr.style.display = "block";
    } else {
      instr.style.display = "none";
    }
  }

  showAlgoDescription() {
    const { currentAlgorithm } = this.state;
    const allDescs = document.getElementById("algo-desc");
    const individualDescs = allDescs.getElementsByTagName("*");
    const currAlgoID = `${currentAlgorithm}-desc`;
    for (let i of individualDescs) {
      if (i.id === currAlgoID) {
        i.style.display = "block";
      } else {
        i.style.display = "none";
      }
    }
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <>
        <div id="navbar">
          <header className="header">
            <h1>Pathfinding Visualizer</h1>
          </header>
          <label id="algo-select-label">Choose an algorithm:</label>
          <select
            id="algorithm-select"
            onChange={() => this.changeCurrentAlgo()}
          >
            <option value="dijkstra">Dijkstra's Algorithm</option>
            <option value="dfs">Depth-first Search</option>
            <option value="bfs">Breadth-first Search</option>
            <option value="greedy-bfs">Greedy Best-first Search</option>
            <option value="a-star">A* Search</option>
          </select>
          <button id="viz-btn" onClick={() => this.visualizeAlgorithm()}>
            Visualize!
          </button>
          <button id="clear-btn" onClick={() => this.clearGrid()}>
            Clear Grid
          </button>
          <button id="instr-btn" onClick={() => this.toggleInstructions()}>
            Show/Hide Instructions
          </button>
        </div>
        <p id="instructions">
          Instructions: Choose an algorithm. Then, you can draw "walls" on the
          grid by clicking and slowly dragging your mouse across the grid. Click
          the button to visualize the algorithm and watch it navigate around
          your walls to find the shortest path from the start node to the end
          node.
        </p>
        <header id="algo-desc">
          <h3 id="dijkstra-desc">
            Dijkstra's algorithm is a weighted search algorithm that guarantees
            the shortest path!
          </h3>
          <h3 id="dfs-desc">
            Depth-first search is an weighted search algorithm that does not
            guarantee the shortest path!
          </h3>
          <h3 id="bfs-desc">
            Breadth-first search is an unweighted search algorithm that
            guarantees the shortest path!
          </h3>
          <h3 id="greedy-bfs-desc">
            Greedy best-first search is a weighted search algorithm that does
            not guarantee the shortest path!
          </h3>
          <h3 id="a-star-desc">
            A* search is a weighted search algorithm that guarantees the
            shortest path!
          </h3>
        </header>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row">
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const createInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < GRID_HEIGHT; row++) {
    const currentRow = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    g: 0,
    h: 0,
    f: 0,
  };
};

const createNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

// const createNewGridWithStartNodeToggled = (grid, row, col) => {
//   const newGrid = grid.slice();
//   const node = newGrid[row][col];
//   const newNode = {
//     ...node,
//     isStart: true,
//   };
//   newGrid[row][col] = newNode;
//   START_NODE_ROW = row;
//   START_NODE_COL = col;
//   return newGrid;
// };

// const createNewGridWithFinishNodeToggled = (grid, row, col) => {
//   const newGrid = grid.slice();
//   const node = newGrid[row][col];
//   const newNode = {
//     ...node,
//     isFinish: true,
//   };
//   newGrid[row][col] = newNode;
//   FINISH_NODE_ROW = row;
//   FINISH_NODE_COL = col;
//   return newGrid;
// };
