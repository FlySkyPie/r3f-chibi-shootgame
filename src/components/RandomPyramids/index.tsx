import { useMemo } from "react";

export const RandomPyramids: React.FC = () => {
    const pyramids = useMemo(() =>
        Array.from({ length: 500 }).map((_, i) =>
            <mesh key={i}
                position={[
                    Math.random() * 3200 - 1600,
                    15,
                    Math.random() * 3200 - 1600
                ]}>
                <cylinderGeometry args={[0, 10, 30, 4, 1]} />
                <meshStandardMaterial color={0xffffff} flatShading />
            </mesh>), []);

    return <>{pyramids}</>;
};
