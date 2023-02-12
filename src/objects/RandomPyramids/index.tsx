import { BallCollider, CuboidCollider, RigidBody } from "@react-three/rapier";
import { Fragment, useMemo } from "react";
import { Vector3Tuple } from "three";

const randPositions = Array.from({ length: 500 }, () =>
    ([Math.random() * 2000 - 1000, 15, Math.random() * 2000 - 1000] as Vector3Tuple))

type IProps = {
    collision?: boolean
};

export const RandomPyramids: React.FC<IProps> = ({ collision = false }) => {
    const pyramids = useMemo(() =>
        randPositions.map((position, i) =>
            <Fragment key={i}>
                <mesh
                    position={position}>
                    <cylinderGeometry args={[0, 10, 30, 4, 1]} />
                    <meshStandardMaterial color={0xffffff} flatShading />
                </mesh >
                {collision &&
                    <RigidBody
                        position={position}
                        lockRotations
                        lockTranslations>
                        <CuboidCollider
                            name="spike"
                            sensor
                            args={[8, 15, 8]} />
                    </RigidBody>}
            </Fragment>
        ), [collision]);

    return <>{pyramids}</>;
};
