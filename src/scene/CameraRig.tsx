import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useUIStore } from "../stores/useUIStore";
import { useGraphStore } from "../stores/useGraphStore";
import { NodeData, EdgeData } from "../types/ApiTypes/graph";
import { Vector3 } from "three";

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

interface CameraRigProps {
  nodesMap: Map<number, NodeData>;
  edges: EdgeData[];
}

export default function CameraRig({ nodesMap, edges }: CameraRigProps) {
  const { camera, controls } = useThree();
  const currentView = useUIStore((s) => s.currentView);
  const zoomAction = useUIStore((s) => s.zoomAction);

  const targetPosition = useGraphStore((s) => s.targetPosition);
  const setTargetPosition = useGraphStore((s) => s.setTargetPosition);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);

  const selectedNode =
    selectedNodeId !== null ? nodesMap.get(selectedNodeId) : null;

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
  }, [selectedNode, setTargetPosition, currentView, edges, nodesMap]);

  // Animations GSAP : Cadrage intelligent
  useEffect(() => {
    if (selectedNode && targetPosition && controls) {
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

      gsap.to((controls as any).target, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 1.2,
        ease: "power3.inOut",
        onUpdate: () => (controls as any).update(),
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
    controls,
    currentView,
    edges,
    nodesMap,
  ]);

  // Écouteurs d'événements pour le HUD de navigation (Zoom / Reset) via Zustand
  useEffect(() => {
    if (!zoomAction.action) return;

    if (zoomAction.action === "in") {
      if (controls) {
        const target = (controls as any).target;
        gsap.to(camera.position, {
          x: target.x + (camera.position.x - target.x) * 0.7,
          y: target.y + (camera.position.y - target.y) * 0.7,
          z: target.z + (camera.position.z - target.z) * 0.7,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    } else if (zoomAction.action === "out") {
      if (controls) {
        const target = (controls as any).target;
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
      if (controls) {
        gsap.to((controls as any).target, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1.2,
          ease: "power3.inOut",
          onUpdate: () => (controls as any).update(),
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
  }, [zoomAction, camera, controls, setSelectedNodeId, setTargetPosition]);

  return null;
}
