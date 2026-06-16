import { useEffect, useMemo, useCallback, useRef, useState, memo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Billboard, Text, Instances, Instance } from "@react-three/drei";
import {
  Vector3,
  Color,
  Mesh,
  Group,
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
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const hitboxGeometry = new SphereGeometry(0.3 * 0.7, 16, 16);
const ringGeometry = new TorusGeometry(0.55, 0.015, 8, 48);

export interface GraphNodeData {
  billboard: Group;
  pos: Vector3;
  shouldShowBase: boolean;
  isFarShow: boolean;
  isFiltered: boolean;
}

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
  isSelected: boolean;
  onClick: (id: number) => void;
  debug: boolean;
  shouldDim: boolean;
  scale: number;
  isFiltered: boolean;
  onHoverStart?: (id: number) => void;
  onHoverEnd?: () => void;
}

const areGraphNodesEqual = (
  prev: GraphNodeProps & {
    registerGraphNode?: (id: number, data: GraphNodeData) => void;
    unregisterGraphNode?: (id: number) => void;
  },
  next: GraphNodeProps & {
    registerGraphNode?: (id: number, data: GraphNodeData) => void;
    unregisterGraphNode?: (id: number) => void;
  },
) => {
  return (
    prev.node.id === next.node.id &&
    prev.currentView === next.currentView &&
    prev.color === next.color &&
    prev.isSelected === next.isSelected &&
    prev.debug === next.debug &&
    prev.shouldDim === next.shouldDim &&
    prev.scale === next.scale &&
    prev.isFiltered === next.isFiltered
  );
};

// 🌟 NOUVEAU : Sous-composant qui lie 1 Instance (GPU) à 1 Texte (CPU) avec LOD
const GraphNode = memo(
  ({
    node,
    currentView,
    color,
    isSelected,
    onClick,
    debug,
    shouldDim,
    scale,
    isFiltered,
    onHoverStart,
    onHoverEnd,
    registerGraphNode,
    unregisterGraphNode,
  }: GraphNodeProps & {
    registerGraphNode?: (id: number, data: GraphNodeData) => void;
    unregisterGraphNode?: (id: number) => void;
  }) => {
    const [hovered, setHovered] = useState(false);
    const sphereSize = 0.3;
    const billboardRef = useRef<Group>(null);
    const posVec = useMemo(() => {
      const pos = getNodePos(node, currentView);
      return new Vector3(pos.x, pos.y, pos.z);
    }, [node, currentView]);

    // Calcul de la couleur finale :
    // Si on est en mode "Focus" et que ce nœud n'est pas lié, on l'assombrit drastiquement.
    const finalColor = useMemo(() => {
      const activeColor = hovered ? "#99C2FF" : color;
      const c = new Color(activeColor);
      if (isSelected) return new Color("#ffffff"); // Blanc pur si sélectionné
      if (shouldDim) return c.multiplyScalar(0.15); // Très sombre si hors focus
      return c;
    }, [hovered, color, isSelected, shouldDim]);

    const shouldShowBase = !shouldDim || hovered;
    const isFarShow = isSelected || hovered;

    useEffect(() => {
      if (billboardRef.current && registerGraphNode) {
        registerGraphNode(node.id, {
          billboard: billboardRef.current,
          pos: posVec,
          shouldShowBase,
          isFarShow,
          isFiltered,
        });
      }
      return () => {
        if (unregisterGraphNode) unregisterGraphNode(node.id);
      };
    }, [
      node.id,
      posVec,
      shouldShowBase,
      isFarShow,
      isFiltered,
      registerGraphNode,
      unregisterGraphNode,
    ]);

    const targetScale = isFiltered ? 0.0 : scale;

    return (
      <group position={[posVec.x, posVec.y, posVec.z]}>
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

        {/* On garde le Billboard pour le texte, affiché intelligemment via LOD */}
        <Billboard
          ref={billboardRef}
          position={[0, sphereSize * scale + 0.3, 0]}
        >
          <Text fontSize={0.3} color={color} anchorX="center" anchorY="middle">
            {node.nom}
          </Text>
        </Billboard>

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
  const filters = useFilterStore((s) => s.filters);
  const { t } = useTranslation();

  const targetPosition = useGraphStore((s) => s.targetPosition);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
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
  const graphNodesMap = useRef(new Map<number, GraphNodeData>());
  const edgesMap = useRef(new Map<string, EdgeDataRef>());

  const registerCustomNode = useCallback((id: number, data: CustomNodeData) => {
    customNodesMap.current.set(id, data);
  }, []);
  const unregisterCustomNode = useCallback((id: number) => {
    customNodesMap.current.delete(id);
  }, []);

  const registerGraphNode = useCallback((id: number, data: GraphNodeData) => {
    graphNodesMap.current.set(id, data);
  }, []);
  const unregisterGraphNode = useCallback((id: number) => {
    graphNodesMap.current.delete(id);
  }, []);

  const registerEdge = useCallback((id: string, data: EdgeDataRef) => {
    edgesMap.current.set(id, data);
  }, []);
  const unregisterEdge = useCallback((id: string) => {
    edgesMap.current.delete(id);
  }, []);

  const { camera, gl } = useThree();

  useFrame((state) => {
    // Handle GraphNodes (Performance)
    graphNodesMap.current.forEach((data) => {
      const dist = camera.position.distanceTo(data.pos);
      const isFar = dist > 35;
      data.billboard.visible =
        !data.isFiltered && data.shouldShowBase && (data.isFarShow || !isFar);
    });

    // Handle CustomNodes (Quality)
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

      // Billboard orientation
      const dist = camera.position.distanceTo(data.pos);
      const isFar = dist > 35;
      const isScaleTiny = data.currentScaleObj.value < 0.1;

      data.billboard.visible =
        !isScaleTiny && data.shouldShowBase && (data.isFarShow || !isFar);
      data.billboard.quaternion.copy(camera.quaternion);
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
  const selectedNode = useMemo(
    () =>
      (selectedNodeId !== null ? nodesMap.get(selectedNodeId) : null) || null,
    [nodesMap, selectedNodeId],
  );

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

  const neighborIds = useMemo(() => {
    if (selectedNodeId === null) return new Set<number>();
    const neighbors = new Set<number>();
    edges.forEach((edge) => {
      if (edge.start === selectedNodeId) neighbors.add(edge.end);
      if (edge.end === selectedNodeId) neighbors.add(edge.start);
    });
    return neighbors;
  }, [selectedNodeId, edges]);

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
      <CameraRig nodesMap={nodesMap} edges={edges} controlsRef={controlsRef} />
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
              const isSelected = selectedNodeId === node.id;
              const isNeighbor = neighborIds.has(node.id);
              const isFocus = graphTheme === "focus";
              const shouldDim =
                isFocus &&
                selectedNodeId !== null &&
                !isSelected &&
                !isNeighbor;
              const typeKey = (node.typeMath ?? "").toLowerCase();
              const isFiltered =
                typeKey in filters
                  ? !(filters[typeKey as keyof typeof filters] ?? false)
                  : false;

              return (
                <GraphNode
                  key={`inst-${node.id}`}
                  node={node}
                  currentView={currentView}
                  color={getNodeColor(node.typeMath, colors)}
                  isSelected={isSelected}
                  shouldDim={shouldDim}
                  debug={debugMode}
                  scale={getNodeScale(node.id)}
                  isFiltered={isFiltered}
                  onHoverStart={setHoveredNodeId}
                  onHoverEnd={handleNodeHoverEnd}
                  onClick={handleNodeClick}
                  registerGraphNode={registerGraphNode}
                  unregisterGraphNode={unregisterGraphNode}
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
                isSelected={selectedNodeId === node.id}
                isNeighbor={neighborIds.has(node.id)}
                scale={getNodeScale(node.id)}
                isFiltered={isFiltered}
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

            const isFocus = graphTheme === "focus";
            const isLineConnectedToSelected =
              edge.start === selectedNodeId || edge.end === selectedNodeId;
            const lineOpacity =
              isFocus && selectedNodeId !== null && !isLineConnectedToSelected
                ? 0.1
                : 1;

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
                  opacity={lineOpacity}
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

        {/* 🌟 Anneau de sélection holographique */}
        {selectedNodeId && renderMode === "quality" && (
          <SelectionRing
            position={[
              targetPosition?.x ?? 0,
              targetPosition?.y ?? 0,
              targetPosition?.z ?? 0,
            ]}
            color={getNodeColor(selectedNode?.typeMath ?? "", colors)}
            scale={getNodeScale(selectedNodeId) + 0.3}
          />
        )}
      </group>

      {graphTheme === "neon" &&
        renderMode === "quality" &&
        selectedNodeId !== null && (
          <EffectComposer enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.2}
              mipmapBlur
              intensity={1.5}
              radius={0.8}
            />
          </EffectComposer>
        )}
    </>
  );
}
