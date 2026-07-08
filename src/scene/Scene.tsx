/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback, useRef, useState, memo, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {
  Instances,
  Instance,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
import {
  Vector3,
  Color,
  Mesh,
  MathUtils,
  SphereGeometry,
  TorusGeometry,
} from "three";
import Edge, { EdgeDataRef } from "../components/Edge";
import InstancedEdges from "../components/InstancedEdges";
import { NodeData, Graph } from "../types/ApiTypes/graph";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useUIStore } from "../stores/useUIStore";
import { useFilterStore } from "../stores/useFilterStore";
import { useGraphStore } from "../stores/useGraphStore";
import CustomNode, { CustomNodeData } from "../components/Node";
import { useTranslation } from "react-i18next";

import { getNodeColor } from "../utils/nodeColors";
import { getNodeSize } from "../constants/graphTokens";
import EnvironmentLights from "./EnvironmentLights";
import CameraRig from "./CameraRig";
import ControlsManager from "./ControlsManager";
import { GlobalLabelsLOD } from "./GlobalLabelsLOD";
import { ClusterLabels } from "./ClusterLabels";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const hitboxGeometry = new SphereGeometry(0.3 * 0.7, 16, 16);
const ringGeometry = new TorusGeometry(0.55, 0.015, 8, 48);

// Interfaces supprimées pour graphNodesMap car géré centralement

// 🌟 Sécurité : Fallback de coordonnées si un layout n'est pas encore calculé par le backend
const getNodePos = (
  node: NodeData,
  view: string,
): { x: number; y: number; z: number } => {
  return (
    node.position[view] ||
    node.position["grille"] ||
    node.position["physique"] || { x: 0, y: 0, z: 0 }
  );
};

// 🌟 Composant extrait pour éviter le re-rendu de Scene au clic
interface GlobalSelectionRingProps {
  nodesMap: Map<number, NodeData>;
  colors: string[];
  currentView: string;
  getNodeScale: (id: number) => number;
}

const GlobalSelectionRing = ({
  nodesMap,
  colors,
  currentView,
  getNodeScale,
}: GlobalSelectionRingProps) => {
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  if (!selectedNodeId) return null;
  const node = nodesMap.get(selectedNodeId);
  if (!node) return null;
  const pos = getNodePos(node, currentView);
  return (
    <SelectionRing
      position={[pos.x, pos.y, pos.z]}
      color={getNodeColor(node?.typeMath ?? "", colors)}
      scale={getNodeScale(selectedNodeId) + 0.3}
    />
  );
};

const GlobalBloom = ({ graphTheme, renderMode }: any) => {
  const hasSelection = useGraphStore((s) => s.selectedNodeId !== null);
  if (graphTheme === "neon" && renderMode === "quality" && hasSelection) {
    return (
      <EffectComposer enableNormalPass={false}>
        <Bloom
          luminanceThreshold={0.2}
          mipmapBlur
          intensity={1.5}
          radius={0.8}
        />
      </EffectComposer>
    );
  }
  return null;
};

// 🌟 NOUVEAU : Anneau holographique de sélection
const SelectionRing = ({
  position,
  color,
  scale,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
}) => {
  const ringRef = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current) {
      // Rotation sur l'axe Y/Z
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.6;
      // Pulsation d'échelle douce
      const pulse = 1.0 + Math.sin(clock.getElapsedTime() * 4) * 0.06;
      const finalScale = scale * pulse;
      ringRef.current.scale.set(finalScale, finalScale, finalScale);
    }
  });
  return (
    <mesh
      ref={ringRef}
      position={position}
      rotation={[Math.PI / 2, 0, 0]}
      geometry={ringGeometry}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

interface SceneProps {
  graphData: Graph;
}

interface GraphNodeProps {
  node: NodeData;
  currentView: string;
  color: string;
  onClick: (id: number) => void;
  debug: boolean;
  scale: number;
  isFiltered: boolean;
  adjacencyList: Map<number, number[]>;
  graphTheme: string;
  onHoverStart?: (id: number) => void;
  onHoverEnd?: () => void;
}

const areGraphNodesEqual = (prev: GraphNodeProps, next: GraphNodeProps) => {
  return (
    prev.node.id === next.node.id &&
    prev.currentView === next.currentView &&
    prev.color === next.color &&
    prev.debug === next.debug &&
    prev.scale === next.scale &&
    prev.isFiltered === next.isFiltered &&
    prev.graphTheme === next.graphTheme &&
    prev.adjacencyList === next.adjacencyList
  );
};

// 🌟 NOUVEAU : Sous-composant qui lie 1 Instance (GPU) à 1 Texte (CPU) avec LOD
const GraphNode = memo(
  ({
    node,
    currentView,
    color,
    onClick,
    debug,
    scale,
    isFiltered,
    adjacencyList,
    graphTheme,
    onHoverStart,
    onHoverEnd,
  }: GraphNodeProps) => {
    const [hovered, setHovered] = useState(false);
    const posVec = useMemo(() => {
      const pos = getNodePos(node, currentView);
      return new Vector3(pos.x, pos.y, pos.z);
    }, [node, currentView]);

    const isSelected = useGraphStore((s) => s.selectedNodeId === node.id);
    const hasSelection = useGraphStore((s) => s.selectedNodeId !== null);
    const isNeighbor = useGraphStore(
      (s) =>
        s.selectedNodeId !== null &&
        (adjacencyList.get(s.selectedNodeId)?.includes(node.id) ?? false),
    );
    const shouldDim =
      graphTheme === "focus" && hasSelection && !isSelected && !isNeighbor;

    // Calcul de la couleur finale :
    // Si on est en mode "Focus" et que ce nœud n'est pas lié, on l'assombrit drastiquement.
    const finalColor = useMemo(() => {
      const activeColor = hovered ? "#99C2FF" : color;
      const c = new Color(activeColor);
      if (isSelected) return new Color("#ffffff"); // Blanc pur si sélectionné
      if (shouldDim) return c.multiplyScalar(0.15); // Très sombre si hors focus
      return c;
    }, [hovered, color, isSelected, shouldDim]);

    const targetScale = isFiltered ? 0.0 : scale;
    const groupRef = useRef<import("three").Group>(null);

    useEffect(() => {
      if (groupRef.current) {
        import("gsap").then((gsap) => {
          if (!groupRef.current) return;
          gsap.default.to(groupRef.current.position, {
            x: posVec.x,
            y: posVec.y,
            z: posVec.z,
            duration: 0.8,
            ease: "power2.out",
          });
        });
      }
    }, [posVec]);

    return (
      <group ref={groupRef} position={[posVec.x, posVec.y, posVec.z]}>
        {/* L'instance virtuelle de la sphère (1 draw call global) */}
        <Instance
          color={finalColor}
          scale={[targetScale, targetScale, targetScale]}
          onClick={(e) => {
            if (isFiltered) return;
            e.stopPropagation();
            onClick(node.id);
          }}
          onPointerOver={(e) => {
            if (isFiltered) return;
            e.stopPropagation();
            setHovered(true);
            if (onHoverStart) onHoverStart(node.id);
          }}
          onPointerOut={(e) => {
            if (isFiltered) return;
            e.stopPropagation();
            setHovered(false);
            if (onHoverEnd) onHoverEnd();
          }}
        />

        {/* Hitbox debug optionnelle */}
        {debug && (
          <mesh
            scale={[targetScale, targetScale, targetScale]}
            geometry={hitboxGeometry}
          >
            <meshBasicMaterial color="red" wireframe />
          </mesh>
        )}
      </group>
    );
  },
  areGraphNodesEqual,
);

export default function Scene({ graphData }: SceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const currentView = useUIStore((s) => s.currentView);
  const colorLemme = useUIStore((s) => s.colorLemme);
  const colorAxiome = useUIStore((s) => s.colorAxiome);
  const colorTheoreme = useUIStore((s) => s.colorTheoreme);
  const colorReciproque = useUIStore((s) => s.colorReciproque);
  const colorDefinition = useUIStore((s) => s.colorDefinition);
  const colorCorollaire = useUIStore((s) => s.colorCorollaire);
  const colorProposition = useUIStore((s) => s.colorProposition);
  const colorPropriete = useUIStore((s) => s.colorPropriete);
  const colorSides = useUIStore((s) => s.colorSides);
  const debugMode = useUIStore((s) => s.debugMode);
  const renderMode = useUIStore((s) => s.renderMode);
  const graphTheme = useUIStore((s) => s.graphTheme);
  const useInstancedEdges = useUIStore((s) => s.useInstancedEdges);
  const darkMode = useUIStore((s) => s.darkMode);
  const filters = useFilterStore((s) => s.filters);
  const { t } = useTranslation();

  const timelineYear = useUIStore((s) => s.timelineYear);

  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);

  const setHoveredNodeId = useGraphStore((s) => s.setHoveredNodeId);

  const handleNodeClick = useCallback(
    (id: number) => {
      setSelectedNodeId(id);
    },
    [setSelectedNodeId],
  );

  const handleNodeHoverEnd = useCallback(() => {
    setHoveredNodeId(null);
  }, [setHoveredNodeId]);

  const customNodesMap = useRef(new Map<number, CustomNodeData>());
  const edgesMap = useRef(new Map<string, EdgeDataRef>());

  const registerCustomNode = useCallback((id: number, data: CustomNodeData) => {
    customNodesMap.current.set(id, data);
  }, []);
  const unregisterCustomNode = useCallback((id: number) => {
    customNodesMap.current.delete(id);
  }, []);

  const registerEdge = useCallback((id: string, data: EdgeDataRef) => {
    edgesMap.current.set(id, data);
  }, []);
  const unregisterEdge = useCallback((id: string) => {
    edgesMap.current.delete(id);
  }, []);

  const { gl } = useThree();

  useFrame((state) => {
    // Handle CustomNodes (Quality) - Only scaling logic remains
    customNodesMap.current.forEach((data) => {
      // Lerp
      data.currentScaleObj.value = MathUtils.lerp(
        data.currentScaleObj.value,
        data.targetScale,
        0.15,
      );
      data.mesh.scale.set(
        data.currentScaleObj.value,
        data.currentScaleObj.value,
        data.currentScaleObj.value,
      );
    });

    // Handle Edges
    const time = state.clock.getElapsedTime();
    edgesMap.current.forEach((data) => {
      if (
        data.isAnimatedDash &&
        data.lineRef.current &&
        data.lineRef.current.material
      ) {
        const baseSpeed = data.type === "equivalence" ? 1.0 : 2.0;
        const multiplier = data.getMultiplier();
        data.lineRef.current.material.dashOffset =
          -time * baseSpeed * multiplier;
      }
    });
  });
  const nodes = useMemo(() => graphData?.nodes ?? [], [graphData]);
  const nodesMap = useMemo(() => {
    const map = new Map<number, NodeData>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);
  const edges = useMemo(() => graphData?.edges ?? [], [graphData]);

  const colors = useMemo(
    () => [
      colorLemme,
      colorAxiome,
      colorTheoreme,
      colorReciproque,
      colorDefinition,
      colorCorollaire,
      colorProposition,
      colorPropriete,
    ],
    [
      colorLemme,
      colorAxiome,
      colorTheoreme,
      colorReciproque,
      colorDefinition,
      colorCorollaire,
      colorProposition,
      colorPropriete,
    ],
  );

  // 🌟 Pré-calcul de la liste d'adjacence pour O(1) lookups
  const adjacencyList = useMemo(() => {
    const list = new Map<number, number[]>();
    edges.forEach((e) => {
      if (!list.has(e.start)) list.set(e.start, []);
      if (!list.has(e.end)) list.set(e.end, []);
      list.get(e.start)!.push(e.end);
      list.get(e.end)!.push(e.start);
    });
    return list;
  }, [edges]);

  // Calcul des degrés de chaque nœud pour la taille dynamique
  const nodeDegrees = useMemo(() => {
    const degrees: Record<number, number> = {};
    edges.forEach((edge) => {
      degrees[edge.start] = (degrees[edge.start] || 0) + 1;
      degrees[edge.end] = (degrees[edge.end] || 0) + 1;
    });
    return degrees;
  }, [edges]);

  const getNodeScale = useCallback(
    (nodeId: number) => {
      const deg = nodeDegrees[nodeId] || 0;
      return getNodeSize(deg);
    },
    [nodeDegrees],
  );

  const handleCanvasClick = useCallback(
    (event: MouseEvent) => {
      if (event.target === gl.domElement) setSelectedNodeId(null);
    },
    [gl, setSelectedNodeId],
  );

  if (!graphData) return <group>{t("scene.no_data")}</group>;

  return (
    <>
      <EnvironmentLights />
      <CameraRig
        nodesMap={nodesMap}
        adjacencyList={adjacencyList}
        controlsRef={controlsRef}
      />
      <ControlsManager nodes={nodes} controlsRef={controlsRef} />

      <group onPointerMissed={handleCanvasClick}>
        {renderMode === "performance" ? (
          /* ==========================================
                       MODE PERFORMANCE (InstancedMesh)
                    ========================================== */
          <Instances limit={10000}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              transparent={true}
              emissive={graphTheme === "neon" ? "white" : "black"}
              emissiveIntensity={graphTheme === "neon" ? 0.8 : 0}
            />
            {nodes.map((node) => {
              const typeKey = (node.typeMath ?? "").toLowerCase();
              let isFiltered =
                typeKey in filters
                  ? !(filters[typeKey as keyof typeof filters] ?? false)
                  : false;

              if (timelineYear !== null) {
                if (node.annee == null || node.annee > timelineYear) {
                  isFiltered = true;
                }
              }

              return (
                <GraphNode
                  key={`inst-${node.id}`}
                  node={node}
                  currentView={currentView}
                  color={getNodeColor(node.typeMath, colors)}
                  debug={debugMode}
                  scale={getNodeScale(node.id)}
                  isFiltered={isFiltered}
                  adjacencyList={adjacencyList}
                  graphTheme={graphTheme}
                  onHoverStart={setHoveredNodeId}
                  onHoverEnd={handleNodeHoverEnd}
                  onClick={handleNodeClick}
                />
              );
            })}
          </Instances>
        ) : (
          /* ==========================================
                       MODE QUALITÉ (Noeuds individuels classiques)
                    ========================================== */
          nodes.map((node) => {
            const pos = getNodePos(node, currentView);
            const typeKey = (node.typeMath ?? "").toLowerCase();
            const isFiltered =
              typeKey in filters
                ? !(filters[typeKey as keyof typeof filters] ?? false)
                : false;
            return (
              <CustomNode
                key={`node-${node.id}`}
                position={[pos.x, pos.y, pos.z]}
                color={getNodeColor(node.typeMath, colors)}
                nom={node.nom}
                scale={getNodeScale(node.id)}
                isFiltered={isFiltered}
                adjacencyList={adjacencyList}
                onHoverStart={setHoveredNodeId}
                onHoverEnd={handleNodeHoverEnd}
                onClick={handleNodeClick}
                debug={debugMode}
                id={node.id}
                registerNode={registerCustomNode}
                unregisterNode={unregisterCustomNode}
              />
            );
          })
        )}

        {/* 🌟 Les Arêtes */}
        {useInstancedEdges ? (
          <InstancedEdges
            edges={edges}
            nodesMap={nodesMap}
            currentView={currentView}
            colorSides={colorSides}
            filters={filters}
          />
        ) : (
          edges.map((edge, index) => {
            const startNode = nodesMap.get(edge.start)!;
            const endNode = nodesMap.get(edge.end)!;
            if (!startNode || !endNode) return null;

            const startTypeKey = (startNode.typeMath ?? "").toLowerCase();
            const endTypeKey = (endNode.typeMath ?? "").toLowerCase();
            const isStartFiltered =
              startTypeKey in filters
                ? !(filters[startTypeKey as keyof typeof filters] ?? false)
                : false;
            const isEndFiltered =
              endTypeKey in filters
                ? !(filters[endTypeKey as keyof typeof filters] ?? false)
                : false;

            const startPos = getNodePos(startNode, currentView);
            const endPos = getNodePos(endNode, currentView);

            return (
              <group key={index}>
                <Edge
                  start={[startPos.x, startPos.y, startPos.z]}
                  end={[endPos.x, endPos.y, endPos.z]}
                  startId={edge.start}
                  endId={edge.end}
                  type={edge.type}
                  color={colorSides}
                  debug={debugMode}
                  startScale={getNodeScale(edge.start)}
                  endScale={getNodeScale(edge.end)}
                  isStartFiltered={isStartFiltered}
                  isEndFiltered={isEndFiltered}
                  registerEdge={registerEdge}
                  unregisterEdge={unregisterEdge}
                />
              </group>
            );
          })
        )}

        {/* 🌟 Anneau de sélection holographique et Bloom */}
        <GlobalSelectionRing
          nodesMap={nodesMap}
          colors={colors}
          currentView={currentView}
          getNodeScale={getNodeScale}
        />

        {/* 🌟 NOUVEAU: Textes LOD centralisés (Détruit le VDOM des nœuds lointains) */}
        <GlobalLabelsLOD
          nodes={nodes}
          colors={colors}
          currentView={currentView}
          adjacencyList={adjacencyList}
          getNodeScale={getNodeScale}
        />

        <ClusterLabels nodes={nodes} />
      </group>

      <GlobalBloom graphTheme={graphTheme} renderMode={renderMode} />

      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["#ff3b30", "#34c759", "#007aff"]}
          labelColor={darkMode ? "white" : "black"}
          hideNegativeAxes
        />
      </GizmoHelper>
    </>
  );
}
