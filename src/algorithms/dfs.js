import * as utils from "./algorithmUtils.js";

export default function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const nodeStack = [];
  nodeStack.push(startNode);
  while (!!nodeStack.length) {
    const currentNode = nodeStack.pop();
    if (currentNode.isWall) continue;
    visitedNodesInOrder.push(currentNode);
    if (currentNode === finishNode) return visitedNodesInOrder;
    if (currentNode.isVisited === false) {
      currentNode.isVisited = true;
      const neighbors = utils.getNeighbors(currentNode, grid);
      for (let neighbor of neighbors) {
        nodeStack.push(neighbor);
        neighbor.previousNode = currentNode;
      }
    }
  }
  return visitedNodesInOrder;
}
