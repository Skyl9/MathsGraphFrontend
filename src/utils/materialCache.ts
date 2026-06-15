import * as THREE from "three";

const nodeMaterialsCache = new Map<string, THREE.MeshPhysicalMaterial>();
const edgeMaterialsCache = new Map<string, THREE.MeshStandardMaterial>();

export function getNodeMaterial(
  color: string,
  hovered: boolean,
  isSelected: boolean,
  isNeon: boolean,
  isFiltered: boolean,
  opacity: number,
): THREE.MeshPhysicalMaterial {
  const finalColor = hovered ? "#99C2FF" : color;
  const emissiveColor = isNeon || isSelected ? finalColor : "black";
  const emissiveIntensity = isNeon
    ? isSelected
      ? 3
      : 1.5
    : isSelected
      ? 1.5
      : 0;
  const finalOpacity = isFiltered ? 0 : opacity;

  const key = `${finalColor}-${emissiveColor}-${emissiveIntensity}-${finalOpacity.toFixed(2)}`;

  if (nodeMaterialsCache.has(key)) {
    return nodeMaterialsCache.get(key)!;
  }

  const mat = new THREE.MeshPhysicalMaterial({
    color: finalColor,
    emissive: emissiveColor,
    emissiveIntensity: emissiveIntensity,
    transparent: true,
    opacity: finalOpacity,
    roughness: 0.15,
    metalness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transmission: 0.3,
    ior: 1.5,
  });

  nodeMaterialsCache.set(key, mat);
  return mat;
}

export function getEdgeMaterial(
  activeColor: string,
  isNeon: boolean,
  finalOpacity: number,
): THREE.MeshStandardMaterial {
  const emissiveColor = isNeon ? activeColor : "black";
  const emissiveIntensity = isNeon ? 2 : 0;

  const key = `${activeColor}-${emissiveColor}-${emissiveIntensity}-${finalOpacity.toFixed(2)}`;

  if (edgeMaterialsCache.has(key)) {
    return edgeMaterialsCache.get(key)!;
  }

  const mat = new THREE.MeshStandardMaterial({
    color: activeColor,
    emissive: emissiveColor,
    emissiveIntensity: emissiveIntensity,
    transparent: true,
    opacity: finalOpacity,
    depthWrite: false,
  });

  edgeMaterialsCache.set(key, mat);
  return mat;
}
