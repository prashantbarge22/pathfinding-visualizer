import * as utils from "./algorithmUtils.js";

export default function bfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const nodeQueue = [];
  nodeQueue.push(startNode);
  while (!!nodeQueue.length) {
    const currentNode = nodeQueue.shift();
    if (currentNode.isWall) continue;
    visitedNodesInOrder.push(currentNode);
    if (currentNode === finishNode) return visitedNodesInOrder;
    if (currentNode.isVisited === false) {
      currentNode.isVisited = true;
      const neighbors = utils.getNeighbors(currentNode, grid);
      for (let neighbor of neighbors) {
        nodeQueue.push(neighbor);
        neighbor.previousNode = currentNode;
      }
    }
  }
  return visitedNodesInOrder;
}
