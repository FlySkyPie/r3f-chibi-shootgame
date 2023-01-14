import React, { useEffect, useMemo, useState } from "react";
import { useFrame, useThree } from '@react-three/fiber';
import { Quaternion, Vector3 } from 'three'

import { usePlayerStore } from "@/store/usePlayerStore";

const useCodes = () => {
    const [codes] = useState(() => new Set<string>());

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => codes.add(e.code)
        const onKeyUp = (e: KeyboardEvent) => codes.delete(e.code)
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('keyup', onKeyUp)
        }
    }, [codes]);

    return { codes }
}

const WasdControls: React.FC = () => {
    const { moveRelativeY, moveRelativeX, rotate, stopMoving } = usePlayerStore();
    const { codes } = useCodes();

    useFrame((_, delta) => {
        const speed = codes.has('ShiftLeft') ? 50 : 20
        if (codes.has('KeyW')) moveRelativeY(delta * speed)
        if (codes.has('KeyA')) moveRelativeX(-delta * speed)
        if (codes.has('KeyS')) moveRelativeY(-delta * speed)
        if (codes.has('KeyD')) moveRelativeX(delta * speed)

        if (codes.has('KeyQ')) {
            rotate(0.03);
        }
        if (codes.has('KeyE')) {
            rotate(-0.03);
        }

        if (!codes.has('KeyW') && !codes.has('KeyA') &&
            !codes.has('KeyS') && !codes.has('KeyD') &&
            !codes.has('KeyQ') && !codes.has('KeyE')) {
                stopMoving();
        } else {

        }
    })
    return null
}

const CameraSync: React.FC = () => {
    const { player: { position, rotation } } = usePlayerStore();
    const { camera } = useThree();

    useFrame((_, delta) => {
        const quaternion = new Quaternion();
        quaternion.setFromAxisAngle(new Vector3(0, 1, 0), rotation);

        const pos = new Vector3(40, 40, 0);
        pos.applyQuaternion(quaternion);
        pos.add(new Vector3(...position));

        camera.position.set(...pos.toArray());
        camera.lookAt(...position);
    });

    return null;
}

export const useWasdControls = () => {
    const controlsHook = useMemo(() =>
        <>
            <WasdControls />
            <CameraSync />
        </>, []);

    return { controlsHook };
}
