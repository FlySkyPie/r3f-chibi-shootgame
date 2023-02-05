import React, { useMemo, } from 'react';
import { Scene, Vector3Tuple, WebGLRenderTarget } from 'three';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { Hud, OrthographicCamera, } from '@react-three/drei';

type IRenderProps = {
    renderTarget: WebGLRenderTarget;
    scene: Scene;
    cameraName: string;
};

const Render: React.FC<IRenderProps> = ({ cameraName, renderTarget, scene }) => {
    const { camera, gl } = useThree();
    useFrame(() => {
        if (camera.name !== cameraName) {
            return;
        }

        gl.autoClear = false;

        const prevRT = gl.getRenderTarget();

        gl.setRenderTarget(renderTarget);
        gl.clear();
        gl.render(scene, camera);

        gl.setRenderTarget(prevRT);

        gl.autoClear = true;
    }, 1);
    return null;
}


type IProps = {
    renderPriority: number;
    children: React.ReactNode;
    cameraName: string;
};

export const LeftBottomDisplay: React.FC<IProps> = ({ renderPriority, cameraName, children }) => {
    const { size } = useThree();
    const planeSize = useMemo(() => {
        const smaller = Math.min(size.width, size.height);
        return smaller * 0.5;
    }, [size]);

    /**
     * Position of plane place in HUD scene,
     * should be left bottom of the view.
     */
    const planePosition: Vector3Tuple = useMemo(() => [
        -size.width / 2 + planeSize * 0.5,
        -size.height / 2 + planeSize * 0.5,
        0], [planeSize, size]);

    const renderTarget = useMemo(() => new WebGLRenderTarget(planeSize, planeSize), [planeSize]);

    /**
     * Elements to render minimap.
     */
    const { scene } = useMemo(() => {
        const scene = new Scene();

        return { scene }
    }, []);

    const portal = useMemo(() =>
        createPortal(<>
            {children}
            <Render
                renderTarget={renderTarget}
                scene={scene}
                cameraName={cameraName} />
        </>, scene), [scene, children]);

    const texture = useMemo(() => renderTarget.texture, [renderTarget]);

    return (
        <>
            {portal}
            <Hud renderPriority={renderPriority}>
                <OrthographicCamera makeDefault position={[0, 0, 100]} />
                <mesh position={planePosition}>
                    <planeGeometry args={[planeSize, planeSize]} />
                    <meshBasicMaterial map={texture} transparent />
                </mesh>
            </Hud>
        </>
    );
}