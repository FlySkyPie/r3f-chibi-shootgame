import { usePlayerStore } from "@/store/usePlayerStore";
import { Line, useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { Vector3, Vector3Tuple } from "three";

import crosshairTexUrl from './assets/crosshair.png';

export const LaserPointer: React.FC = ({ }) => {
    const {
        player: { position: point0, },
        weapon: { target: point1 }
    } = usePlayerStore();

    const centerPoint = useMemo<Vector3Tuple>(() => [
        point0[0],
        point0[1] + 7.5,
        point0[2],
    ], [point0]);

    const muzzlePoint = useMemo(() => {
        const direction = new Vector3(...point1).sub(new Vector3(...centerPoint)).normalize();

        return new Vector3(...centerPoint).add(direction.multiplyScalar(7.0)).toArray();
    }, [centerPoint, point1]);

    const texture = useTexture(crosshairTexUrl)

    return (
        <>
            <Line
                points={[muzzlePoint, point1]}
                color="red"
                lineWidth={2}
            />
            <mesh position={point1}>
                <sphereGeometry args={[0.5, 12, 12]} />
                <meshStandardMaterial color={0xff0000} />
            </mesh>
            <group position={point1}>
                <mesh
                    position={[0, 0.1, 0]}
                    rotation={[-Math.PI * 0.5, 0, 0]} >
                    <planeGeometry args={[10, 10]} />
                    <meshStandardMaterial
                        transparent
                        map={texture}
                        depthTest={false}
                    />
                </mesh>
            </group>
        </>
    );
}