import * as utils from "./algorithmUtils.js";

export default function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const unvisitedNodes = utils.getAllNodes(grid);
  startNode.distance = 0;
  while (!!unvisitedNodes.length) {
    const minNode = utils.sortedNodes(unvisitedNodes).shift();
    if (minNode.isWall) continue;
    if (minNode.distance === Infinity) return visitedNodesInOrder;
    minNode.isVisited = true;
    visitedNodesInOrder.push(minNode);
    if (minNode === finishNode) return visitedNodesInOrder;
    const neighbors = utils.getNeighbors(minNode, grid);
    for (let neighbor of neighbors) {
      neighbor.distance = minNode.distance + 1;
      neighbor.previousNode = minNode;
    }
  }
}
