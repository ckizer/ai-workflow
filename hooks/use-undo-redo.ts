import { useCallback, useRef } from "react";
import type { Node, Edge } from "@xyflow/react";

type Snapshot = {
  nodes: Node[];
  edges: Edge[];
};

const MAX_HISTORY = 100;

export function useUndoRedo(
  setNodes: (nodes: Node[]) => void,
  setEdges: (edges: Edge[]) => void
) {
  const history = useRef<Snapshot[]>([]);
  const future = useRef<Snapshot[]>([]);
  const currentSnapshot = useRef<Snapshot | null>(null);

  /** Call this to save the current state before a mutation */
  const takeSnapshot = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      // Push current state to history
      if (currentSnapshot.current) {
        history.current.push(currentSnapshot.current);
        if (history.current.length > MAX_HISTORY) {
          history.current.shift();
        }
      }
      // Clear future on new action
      future.current = [];
      // Store new current
      currentSnapshot.current = {
        nodes: nodes.map((n) => ({ ...n })),
        edges: edges.map((e) => ({ ...e })),
      };
    },
    []
  );

  const undo = useCallback(() => {
    const prev = history.current.pop();
    if (!prev) return;

    // Push current to future
    if (currentSnapshot.current) {
      future.current.push(currentSnapshot.current);
    }

    currentSnapshot.current = prev;
    setNodes(prev.nodes);
    setEdges(prev.edges);
  }, [setNodes, setEdges]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;

    // Push current to history
    if (currentSnapshot.current) {
      history.current.push(currentSnapshot.current);
    }

    currentSnapshot.current = next;
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [setNodes, setEdges]);

  const canUndo = useCallback(() => history.current.length > 0, []);
  const canRedo = useCallback(() => future.current.length > 0, []);

  return { takeSnapshot, undo, redo, canUndo, canRedo };
}
