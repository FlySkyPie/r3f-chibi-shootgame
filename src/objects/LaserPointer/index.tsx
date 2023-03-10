import { usePlayerStore } from "@/store/usePlayerStore";
import { Line, useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { DoubleSide, Quaternion, Vector3, Vector3Tuple } from "three";

import crosshairTexUrl from './assets/crosshair.png';
import crosshairGraysacleTexUrl from './assets/crosshair_grayscale.png';

export const LaserPointer: React.FC = ({ }) => {
    const {
        player: { position: point0, },
        weapon: { target: point1, validTarget }
    } = usePlayerStore();

    const centerPoint = useMemo<Vector3Tuple>(() => [
        point0[0],
        point0[1],
        point0[2],
    ], [point0]);

    const muzzlePoint = useMemo(() => {
        const direction = new Vector3(...point1).sub(new Vector3(...centerPoint)).normalize();

        return new Vector3(...centerPoint).add(direction.multiplyScalar(7.0)).toArray();
    }, [centerPoint, point1]);

    const crosshairQuaternion = useMemo(() => {
        const direction = new Vector3(...point1).sub(new Vector3(...centerPoint)).normalize();

        const quaternion = new Quaternion(); // create one and reuse it

        quaternion.setFromUnitVectors(direction, new Vector3(0, 1, 0));

        return quaternion;
    }, [centerPoint, point1]);

    const texture = useTexture(crosshairTexUrl);
    const textureGraysacle = useTexture(crosshairGraysacleTexUrl);
    const color = useMemo(() => validTarget ? 0xff0000 : 0xeeeeee, [validTarget]);

    return (
        <>
            <Line
                points={[muzzlePoint, point1]}
                color={color}
                lineWidth={2}
            />
            <mesh position={point1}>
                <sphereGeometry args={[0.5, 12, 12]} />
                <meshStandardMaterial
                    color={color}
                    emissive={validTarget ? 0xff6a6a : 0xeeeeee} />
            </mesh>
            <group position={point1} quaternion={crosshairQuaternion}>
                <mesh
                    position={[0, 0.1, 0]}
                    rotation={[-Math.PI * 0.5, 0, 0]} >
                    <planeGeometry args={[10, 10]} />
                    <meshBasicMaterial
                        transparent
                        side={DoubleSide}
                        map={validTarget ? texture : textureGraysacle}
                        depthTest={false}
                    />
                </mesh>
            </group>
        </>
    );
}