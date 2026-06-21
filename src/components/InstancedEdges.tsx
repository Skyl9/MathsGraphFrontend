import { useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
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
  const theme = useTheme();
  const lineMeshRef = useRef<THREE.InstancedMesh>(null);
  const arrowMeshRef = useRef<THREE.InstancedMesh>(null);

  const graphTheme = useUIStore((s) => s.graphTheme);
  const darkMode = useUIStore((s) => s.darkMode);
  const isNeon = graphTheme === "neon";
  const isFocus = graphTheme === "focus";

  // Transient refs to avoid re-renders
  const hoveredEdgeIndexRef = useRef<number | null>(null);
  const [hoveredPopup, setHoveredPopup] = useState<{
    position: THREE.Vector3;
    formula: string;
  } | null>(null);

  // Compute base structure data once when graph changes
  const baseData = useMemo(() => {
    type ValidEdgeData =
      | null
      | {
          hidden: true;
          lineIdx: number;
          arrowIdxStart: number;
          numArrows: number;
        }
      | {
          hidden: false;
          edge: EdgeData;
          startNode: NodeData;
          endNode: NodeData;
          s: THREE.Vector3;
          e: THREE.Vector3;
          dir: THREE.Vector3;
          dist: number;
          mathFormula: string;
          lineIdx: number;
          arrowIdxStart: number;
          numArrows: number;
        };
    const validEdges: ValidEdgeData[] = [];
    let lCount = 0;
    let aCount = 0;

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const startNode = nodesMap.get(edge.start);
      const endNode = nodesMap.get(edge.end);

      if (!startNode || !endNode) {
        validEdges.push(null);
        continue;
      }

      const startTypeKey = (startNode.typeMath ?? "").toLowerCase();
      const endTypeKey = (endNode.typeMath ?? "").toLowerCase();
      const isStartFiltered =
        startTypeKey in filters ? !(filters[startTypeKey] ?? false) : false;
      const isEndFiltered =
        endTypeKey in filters ? !(filters[endTypeKey] ?? false) : false;

      if (isStartFiltered || isEndFiltered) {
        validEdges.push(null);
        continue;
      }

      const s = getNodePos(startNode, currentView);
      const e = getNodePos(endNode, currentView);
      const dist = s.distanceTo(e);

      if (dist < 0.6) {
        validEdges.push({
          hidden: true,
          lineIdx: lCount,
          arrowIdxStart: aCount,
          numArrows:
            edge.type === "equivalence" || edge.type === "reciproque" ? 2 : 1,
        });
        lCount++;
        aCount++;
        if (edge.type === "equivalence" || edge.type === "reciproque") aCount++;
        continue;
      }

      const dir = e.clone().sub(s).normalize();

      let mathFormula = `$A \\text{ ${edge.type} } B$`;
      if (edge.type === "implication") mathFormula = "$A \\implies B$";
      else if (edge.type === "reciproque") mathFormula = "$B \\implies A$";
      else if (edge.type === "equivalence") mathFormula = "$A \\iff B$";
      else if (edge.type === "utilise") mathFormula = "$A \\supset B$";

      validEdges.push({
        hidden: false,
        edge,
        startNode,
        endNode,
        s,
        e,
        dir,
        dist,
        mathFormula,
        lineIdx: lCount,
        arrowIdxStart: aCount,
        numArrows:
          edge.type === "equivalence" || edge.type === "reciproque" ? 2 : 1,
      });

      lCount++;
      aCount++;
      if (edge.type === "equivalence" || edge.type === "reciproque") aCount++;
    }

    return { validEdges, lCount, aCount };
  }, [edges, nodesMap, currentView, filters]);

  const { validEdges, lCount: lineCount, aCount: arrowCount } = baseData;

  // Initialize buffers
  const { lineMatrices, arrowMatrices, colors } = useMemo(() => {
    return {
      lineMatrices: new Float32Array(lineCount * 16),
      arrowMatrices: new Float32Array(arrowCount * 16),
      colors: new Float32Array(lineCount * 3),
    };
  }, [lineCount, arrowCount]);

  // 🌟 Pré-calcul du Layout de base (Matrices et Couleurs statiques) O(N) calculé 1 seule fois
  const {
    baseLineMatrices,
    baseArrowMatrices,
    defaultColorsArray,
    dimColorsArray,
  } = useMemo(() => {
    const bLines = new Float32Array(lineCount * 16);
    const bArrows = new Float32Array(arrowCount * 16);
    const dColors = new Float32Array(lineCount * 3);
    const dimColorsArr = new Float32Array(lineCount * 3);

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
    const dimColor = new THREE.Color(darkMode ? "#1e293b" : "#e2e8f0");

    for (let i = 0; i < validEdges.length; i++) {
      const data = validEdges[i];
      if (!data) continue;

      if (data.hidden) {
        dummyMatrix.makeScale(0, 0, 0);
        dummyMatrix.toArray(bLines, data.lineIdx * 16);
        dummyMatrix.toArray(bArrows, data.arrowIdxStart * 16);
        if (data.numArrows === 2) {
          dummyMatrix.toArray(bArrows, (data.arrowIdxStart + 1) * 16);
        }
        continue;
      }

      const { s, e, dir } = data;
      const startRadius = 0.3; // Scale 1.0
      const endRadius = 0.3; // Scale 1.0

      const sOff = s.clone().add(dir.clone().multiplyScalar(startRadius));
      const eOff = e.clone().add(dir.clone().multiplyScalar(-endRadius - 0.15));
      const length = sOff.distanceTo(eOff);

      dummyQuaternion.setFromUnitVectors(upZ, dir);

      scaleVec.set(1.0, 1.0, length);
      dummyMatrix.compose(sOff, dummyQuaternion, scaleVec);
      dummyMatrix.toArray(bLines, data.lineIdx * 16);

      scaleVec.set(1.0, 1.0, 1.0);
      dummyMatrix.compose(eOff, dummyQuaternion, scaleVec);
      dummyMatrix.toArray(bArrows, data.arrowIdxStart * 16);

      if (data.numArrows === 2) {
        const reverseQuaternion = new THREE.Quaternion().setFromUnitVectors(
          upZ,
          dir.clone().negate(),
        );
        dummyMatrix.compose(sOff, reverseQuaternion, scaleVec);
        dummyMatrix.toArray(bArrows, (data.arrowIdxStart + 1) * 16);
      }

      defaultColor.toArray(dColors, data.lineIdx * 3);
      dimColor.toArray(dimColorsArr, data.lineIdx * 3);
    }

    return {
      baseLineMatrices: bLines,
      baseArrowMatrices: bArrows,
      defaultColorsArray: dColors,
      dimColorsArray: dimColorsArr,
    };
  }, [validEdges, isNeon, colorSides, darkMode, lineCount, arrowCount]);

  const edgeMidpointsRef = useRef<THREE.Vector3[]>(
    new Array(edges.length).fill(null),
  );
  const edgeMathFormulasRef = useRef<string[]>(
    new Array(edges.length).fill(""),
  );

  // Update function that can be called imperatively
  const updateInstances = useCallback(() => {
    if (!lineMeshRef.current || !arrowMeshRef.current) return;

    const state = useGraphStore.getState();
    const hoveredNodeId = state.hoveredNodeId;
    const selectedNodeId = state.selectedNodeId;
    const hoveredEdgeIndex = hoveredEdgeIndexRef.current;

    // 🌟 1. Restauration ultra-rapide O(1) via copie mémoire
    lineMatrices.set(baseLineMatrices);
    arrowMatrices.set(baseArrowMatrices);

    if (hoveredNodeId !== null) {
      colors.set(dimColorsArray);
    } else {
      colors.set(defaultColorsArray);
    }

    const dummyMatrix = new THREE.Matrix4();
    const dummyQuaternion = new THREE.Quaternion();
    const upZ = new THREE.Vector3(0, 0, 1);
    const scaleVec = new THREE.Vector3();
    const highlightColor = new THREE.Color("#38bdf8");

    // 🌟 2. Surcharge des matrices/couleurs UNIQUEMENT pour les arêtes impactées
    for (let i = 0; i < validEdges.length; i++) {
      const data = validEdges[i];
      if (!data || data.hidden) continue;

      const { edge, s, e, dir } = data;

      const isHovered = hoveredEdgeIndex === i;
      const isConnectedToHovered =
        hoveredNodeId !== null &&
        (hoveredNodeId === edge.start || hoveredNodeId === edge.end);
      const isConnectedToSelected =
        selectedNodeId !== null &&
        (selectedNodeId === edge.start || selectedNodeId === edge.end);

      // Pré-enregistrement pour les popups (toujours exécuté pour être dispo au hover de la souris)
      const startRadiusForMid = 0.3;
      const endRadiusForMid = 0.3;
      const sOffMid = s
        .clone()
        .add(dir.clone().multiplyScalar(startRadiusForMid));
      const eOffMid = e
        .clone()
        .add(dir.clone().multiplyScalar(-endRadiusForMid - 0.15));
      edgeMidpointsRef.current[i] = new THREE.Vector3().lerpVectors(
        sOffMid,
        eOffMid,
        0.5,
      );
      edgeMathFormulasRef.current[i] = data.mathFormula;

      if (!isHovered && !isConnectedToHovered && !isConnectedToSelected) {
        continue; // Gain de performance majeur : on skip la géométrie 3D !
      }

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

      const startRadius = 0.3 * startScale;
      const endRadius = 0.3 * endScale;

      const sOff = s.clone().add(dir.clone().multiplyScalar(startRadius));
      const eOff = e.clone().add(dir.clone().multiplyScalar(-endRadius - 0.15));
      const length = sOff.distanceTo(eOff);

      const widthMultiplier = 2.5;

      dummyQuaternion.setFromUnitVectors(upZ, dir);

      scaleVec.set(widthMultiplier, widthMultiplier, length);
      dummyMatrix.compose(sOff, dummyQuaternion, scaleVec);
      dummyMatrix.toArray(lineMatrices, data.lineIdx * 16);

      scaleVec.set(widthMultiplier, widthMultiplier, widthMultiplier);
      dummyMatrix.compose(eOff, dummyQuaternion, scaleVec);
      dummyMatrix.toArray(arrowMatrices, data.arrowIdxStart * 16);

      if (data.numArrows === 2) {
        const reverseQuaternion = new THREE.Quaternion().setFromUnitVectors(
          upZ,
          dir.clone().negate(),
        );
        dummyMatrix.compose(sOff, reverseQuaternion, scaleVec);
        dummyMatrix.toArray(arrowMatrices, (data.arrowIdxStart + 1) * 16);
      }

      highlightColor.toArray(colors, data.lineIdx * 3);
    }

    lineMeshRef.current.geometry.attributes.instanceMatrix.needsUpdate = true;
    if (lineMeshRef.current.geometry.attributes.instanceColor) {
      lineMeshRef.current.geometry.attributes.instanceColor.needsUpdate = true;
    }
    arrowMeshRef.current.geometry.attributes.instanceMatrix.needsUpdate = true;
  }, [
    arrowMatrices,
    colors,
    baseLineMatrices,
    baseArrowMatrices,
    defaultColorsArray,
    dimColorsArray,
  ]);

  // Run update initially and when base structures change
  useEffect(() => {
    updateInstances();
  }, [updateInstances]);

  // Subscribe to Zustand store for imperative updates
  useEffect(() => {
    const unsub = useGraphStore.subscribe((state, prevState) => {
      if (
        state.hoveredNodeId !== prevState.hoveredNodeId ||
        state.selectedNodeId !== prevState.selectedNodeId
      ) {
        updateInstances();
      }
    });
    return () => unsub();
  }, [updateInstances]);

  if (lineCount === 0) return null;

  return (
    <group>
      <instancedMesh
        ref={lineMeshRef}
        args={[cylinderGeometry, undefined, lineCount]}
        onPointerMove={(e) => {
          e.stopPropagation();
          const id = e.instanceId ?? null;
          if (hoveredEdgeIndexRef.current !== id) {
            hoveredEdgeIndexRef.current = id;
            updateInstances();
            if (
              id !== null &&
              edgeMidpointsRef.current[id] &&
              edgeMathFormulasRef.current[id]
            ) {
              setHoveredPopup({
                position: edgeMidpointsRef.current[id],
                formula: edgeMathFormulasRef.current[id],
              });
            } else {
              setHoveredPopup(null);
            }
          }
        }}
        onPointerOut={() => {
          if (hoveredEdgeIndexRef.current !== null) {
            hoveredEdgeIndexRef.current = null;
            setHoveredPopup(null);
            updateInstances();
          }
        }}
      >
        <instancedBufferAttribute
          attach="instanceMatrix"
          args={[lineMatrices, 16]}
        />
        <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
        <meshStandardMaterial
          transparent
          opacity={
            isFocus && useGraphStore.getState().selectedNodeId ? 0.3 : 0.8
          }
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
          opacity={
            isFocus && useGraphStore.getState().selectedNodeId ? 0.3 : 0.8
          }
          depthWrite={false}
        />
      </instancedMesh>

      {hoveredPopup !== null && (
        <Html
          position={hoveredPopup.position.toArray()}
          center
          style={{ pointerEvents: "none", zIndex: 100 }}
        >
          <div
            style={{
              background: darkMode
                ? alpha(theme.palette.background.paper, 0.9)
                : alpha(theme.palette.background.paper, 0.95),
              backdropFilter: "blur(8px)",
              color: darkMode ? "#E2E8F0" : "#0F172A",
              border: darkMode
                ? `1px solid ${alpha(theme.palette.divider, 0.15)}`
                : `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              padding: "4px 10px",
              borderRadius: "8px",
              boxShadow: `0 6px 20px ${alpha(theme.palette.common.black, 0.25)}`,
              whiteSpace: "nowrap",
              fontFamily: "Inter, Roboto, sans-serif",
            }}
          >
            <MathMarkdown content={hoveredPopup.formula} />
          </div>
        </Html>
      )}
    </group>
  );
}
