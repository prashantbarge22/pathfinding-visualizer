import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
// import Header from "./layout/Header";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";

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
    };
  }

  componentDidMount() {
    const grid = createInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = createNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = createNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (nodesInShortestPathOrder.length > 1) {
          if (i === 0) {
            document.getElementById(
              `node (${node.row},${node.col})`
            ).className = "node start-node-shortest-path";
          } else if (i === nodesInShortestPathOrder.length - 1) {
            document.getElementById(
              `node (${node.row},${node.col})`
            ).className = "node finish-node-shortest-path";
          } else {
            document.getElementById(
              `node (${node.row},${node.col})`
            ).className = "node node-shortest-path";
          }
        }
      }, 50 * i);
    }
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
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

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  resetNode(node) {
    node.distance = Infinity;
    node.isVisited = false;
    node.isWall = false;
    node.previousNode = null;
  }

  clearGrid() {
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
        } else {
          document.getElementById(`node (${node.row},${node.col})`).className =
            "node ";
        }
        this.resetNode(node);
      }
    }
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <>
        <div>
          <header className="header">
            <h1>Pathfinding Visualizer</h1>
          </header>
          <select id="algorithm-select">
            <option value="" disabled selected>
              Search Algorithms
            </option>
            <option value="dijkstra">Dijkstra's Algorithm</option>
            <option value="a-star">A* Search</option>
            <option value="dfs">Depth-first Search</option>
            <option value="bfs">Breadth-first Search</option>
          </select>
          <button className="viz-btn" onClick={() => this.visualizeDijkstra()}>
            Visualize!
          </button>
          <button className="clear-btn" onClick={() => this.clearGrid()}>
            Clear Grid
          </button>
        </div>
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
