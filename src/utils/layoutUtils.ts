import { NodeData } from "../types/ApiTypes/graph";

/**
 * Génère une disposition en grappes (clusters) pour le mode "domaines".
 * Chaque domaine se voit assigner un centre sur une grande sphère,
 * et ses nœuds sont distribués autour de ce centre.
 */
export function computeDomainsLayout(nodes: NodeData[]) {
  // 1. Grouper les nœuds par domaine
  const domainsMap = new Map<string, NodeData[]>();
  nodes.forEach((node) => {
    const domaine = node.domaine || "Non classé";
    if (!domainsMap.has(domaine)) {
      domainsMap.set(domaine, []);
    }
    domainsMap.get(domaine)!.push(node);
  });

  // 2. Trier les domaines par taille décroissante
  const sortedDomains = Array.from(domainsMap.entries()).sort(
    (a, b) => b[1].length - a[1].length,
  );

  const numClusters = sortedDomains.length;
  // Plus il y a de clusters, plus le rayon global doit être grand
  const globalRadius = Math.max(20, numClusters * 3);

  // Fonction pour placer des points uniformément sur une sphère (Fibonacci)
  const getFibonacciSpherePoint = (i: number, n: number, radius: number) => {
    const phi = Math.acos(1 - (2 * i) / n);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    return {
      x: radius * Math.cos(theta) * Math.sin(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(phi),
    };
  };

  // 3. Assigner des positions pour chaque domaine et leurs nœuds
  sortedDomains.forEach(([, domainNodes], clusterIndex) => {
    // Position du centre du cluster
    const clusterCenter = getFibonacciSpherePoint(
      clusterIndex,
      numClusters,
      globalRadius,
    );

    const numNodes = domainNodes.length;
    // Rayon local dépendant du nombre de nœuds dans le cluster
    const localRadius = Math.max(3, Math.pow(numNodes, 0.5) * 1.5);

    domainNodes.forEach((node, nodeIndex) => {
      // Position locale du nœud par rapport au centre du cluster
      const localPos = getFibonacciSpherePoint(
        nodeIndex,
        numNodes,
        localRadius,
      );

      // On ajoute un peu de bruit aléatoire pour un aspect plus organique
      const noise = 0.5;
      const rx = (Math.random() - 0.5) * noise;
      const ry = (Math.random() - 0.5) * noise;
      const rz = (Math.random() - 0.5) * noise;

      // Sauvegarde de la position calculée dans node.position["domaines"]
      if (!node.position) node.position = {};
      node.position["domaines"] = {
        x: clusterCenter.x + localPos.x + rx,
        y: clusterCenter.y + localPos.y + ry,
        z: clusterCenter.z + localPos.z + rz,
      };
    });
  });

  return sortedDomains.map(([domaine]) => ({
    domaine,
    center: getFibonacciSpherePoint(
      sortedDomains.findIndex((d) => d[0] === domaine),
      numClusters,
      globalRadius,
    ),
  }));
}
