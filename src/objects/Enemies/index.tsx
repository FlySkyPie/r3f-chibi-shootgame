import { useFrame } from "@react-three/fiber";
import { Fragment, useMemo, } from "react";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

import { useEnemyStore } from "@/store/useEnemyStore";

export const Enemies: React.FC = () => {
    const { enemies, tick, damage } = useEnemyStore();

    useFrame((_, delta) => {
        tick(delta);
    })

    const enemiesView = useMemo(() => enemies.map(({ id, position, damaged }) =>
        <Fragment key={id} >
            <group position={position}>
                <mesh position={[0, 8, 0]} rotation={[0, 0, -Math.PI * 0.5]}>
                    <cylinderGeometry args={[0, 8, 16]} />
                    <meshStandardMaterial
                        // color={damaged ? 0xb85358 : 0x6f6f66}
                        color={0x6f6f66}
                        emissive={damaged ? 0xb81a22 : 0}
                    />
                </mesh>
            </group>
            <RigidBody
                key={id}
                position={position}
                lockRotations
                lockTranslations>
                <CuboidCollider
                    name="enemy"
                    position={[0, 8, 0]}
                    args={[8, 8, 8]}
                    sensor
                    onIntersectionEnter={({ colliderObject }) => {
                        if (colliderObject === undefined) {
                            return;
                        }
                        if (colliderObject.name !== "bullet") {
                            return;
                        }

                        damage(id);
                        /**
                         * @todo Damage enemy
                         */
                    }}
                />
            </RigidBody>
        </Fragment>
    ), [enemies]);

    return <>{enemiesView}</>;
}