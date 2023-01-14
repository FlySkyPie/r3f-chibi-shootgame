import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from '@react-three/fiber';
import { Quaternion, Vector3 } from 'three'

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

type IProps = {
    setIsMoving: React.Dispatch<React.SetStateAction<boolean>>;
    setPosition: React.Dispatch<React.SetStateAction<[number, number, number]>>;
    setRotation: React.Dispatch<React.SetStateAction<number>>;
    setMoveDirection: React.Dispatch<React.SetStateAction<"right" | "left">>;
};

const WasdControls: React.FC<IProps> = ({
    setPosition, setIsMoving, setRotation, setMoveDirection
}) => {
    const { camera } = useThree();
    const { codes } = useCodes();

    const moveRelativeY = useCallback((distance: number) => {
        const right = new Vector3().setFromMatrixColumn(camera.matrix, 0);
        right.crossVectors(camera.up, right);

        const forward = right.clone().setY(0).normalize();

        setPosition(prev => new Vector3(...prev).addScaledVector(forward, distance).toArray())

    }, [camera, setPosition]);

    const moveRelativeX = useCallback((distance: number) => {
        const right = new Vector3().setFromMatrixColumn(camera.matrix, 0);

        setPosition(prev => new Vector3(...prev).addScaledVector(right, distance).toArray())
        if (distance >= 0) {
            setMoveDirection('right');
        } else {
            setMoveDirection('left');
        }
    }, [camera, setPosition, setMoveDirection]);

    const rotateCamera = useCallback((diff: number) => {
        setRotation(prev => prev + diff)
    }, [setRotation]);

    useFrame((_, delta) => {
        const speed = codes.has('ShiftLeft') ? 50 : 20
        if (codes.has('KeyW')) moveRelativeY(delta * speed)
        if (codes.has('KeyA')) moveRelativeX(-delta * speed)
        if (codes.has('KeyS')) moveRelativeY(-delta * speed)
        if (codes.has('KeyD')) moveRelativeX(delta * speed)

        if (codes.has('KeyQ')) {
            rotateCamera(0.03);
        }
        if (codes.has('KeyE')) {
            rotateCamera(-0.03);
        }

        if (codes.has('KeyW') || codes.has('KeyA') ||
            codes.has('KeyS') || codes.has('KeyD') ||
            codes.has('KeyQ') || codes.has('KeyE')) {
            setIsMoving(true);
        } else {
            setIsMoving(false);
        }
    })
    return null
}

type ICameraSync = {
    position: [number, number, number];
    rotation: number;
};

const CameraSync: React.FC<ICameraSync> = ({ position, rotation }) => {
    const { camera } = useThree();

    useFrame((_, delta) => {
        const quaternion = new Quaternion();
        quaternion.setFromAxisAngle(new Vector3(0, 1, 0), rotation);

        const pos = new Vector3(40, 40, 40);
        pos.applyQuaternion(quaternion);
        pos.add(new Vector3(...position));

        camera.position.set(...pos.toArray());
        camera.lookAt(...position);
    });

    return null;
}

export const useWasdControls = () => {
    const [position, setPosition] = useState<[number, number, number]>(() => [0, 0, 0]);
    const [rotation, setRotation] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const [moveDirection, setMoveDirection] = useState<'right' | 'left'>('right');

    const controlsHook = useMemo(() =>
        <>
            <WasdControls
                setRotation={setRotation}
                setPosition={setPosition}
                setIsMoving={setIsMoving}
                setMoveDirection={setMoveDirection} />
            <CameraSync
                position={position}
                rotation={rotation} />
        </>
        , [setPosition, position, rotation]);

    return { controlsHook, position, isMoving, moveDirection };
}
