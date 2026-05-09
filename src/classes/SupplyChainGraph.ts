import { SupplyNode } from 'src/types/SupplyNode';
import { SupplyNodeConnection } from 'src/types/SupplyNodeConnection';

interface SupplyGraphEdge {
  conn_id: string;
  node: SupplyGraphNode;
  distance: number;
}

interface SupplyGraphNode extends SupplyNode {
  next: SupplyGraphEdge[];
}

export class SupplyGraph {
  readonly supplyNode: SupplyGraphNode | undefined = undefined;
  #nodesMap = new Map<string, SupplyGraphNode>();

  constructor(supplyNodeConnections: SupplyNodeConnection[]) {
    if (supplyNodeConnections.length > 0) {
      this.supplyNode = this.createGraph(
        supplyNodeConnections,
        supplyNodeConnections[0].start_node,
      );
    }
  }

  private createGraph(
    connections: SupplyNodeConnection[],
    currentNode: SupplyNode,
  ): SupplyGraphNode {
    if (this.#nodesMap.has(currentNode.id)) {
      return this.#nodesMap.get(currentNode.id)!;
    }

    const newNode: SupplyGraphNode = { ...currentNode, next: [] };
    this.#nodesMap.set(currentNode.id, newNode);

    const childrenConnections = connections.filter(
      (conn) => conn.start_node.id === currentNode.id,
    );

    childrenConnections.forEach((connection) => {
      newNode.next.push({
        conn_id: connection.id,
        node: this.createGraph(connections, connection.destination_node),
        distance: connection.distance,
      });
    });

    return newNode;
  }
}
