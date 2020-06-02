export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const unvisitedNodes = getAllNodes(grid);
  startNode.distance = 0;
  while (!!unvisitedNodes.length) {
    const minNode = sortedNodes(unvisitedNodes).shift();
    if (minNode.isWall) continue;
    if (minNode.distance === Infinity) return visitedNodesInOrder;
    minNode.isVisited = true;
    visitedNodesInOrder.push(minNode);
    if (minNode === finishNode) return visitedNodesInOrder;
    const neighbors = getUnvisitedNeighbors(minNode, grid);
    updateUnvisitedNeighbors(minNode, neighbors);
  }
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function sortedNodes(unvisitedNodes) {
  return unvisitedNodes.sort((a, b) => a.distance - b.distance);
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  if (row > 0) {
    neighbors.push(grid[row - 1][col]);
  }
  if (col < grid[0].length - 1) {
    neighbors.push(grid[row][col + 1]);
  }
  if (row < grid.length - 1) {
    neighbors.push(grid[row + 1][col]);
  }
  if (col > 0) {
    neighbors.push(grid[row][col - 1]);
  }
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function updateUnvisitedNeighbors(node, neighbors) {
  for (let neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
