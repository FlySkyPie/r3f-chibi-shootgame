import { useFrame } from "@react-three/fiber";
import { Fragment, useMemo, } from "react";
import { BallCollider, CuboidCollider, RigidBody } from "@react-three/rapier";

import { useEnemyStore } from "@/store/useEnemyStore";
import { usePlayerStore } from "@/store/usePlayerStore";

export const Enemies: React.FC = () => {
    const { enemies, bullets, tick, damage, removeBullet } = useEnemyStore();
    const { player: { position } } = usePlayerStore();

    useFrame((_, delta) => {
        tick(delta, position);
    });

    const bulletsView = useMemo(() => bullets.map(({ id, position }) =>
        <Fragment key={id}>
            <RigidBody
                position={position}
                lockRotations
                lockTranslations>
                <BallCollider name="bullet"
                    args={[1.0]} onIntersectionEnter={({ colliderObject }) => {
                        if (colliderObject === undefined) {
                            return;
                        }
                        if (colliderObject.name !== "player") {
                            return;
                        }
                        removeBullet(id);
                    }} />
            </RigidBody>
            <mesh position={position}>
                <sphereGeometry args={[4, 12, 12]} />
                <meshStandardMaterial color={0xff9000} emissive={0xffba60} />
            </mesh>
        </Fragment>
    ), [bullets]);

    const enemiesView = useMemo(() => enemies.map(({ id, position, rotation, damaged }) =>
        <Fragment key={id} >
            <group position={position} rotation={[0, rotation, 0]}>
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

    return <>
        {enemiesView}
        {bulletsView}
    </>;
}