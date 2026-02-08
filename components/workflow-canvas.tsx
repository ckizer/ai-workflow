// @ts-nocheck
"use client";

import { Canvas } from "@/components/ai-elements/canvas";
import { Connection } from "@/components/ai-elements/connection";
import { Controls } from "@/components/ai-elements/controls";
import { Edge } from "@/components/ai-elements/edge";
import {
  Node,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from "@/components/ai-elements/node";
import { Panel as StyledPanel } from "@/components/ai-elements/panel";
import { Toolbar } from "@/components/ai-elements/toolbar";
import { Button } from "@/components/ui/button";
import { useUndoRedo } from "@/hooks/use-undo-redo";
import {
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type NodeProps as RFNodeProps,
} from "@xyflow/react";
import {
  Copy,
  GitBranch,
  Pencil,
  Play,
  Plus,
  Redo2,
  SquareFunction,
  Trash2,
  Undo2,
} from "lucide-react";
import { useCallback, useEffect } from "react";

const nodeIds = {
  decision: "node-decision",
  output1: "node-output1",
  output2: "node-output2",
  process1: "node-process1",
  process2: "node-process2",
  start: "node-start",
};

const initialNodes = [
  {
    data: {
      description: "Initialize workflow",
      handles: { source: true, target: false },
      label: "Start",
    },
    id: nodeIds.start,
    position: { x: 0, y: 0 },
    type: "workflow",
  },
  {
    data: {
      description: "Transform input",
      handles: { source: true, target: true },
      label: "Process Data",
    },
    id: nodeIds.process1,
    position: { x: 500, y: 0 },
    type: "workflow",
  },
  {
    data: {
      description: "Route based on conditions",
      handles: { source: true, target: true },
      label: "Decision Point",
    },
    id: nodeIds.decision,
    position: { x: 1000, y: 0 },
    type: "workflow",
  },
  {
    data: {
      description: "Handle success case",
      handles: { source: true, target: true },
      label: "Success Path",
    },
    id: nodeIds.output1,
    position: { x: 1500, y: -100 },
    type: "workflow",
  },
  {
    data: {
      description: "Handle error case",
      handles: { source: true, target: true },
      label: "Error Path",
    },
    id: nodeIds.output2,
    position: { x: 1500, y: 100 },
    type: "workflow",
  },
  {
    data: {
      description: "Finalize workflow",
      handles: { source: false, target: true },
      label: "Complete",
    },
    id: nodeIds.process2,
    position: { x: 2000, y: 0 },
    type: "workflow",
  },
];

const initialEdges = [
  {
    id: "edge-start-process1",
    source: nodeIds.start,
    target: nodeIds.process1,
    type: "animated",
  },
  {
    id: "edge-process1-decision",
    source: nodeIds.process1,
    target: nodeIds.decision,
    type: "animated",
  },
  {
    id: "edge-decision-output1",
    source: nodeIds.decision,
    target: nodeIds.output1,
    type: "animated",
  },
  {
    id: "edge-decision-output2",
    source: nodeIds.decision,
    target: nodeIds.output2,
    type: "temporary",
  },
  {
    id: "edge-output1-process2",
    source: nodeIds.output1,
    target: nodeIds.process2,
    type: "animated",
  },
  {
    id: "edge-output2-process2",
    source: nodeIds.output2,
    target: nodeIds.process2,
    type: "temporary",
  },
];

type WorkflowNodeData = {
  label: string;
  description: string;
  handles: { target: boolean; source: boolean };
};

function WorkflowNode({ data, id }: RFNodeProps<WorkflowNodeData>) {
  const { setNodes, setEdges, getNodes } = useReactFlow();

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  const handleDuplicate = () => {
    const original = getNodes().find((n) => n.id === id);
    if (!original) return;
    const newId = `${id}-copy-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      {
        ...original,
        id: newId,
        position: {
          x: original.position.x,
          y: original.position.y + 200,
        },
        selected: false,
      },
    ]);
  };

  return (
    <Node handles={data.handles}>
      <Toolbar>
        <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          title="Duplicate"
          onClick={handleDuplicate}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          title="Delete"
          onClick={handleDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </Toolbar>
      <NodeHeader>
        <NodeTitle>{data.label}</NodeTitle>
        <NodeDescription>{data.description}</NodeDescription>
      </NodeHeader>
      <NodeContent>
        <p>test</p>
      </NodeContent>
      <NodeFooter>
        <p>test</p>
      </NodeFooter>
    </Node>
  );
}

const nodeTypes = {
  workflow: WorkflowNode,
};

const edgeTypes = {
  animated: Edge.Animated,
  temporary: Edge.Temporary,
};

const nodeTemplates = [
  {
    icon: Play,
    label: "Start",
    description: "Initialize workflow",
    handles: { source: true, target: false },
  },
  {
    icon: SquareFunction,
    label: "Process",
    description: "Process data",
    handles: { source: true, target: true },
  },
  {
    icon: GitBranch,
    label: "Decision",
    description: "Route based on conditions",
    handles: { source: true, target: true },
  },
];

export default function WorkflowCanvas() {
  const [nodeState, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edgeState, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { takeSnapshot, undo, redo, canUndo, canRedo } = useUndoRedo(
    setNodes,
    setEdges
  );

  const handleAddNode = useCallback(
    (template: (typeof nodeTemplates)[number]) => {
      takeSnapshot(nodeState, edgeState);
      const id = `node-${Date.now()}`;
      const newNode = {
        id,
        type: "workflow",
        position: {
          x: Math.random() * 400 + 200,
          y: Math.random() * 300 - 150,
        },
        data: {
          label: template.label,
          description: template.description,
          handles: template.handles,
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [nodeState, edgeState, takeSnapshot, setNodes]
  );

  // Snapshot before drag moves and deletions
  const handleNodesChangeWithHistory: typeof onNodesChange = useCallback(
    (changes) => {
      const hasMeaningfulChange = changes.some(
        (c) =>
          c.type === "remove" ||
          (c.type === "position" && c.dragging === true && c.position)
      );
      if (hasMeaningfulChange) {
        const isDragStart = changes.some(
          (c) => c.type === "position" && c.dragging === true
        );
        const isRemove = changes.some((c) => c.type === "remove");
        if (isDragStart || isRemove) {
          takeSnapshot(nodeState, edgeState);
        }
      }
      onNodesChange(changes);
    },
    [onNodesChange, nodeState, edgeState, takeSnapshot]
  );

  const handleEdgesChangeWithHistory: typeof onEdgesChange = useCallback(
    (changes) => {
      const hasRemove = changes.some((c) => c.type === "remove");
      if (hasRemove) {
        takeSnapshot(nodeState, edgeState);
      }
      onEdgesChange(changes);
    },
    [onEdgesChange, nodeState, edgeState, takeSnapshot]
  );

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (mod && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return (
    <Canvas
      connectionLineComponent={Connection}
      edges={edgeState}
      edgeTypes={edgeTypes}
      fitView
      nodes={nodeState}
      nodeTypes={nodeTypes}
      onNodesChange={handleNodesChangeWithHistory}
      onEdgesChange={handleEdgesChangeWithHistory}
      panOnDrag={true}
      proOptions={{ hideAttribution: true }}
      selectionOnDrag={false}
      zoomOnDoubleClick={true}
      zoomOnPinch={true}
      zoomOnScroll={true}
    >
      {/* Node palette */}
      <StyledPanel position="top-left" className="flex flex-col gap-2 p-3">
        <p className="text-xs font-medium text-muted-foreground">Add Node</p>
        {nodeTemplates.map((template) => (
          <Button
            key={template.label}
            variant="ghost"
            size="sm"
            className="justify-start gap-2"
            onClick={() => handleAddNode(template)}
          >
            <template.icon className="h-3.5 w-3.5" />
            {template.label}
          </Button>
        ))}
      </StyledPanel>

      {/* Undo/Redo */}
      <Panel position="top-right">
        <div className="flex items-center gap-1 rounded-md border bg-card p-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            title="Undo (⌘Z)"
            onClick={undo}
            disabled={!canUndo()}
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            title="Redo (⌘⇧Z)"
            onClick={redo}
            disabled={!canRedo()}
          >
            <Redo2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Panel>

      <Controls position="bottom-right" />
      <Panel
        position="bottom-right"
        className="react-flow__attribution text-xs text-muted-foreground"
      >
        <a href="https://kizer.me" target="_blank" rel="noopener noreferrer">
          Kizer.me
        </a>
      </Panel>
    </Canvas>
  );
}
