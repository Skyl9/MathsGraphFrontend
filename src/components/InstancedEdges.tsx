import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { EdgeData, NodeData } from "../types/ApiTypes/graph";
import { useGraphStore } from "../stores/useGraphStore";
import { useUIStore } from "../stores/useUIStore";
import MathMarkdown from "./MathMarkdown";

const cylinderGeometry = new THREE.CylinderGeometry(0.015, 0.015, 1, 8);
cylinderGeometry.translate(0, 0.5, 0); // Origin at bottom
cylinderGeometry.rotateX(Math.PI / 2); // Point along Z axis

const arrowGeometry = new THREE.ConeGeometry(0.08, 0.2, 8);
arrowGeometry.rotateX(Math.PI / 2); // Point along Z axis

interface InstancedEdgesProps {
  edges: EdgeData[];
  nodesMap: Map<number, NodeData>;
  currentView: string;
  colorSides: string;
  filters: Record<string, boolean>;
}

const getNodePos = (node: NodeData, view: string): THREE.Vector3 => {
  const p = node.position[view] ||
    node.position["grille"] ||
    node.position["physique"] || { x: 0, y: 0, z: 0 };
  return new THREE.Vector3(p.x, p.y, p.z);
};

export default function InstancedEdges({
  edges,
  nodesMap,
  currentView,
  colorSides,
  filters,
}: InstancedEdgesProps) {
  const lineMeshRef = useRef<THREE.InstancedMesh>(null);
  const arrowMeshRef = useRef<THREE.InstancedMesh>(null);

  const hoveredNodeId = useGraphStore((s) => s.hoveredNodeId);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);

  const graphTheme = useUIStore((s) => s.graphTheme);
  const darkMode = useUIStore((s) => s.darkMode);
  const isNeon = graphTheme === "neon";
  const isFocus = graphTheme === "focus";

  const [hoveredEdgeIndex, setHoveredEdgeIndex] = useState<number | null>(null);

  const {
    lineCount,
    arrowCount,
    lineMatrices,
    arrowMatrices,
    colors,
    edgeMidpoints,
    edgeMathFormulas,
  } = useMemo(() => {
    let lCount = 0;
    let aCount = 0;

    // First pass to count
    for (const edge of edges) {
      const startNode = nodesMap.get(edge.start);
      const endNode = nodesMap.get(edge.end);
      if (!startNode || !endNode) continue;

      const startTypeKey = (startNode.typeMath ?? "").toLowerCase();
      const endTypeKey = (endNode.typeMath ?? "").toLowerCase();
      const isStartFiltered =
        startTypeKey in filters ? !(filters[startTypeKey] ?? false) : false;
      const isEndFiltered =
        endTypeKey in filters ? !(filters[endTypeKey] ?? false) : false;

      if (isStartFiltered || isEndFiltered) continue;

      lCount++;
      aCount++;
      if (edge.type === "equivalence" || edge.type === "reciproque") {
        aCount++;
      }
    }

    const _lineMatrices = new Float32Array(lCount * 16);
    const _arrowMatrices = new Float32Array(aCount * 16);
    const _colors = new Float32Array(lCount * 3);

    const _edgeMidpoints: THREE.Vector3[] = [];
    const _edgeMathFormulas: string[] = [];

    let lineIdx = 0;
    let arrowIdx = 0;
    const dummyMatrix = new THREE.Matrix4();
    const dummyQuaternion = new THREE.Quaternion();
    const upZ = new THREE.Vector3(0, 0, 1);
    const scaleVec = new THREE.Vector3();
    const defaultColor = new THREE.Color(
      isNeon &&
        (colorSides === "black" ||
          colorSides === "#888888" ||
          colorSides === "#ffffff")
        ? "#ffffff"
        : colorSides,
    );
    const highlightColor = new THREE.Color("#38bdf8");
    const dimColor = new THREE.Color(darkMode ? "#1e293b" : "#e2e8f0");

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const startNode = nodesMap.get(edge.start);
      const endNode = nodesMap.get(edge.end);
      if (!startNode || !endNode) {
        _edgeMidpoints.push(new THREE.Vector3());
        _edgeMathFormulas.push("");
        continue;
      }

      const startTypeKey = (startNode.typeMath ?? "").toLowerCase();
      const endTypeKey = (endNode.typeMath ?? "").toLowerCase();
      const isStartFiltered =
        startTypeKey in filters ? !(filters[startTypeKey] ?? false) : false;
      const isEndFiltered =
        endTypeKey in filters ? !(filters[endTypeKey] ?? false) : false;

      if (isStartFiltered || isEndFiltered) {
        _edgeMidpoints.push(new THREE.Vector3());
        _edgeMathFormulas.push("");
        continue;
      }

      const s = getNodePos(startNode, currentView);
      const e = getNodePos(endNode, currentView);

      const startScale =
        selectedNodeId === edge.start
          ? 1.5
          : hoveredNodeId === edge.start
            ? 1.2
            : 1.0;
      const endScale =
        selectedNodeId === edge.end
          ? 1.5
          : hoveredNodeId === edge.end
            ? 1.2
            : 1.0;

      const dir = e.clone().sub(s).normalize();
      const dist = s.distanceTo(e);

      const startRadius = 0.3 * startScale;
      const endRadius = 0.3 * endScale;

      const sOff = s.clone().add(dir.clone().multiplyScalar(startRadius));
      const eOff = e.clone().add(dir.clone().multiplyScalar(-endRadius - 0.15));
      const length = sOff.distanceTo(eOff);

      if (dist < 0.6) {
        _edgeMidpoints.push(new THREE.Vector3());
        _edgeMathFormulas.push("");
        // Hide by scaling to 0
        dummyMatrix.makeScale(0, 0, 0);
        dummyMatrix.toArray(_lineMatrices, lineIdx * 16);
        dummyMatrix.toArray(_arrowMatrices, arrowIdx * 16);
        lineIdx++;
        arrowIdx++;
        if (edge.type === "equivalence" || edge.type === "reciproque") {
          dummyMatrix.toArray(_arrowMatrices, arrowIdx * 16);
          arrowIdx++;
        }
        continue;
      }

      const mid = new THREE.Vector3().lerpVectors(sOff, eOff, 0.5);
      _edgeMidpoints.push(mid);

      let mathFormula = `$A \\text{ ${edge.type} } B$`;
      if (edge.type === "implication") mathFormula = "$A \\implies B$";
      else if (edge.type === "reciproque") mathFormula = "$B \\implies A$";
      else if (edge.type === "equivalence") mathFormula = "$A \\iff B$";
      else if (edge.type === "utilise") mathFormula = "$A \\supset B$";
      _edgeMathFormulas.push(mathFormula);

      const isHovered = hoveredEdgeIndex === i;
      const isConnectedToHovered =
        hoveredNodeId !== null &&
        (hoveredNodeId === edge.start || hoveredNodeId === edge.end);
      const isConnectedToSelected =
        selectedNodeId !== null &&
        (selectedNodeId === edge.start || selectedNodeId === edge.end);

      const widthMultiplier =
        isHovered || isConnectedToHovered || isConnectedToSelected ? 2.5 : 1.0;

      dummyQuaternion.setFromUnitVectors(upZ, dir);

      scaleVec.set(widthMultiplier, widthMultiplier, length);
      dummyMatrix.compose(sOff, dummyQuaternion, scaleVec);
      dummyMatrix.toArray(_lineMatrices, lineIdx * 16);

      scaleVec.set(widthMultiplier, widthMultiplier, widthMultiplier);
      dummyMatrix.compose(eOff, dummyQuaternion, scaleVec);
      dummyMatrix.toArray(_arrowMatrices, arrowIdx * 16);
      arrowIdx++;

      if (edge.type === "equivalence" || edge.type === "reciproque") {
        const reverseQuaternion = new THREE.Quaternion().setFromUnitVectors(
          upZ,
          dir.clone().negate(),
        );
        dummyMatrix.compose(sOff, reverseQuaternion, scaleVec);
        dummyMatrix.toArray(_arrowMatrices, arrowIdx * 16);
        arrowIdx++;
      }

      let c = defaultColor;
      if (isHovered || isConnectedToHovered || isConnectedToSelected) {
        c = highlightColor;
      } else if (hoveredNodeId !== null) {
        c = dimColor;
      }

      c.toArray(_colors, lineIdx * 3);
      lineIdx++;
    }

    return {
      lineCount: lCount,
      arrowCount: aCount,
      lineMatrices: _lineMatrices,
      arrowMatrices: _arrowMatrices,
      colors: _colors,
      edgeMidpoints: _edgeMidpoints,
      edgeMathFormulas: _edgeMathFormulas,
    };
  }, [
    edges,
    nodesMap,
    currentView,
    filters,
    colorSides,
    isNeon,
    hoveredNodeId,
    selectedNodeId,
    hoveredEdgeIndex,
    darkMode,
  ]);

  useFrame(() => {
    if (lineMeshRef.current && lineCount > 0) {
      lineMeshRef.current.instanceMatrix.needsUpdate = true;
      if (lineMeshRef.current.instanceColor)
        lineMeshRef.current.instanceColor.needsUpdate = true;
    }
    if (arrowMeshRef.current && arrowCount > 0) {
      arrowMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  if (lineCount === 0) return null;

  return (
    <group>
      <instancedMesh
        ref={lineMeshRef}
        args={[cylinderGeometry, undefined, lineCount]}
        onPointerMove={(e) => {
          e.stopPropagation();
          setHoveredEdgeIndex(e.instanceId ?? null);
        }}
        onPointerOut={() => {
          setHoveredEdgeIndex(null);
        }}
      >
        <instancedBufferAttribute
          attach="instanceMatrix"
          args={[lineMatrices, 16]}
        />
        <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
        <meshStandardMaterial
          transparent
          opacity={isFocus && selectedNodeId ? 0.3 : 0.8}
          toneMapped={!isNeon}
          depthWrite={false}
        />
      </instancedMesh>

      <instancedMesh
        ref={arrowMeshRef}
        args={[arrowGeometry, undefined, arrowCount]}
      >
        <instancedBufferAttribute
          attach="instanceMatrix"
          args={[arrowMatrices, 16]}
        />
        <meshStandardMaterial
          color={
            isNeon &&
            (colorSides === "black" ||
              colorSides === "#888888" ||
              colorSides === "#ffffff")
              ? "#ffffff"
              : colorSides
          }
          emissive={
            isNeon
              ? colorSides === "black" ||
                colorSides === "#888888" ||
                colorSides === "#ffffff"
                ? "#ffffff"
                : colorSides
              : "black"
          }
          emissiveIntensity={isNeon ? 2 : 0}
          transparent
          opacity={isFocus && selectedNodeId ? 0.3 : 0.8}
          depthWrite={false}
        />
      </instancedMesh>

      {hoveredEdgeIndex !== null &&
        edgeMidpoints[hoveredEdgeIndex] &&
        edgeMathFormulas[hoveredEdgeIndex] && (
          <Html
            position={edgeMidpoints[hoveredEdgeIndex].toArray()}
            center
            style={{ pointerEvents: "none", zIndex: 100 }}
          >
            <div
              style={{
                background: darkMode
                  ? "rgba(15, 23, 42, 0.9)"
                  : "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                color: darkMode ? "#E2E8F0" : "#0F172A",
                border: darkMode
                  ? "1px solid rgba(255, 255, 255, 0.15)"
                  : "1px solid rgba(15, 23, 42, 0.12)",
                padding: "4px 10px",
                borderRadius: "8px",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
                whiteSpace: "nowrap",
                fontFamily: "Inter, Roboto, sans-serif",
              }}
            >
              <MathMarkdown content={edgeMathFormulas[hoveredEdgeIndex]} />
            </div>
          </Html>
        )}
    </group>
  );
}
