import { useFrame } from "@react-three/fiber";
import { Fragment, useMemo, useRef } from "react";
import { Vector3, Vector3Tuple } from "three";
import { Howl } from 'howler';
import { BallCollider, RigidBody } from "@react-three/rapier";

import { useBulletStore } from "@/store/useBulletStore";
import { usePlayerStore } from "@/store/usePlayerStore";

import sfxUrl from './assets/smg_shoot.mp3?url';

const fireSFX = new Howl({
    volume: 0.5,
    src: sfxUrl
});

export const Bullets: React.FC = () => {
    const {
        player: { position, status, rotation },
        weapon: { target }
    } = usePlayerStore();
    const { bullets, tick, add, remove } = useBulletStore();

    const centerPoint = useMemo<Vector3Tuple>(() => [
        position[0],
        position[1] + 8.0,
        position[2],
    ], [position]);

    const { direction, muzzlePoint } = useMemo(() => {
        const direction = new Vector3(...target).sub(new Vector3(...position)).normalize();
        const muzzlePoint = new Vector3(...centerPoint).add(direction.multiplyScalar(10.5)).toArray();
        return { direction, muzzlePoint };
    }, [centerPoint, target]);

    const cooldownRef = useRef(0);
    useFrame((_, delta) => {
        tick(delta);

        if (status !== 'attack') {
            return;
        }

        cooldownRef.current += delta;
        if (cooldownRef.current >= 0.1) {
            cooldownRef.current -= 0.1;
            const errorMax = 1;
            const errorX = (Math.random() * 2 - 1) * errorMax;
            // const errorY = (Math.random() * 2 - 1) * errorMax;
            const forward = new Vector3(-1, 0, 0).applyAxisAngle(new Vector3(0, 1, 0), rotation);
            // const up = new Vector3(0, 1, 0);
            const messedirection = direction
                .add(forward.multiplyScalar(errorX))
                // .add(up.multiplyScalar(errorY))
                .toArray();

            add(muzzlePoint, messedirection, 'player');
            fireSFX.play();
        }
    })

    const bulletsView = useMemo(() => bullets.map(({ id, position }) =>
        <Fragment key={id}>
            <RigidBody
                position={position}
                lockRotations
                lockTranslations>
                <BallCollider name="bullet"
                    args={[1.0]} onIntersectionEnter={() => {
                        remove(id);
                    }} />
            </RigidBody>
            <mesh position={position}>
                <sphereGeometry args={[0.5, 12, 12]} />
                <meshStandardMaterial color={0xff9000} emissive={0xffba60} />
            </mesh>
        </Fragment>
    ), [bullets]);

    return <>{bulletsView}</>;
}