"use client";

import dynamic from "next/dynamic";

const WorkflowCanvas = dynamic(
  () => import("@/components/workflow-canvas"),
  { ssr: false }
);

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <WorkflowCanvas />
    </div>
  );
}
