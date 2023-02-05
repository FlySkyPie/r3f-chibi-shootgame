import { useMemo } from "react";
import { Vector3Tuple } from "three";

const randPositions = Array.from({ length: 500 }, () =>
    ([Math.random() * 3200 - 1600, 15, Math.random() * 3200 - 1600] as Vector3Tuple))

export const RandomPyramids: React.FC = () => {
    const pyramids = useMemo(() =>
        randPositions.map((position, i) =>
            <mesh key={i}
                position={position}>
                <cylinderGeometry args={[0, 10, 30, 4, 1]} />
                <meshStandardMaterial color={0xffffff} flatShading />
            </mesh >), []);

    return <>{pyramids}</>;
};
