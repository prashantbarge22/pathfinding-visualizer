import * as utils from "./algorithmUtils.js";

export default function aStar(grid, startNode, finishNode, heuristic) {
  const visitedNodesInOrder = [];
  const nodePQ = [];
  nodePQ.push(startNode);
  while (!!nodePQ.length) {
    const currentNode = nodePQ.shift();
    if (currentNode.isWall) continue;
    visitedNodesInOrder.push(currentNode);
    if (currentNode === finishNode) return visitedNodesInOrder;
    if (currentNode.isVisited === false) {
      currentNode.isVisited = true;
      const neighbors = utils.getNeighbors(currentNode, grid);
      for (let neighbor of neighbors) {
        nodePQ.push(neighbor);
        neighbor.previousNode = currentNode;
        nodePQ.sort(
          (node1, node2) =>
            heuristic(node1, startNode) -
            heuristic(node2, startNode) +
            (heuristic(node1, finishNode) - heuristic(node2, finishNode))
        );
      }
    }
  }
}
