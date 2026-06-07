import { useEffect, useMemo, useCallback, useRef, useState, memo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Billboard,
  Text,
  Instances,
  Instance,
  Stars,
  Grid,
} from "@react-three/drei";
import { Vector3, Color, Mesh, Group, MathUtils } from "three";
import Edge from "../components/Edge";
import gsap from "gsap";
import { NodeData, Graph } from "../types/ApiTypes/graph";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useUIStore } from "../stores/useUIStore";
import { useFilterStore } from "../stores/useFilterStore";
import { useGraphStore } from "../stores/useGraphStore";
import CustomNode, { CustomNodeData } from "../components/Node";
import { useTranslation } from "react-i18next";

import { getNodeColor } from "../utils/nodeColors";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

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
    <mesh ref={ringRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.55, 0.015, 8, 48]} />
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
          <mesh scale={[targetScale, targetScale, targetScale]}>
            <sphereGeometry args={[sphereSize * 0.7, 16, 16]} />
            <meshBasicMaterial color="red" wireframe />
          </mesh>
        )}
      </group>
    );
  },
);

export default function Scene({ graphData }: SceneProps) {
  const currentView = useUIStore((s) => s.currentView);
  const colorLemme = useUIStore((s) => s.colorLemme);
  const colorAxiome = useUIStore((s) => s.colorAxiome);
  const colorTheoreme = useUIStore((s) => s.colorTheoreme);
  const colorSides = useUIStore((s) => s.colorSides);
  const debugMode = useUIStore((s) => s.debugMode);
  const renderMode = useUIStore((s) => s.renderMode);
  const zoomAction = useUIStore((s) => s.zoomAction);
  const setDebugMode = useUIStore((s) => s.setDebugMode);
  const graphTheme = useUIStore((s) => s.graphTheme);
  const filters = useFilterStore((s) => s.filters);
  const { t } = useTranslation();

  const targetPosition = useGraphStore((s) => s.targetPosition);
  const setTargetPosition = useGraphStore((s) => s.setTargetPosition);
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
  }, []);

  const customNodesMap = useRef(new Map<number, CustomNodeData>());
  const graphNodesMap = useRef(new Map<number, GraphNodeData>());

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

  const { camera, gl } = useThree();

  useFrame(() => {
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

      const dist = camera.position.distanceTo(data.pos);
      const isFar = dist > 35;
      const isScaleTiny = data.currentScaleObj.value < 0.1;

      data.billboard.visible =
        !isScaleTiny && data.shouldShowBase && (data.isFarShow || !isFar);
    });
  });
  const nodes = useMemo(() => graphData?.nodes ?? [], [graphData]);
  const nodesMap = useMemo(() => {
    const map = new Map<number, NodeData>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);
  const edges = useMemo(() => graphData?.edges ?? [], [graphData]);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const darkMode = useUIStore((s) => s.darkMode);

  const colors = useMemo(
    () => [colorLemme, colorAxiome, colorTheoreme],
    [colorLemme, colorAxiome, colorTheoreme],
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
      return 1.0 + Math.min(deg * 0.15, 1.2); // Échelle allant de 1.0 à 2.2 maximum
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

  // Animations GSAP : Cadrage intelligent
  useEffect(() => {
    if (selectedNode && targetPosition && controlsRef.current) {
      const { x, y, z } = getNodePos(selectedNode, currentView);
      let maxDistance = 3;

      // Trouver la distance maximale avec les voisins pour ajuster le zoom
      edges.forEach((edge) => {
        let neighbor: NodeData | undefined;
        if (edge.start === selectedNode.id) {
          neighbor = nodesMap.get(edge.end);
        } else if (edge.end === selectedNode.id) {
          neighbor = nodesMap.get(edge.start);
        }
        if (neighbor) {
          const pos = getNodePos(neighbor, currentView);
          const d = new Vector3(pos.x, pos.y, pos.z).distanceTo(
            new Vector3(x, y, z),
          );
          if (d > maxDistance) maxDistance = d;
        }
      });
      const cameraOffset = Math.max(5, maxDistance * 1.5);

      gsap.to(controlsRef.current.target, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 1.2,
        ease: "power3.inOut",
        onUpdate: () => controlsRef.current?.update(),
      });
      gsap.to(camera.position, {
        x: targetPosition.x + cameraOffset * 0.4,
        y: targetPosition.y + cameraOffset * 0.3,
        z: targetPosition.z + cameraOffset,
        duration: 1.2,
        ease: "power3.inOut",
      });
    }
  }, [
    selectedNode,
    targetPosition,
    camera,
    currentView,
    edges,
    nodes,
    nodesMap,
  ]);

  // Écouteurs d'événements pour le HUD de navigation (Zoom / Reset) via Zustand
  useEffect(() => {
    if (!zoomAction.action) return;

    if (zoomAction.action === "in") {
      if (controlsRef.current) {
        const target = controlsRef.current.target;
        gsap.to(camera.position, {
          x: target.x + (camera.position.x - target.x) * 0.7,
          y: target.y + (camera.position.y - target.y) * 0.7,
          z: target.z + (camera.position.z - target.z) * 0.7,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    } else if (zoomAction.action === "out") {
      if (controlsRef.current) {
        const target = controlsRef.current.target;
        gsap.to(camera.position, {
          x: target.x + (camera.position.x - target.x) * 1.4,
          y: target.y + (camera.position.y - target.y) * 1.4,
          z: target.z + (camera.position.z - target.z) * 1.4,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    } else if (zoomAction.action === "reset") {
      setSelectedNodeId(null);
      setTargetPosition(new Vector3(0, 0, 0));
      if (controlsRef.current) {
        gsap.to(controlsRef.current.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1.2,
          ease: "power3.inOut",
          onUpdate: () => controlsRef.current?.update(),
        });
      }
      gsap.to(camera.position, {
        x: 0,
        y: 10,
        z: 35,
        duration: 1.2,
        ease: "power3.inOut",
      });
    }
  }, [zoomAction, camera, setSelectedNodeId, setTargetPosition]);

  // Raccourcis clavier (D, Q, Arrow)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (nodes.length === 0) return;
      if (selectedNodeId === null) setSelectedNodeId(nodes[0].id);
      if (!camera || !event) return;

      const positionListe = nodes.findIndex(
        (node: NodeData) => node.id === selectedNodeId,
      );
      if (positionListe !== -1) {
        if (event.key === "d" || event.key === "ArrowRight") {
          const nextNode = nodes[(positionListe + 1) % nodes.length];
          setSelectedNodeId(nextNode.id);
          const pos = getNodePos(nextNode, currentView);
          setTargetPosition(new Vector3(pos.x, pos.y, pos.z));
        }
        if (event.key === "q" || event.key === "ArrowLeft") {
          const prevNode =
            nodes[(positionListe - 1 + nodes.length) % nodes.length];
          setSelectedNodeId(prevNode.id);
          const pos = getNodePos(prevNode, currentView);
          setTargetPosition(new Vector3(pos.x, pos.y, pos.z));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedNodeId,
    nodes,
    camera,
    setTargetPosition,
    setSelectedNodeId,
    currentView,
  ]);

  // Mode debug
  useEffect(() => {
    const toggleDebug = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "m") setDebugMode(!debugMode);
    };
    window.addEventListener("keydown", toggleDebug);
    return () => window.removeEventListener("keydown", toggleDebug);
  }, [debugMode, setDebugMode]);

  // Calcul du focus intelligent centré sur le nœud sélectionné et ses voisins
  useEffect(() => {
    if (selectedNode) {
      const { x, y, z } = getNodePos(selectedNode, currentView);
      const sumPosition = new Vector3(x, y, z);
      let count = 1;

      edges.forEach((edge) => {
        let neighbor: NodeData | undefined;
        if (edge.start === selectedNode.id) {
          neighbor = nodesMap.get(edge.end);
        } else if (edge.end === selectedNode.id) {
          neighbor = nodesMap.get(edge.start);
        }
        if (neighbor) {
          const pos = getNodePos(neighbor, currentView);
          sumPosition.add(new Vector3(pos.x, pos.y, pos.z));
          count++;
        }
      });

      setTargetPosition(sumPosition.divideScalar(count));
    }
  }, [selectedNode, setTargetPosition, currentView, edges, nodes, nodesMap]);

  const handleCanvasClick = useCallback(
    (event: MouseEvent) => {
      if (event.target === gl.domElement) setSelectedNodeId(null);
    },
    [gl, setSelectedNodeId],
  );

  if (!graphData) return <group>{t("scene.no_data")}</group>;

  return (
    <>
      <ambientLight
        intensity={graphTheme === "neon" ? 0.35 : darkMode ? 0.45 : 0.75}
      />
      <directionalLight
        position={[10, 20, 10]}
        intensity={graphTheme === "neon" ? 0.6 : 0.95}
      />
      <pointLight position={[-10, -20, -10]} intensity={0.2} />

      {/* Arrière-plan d'étoiles immersif */}
      <Stars
        radius={120}
        depth={50}
        count={600}
        factor={4}
        saturation={0.5}
        fade
        speed={1}
      />

      {/* Grille moderne avec dégradé de distance */}
      <Grid
        position={[0, -12, 0]}
        args={[150, 150]}
        cellSize={1.5}
        cellThickness={1.0}
        cellColor={darkMode ? "#334155" : "#cbd5e1"}
        sectionSize={4.5}
        sectionThickness={1.5}
        sectionColor={darkMode ? "#38bdf8" : "#0284c7"}
        fadeDistance={100}
        fadeStrength={1}
        infiniteGrid
      />

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
              const isFiltered = !(
                filters[node.typeMath as keyof typeof filters] ?? false
              );

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
            const isFiltered = !(
              filters[(node.typeMath ?? "") as keyof typeof filters] ?? false
            );
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
        {edges.map((edge, index) => {
          const startNode = nodesMap.get(edge.start)!;
          const endNode = nodesMap.get(edge.end)!;
          if (!startNode || !endNode) return null;

          const isStartFiltered = !(
            filters[startNode.typeMath as keyof typeof filters] ?? false
          );
          const isEndFiltered = !(
            filters[endNode.typeMath as keyof typeof filters] ?? false
          );

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
              />
            </group>
          );
        })}

        {/* 🌟 Anneau de sélection holographique */}
        {selectedNode && (
          <SelectionRing
            position={(() => {
              const p = getNodePos(selectedNode, currentView);
              return [p.x, p.y, p.z];
            })()}
            color={getNodeColor(selectedNode.typeMath, colors)}
            scale={getNodeScale(selectedNode.id)}
          />
        )}
      </group>

      {graphTheme === "neon" && renderMode === "quality" && (
        <EffectComposer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={0.2}
            mipmapBlur
            intensity={1.5}
            radius={0.8}
          />
        </EffectComposer>
      )}

      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        maxDistance={2000}
        minDistance={5}
      />
    </>
  );
}
