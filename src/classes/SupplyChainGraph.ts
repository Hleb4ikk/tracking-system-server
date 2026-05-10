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
  readonly allNodes: Map<string, SupplyGraphNode> = new Map();
  readonly connections: SupplyNodeConnection[] = [];
  #nodesMap = new Map<string, SupplyGraphNode>();

  constructor(supplyNodeConnections: SupplyNodeConnection[]) {
    this.connections = supplyNodeConnections;

    if (supplyNodeConnections.length > 0) {
      // Build complete graph with all nodes
      this.buildCompleteGraph(supplyNodeConnections);

      // Find root nodes (nodes with no incoming connections)
      const rootNodes = this.findRootNodes(supplyNodeConnections);

      // Set first root as main entry point (for backward compatibility)
      if (rootNodes.length > 0) {
        this.supplyNode = this.#nodesMap.get(rootNodes[0].id);
      } else if (supplyNodeConnections.length > 0) {
        // If no root nodes (cycle), use first node
        this.supplyNode = this.#nodesMap.get(
          supplyNodeConnections[0].start_node.id,
        );
      }

      // Copy all nodes to public map
      this.allNodes = new Map(this.#nodesMap);
    }
  }

  private buildCompleteGraph(connections: SupplyNodeConnection[]): void {
    // First pass: create all nodes
    connections.forEach((conn) => {
      if (!this.#nodesMap.has(conn.start_node.id)) {
        this.#nodesMap.set(conn.start_node.id, {
          ...conn.start_node,
          next: [],
        });
      }
      if (!this.#nodesMap.has(conn.destination_node.id)) {
        this.#nodesMap.set(conn.destination_node.id, {
          ...conn.destination_node,
          next: [],
        });
      }
    });

    // Second pass: create edges
    connections.forEach((conn) => {
      const startNode = this.#nodesMap.get(conn.start_node.id)!;
      const destNode = this.#nodesMap.get(conn.destination_node.id)!;

      startNode.next.push({
        conn_id: conn.id,
        node: destNode,
        distance: conn.distance,
      });
    });
  }

  private findRootNodes(connections: SupplyNodeConnection[]): SupplyNode[] {
    const nodesWithIncoming = new Set<string>();

    connections.forEach((conn) => {
      nodesWithIncoming.add(conn.destination_node.id);
    });

    const allNodeIds = new Set<string>();
    connections.forEach((conn) => {
      allNodeIds.add(conn.start_node.id);
      allNodeIds.add(conn.destination_node.id);
    });

    const rootNodes: SupplyNode[] = [];
    connections.forEach((conn) => {
      if (
        !nodesWithIncoming.has(conn.start_node.id) &&
        !rootNodes.find((n) => n.id === conn.start_node.id)
      ) {
        rootNodes.push(conn.start_node);
      }
    });

    return rootNodes;
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
