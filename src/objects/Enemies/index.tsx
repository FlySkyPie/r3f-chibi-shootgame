import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Vector3, Vector3Tuple } from "three";

import { useEnemyStore } from "@/store/useEnemyStore";

export const Enemies: React.FC = () => {
    const { enemies } = useEnemyStore();

    const enemiesView = useMemo(() => enemies.map(({ id, position }) =>
        <group key={id} position={position}>
            <mesh position={[0, 8, 0]} rotation={[0, 0, -Math.PI * 0.5]}>
                <cylinderGeometry args={[0, 8, 16]} />
                <meshStandardMaterial color={0x6f6f66} />
            </mesh>
        </group>), [enemies]);

    return <>{enemiesView}</>;
}