import { useMemo, useRef, } from 'react';
import { Group, Matrix4, Vector3Tuple } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Grid, OrthographicCamera, } from '@react-three/drei';

import { usePlayerStore } from '@/store/usePlayerStore';

import { RandomPyramids } from '../RandomPyramids';

import { LeftBottomDisplay } from './components/LeftBottomDisplay';
import { useBulletStore } from '@/store/useBulletStore';

export const MinimapHud = ({ renderPriority = 1, matrix = new Matrix4() }) => {
    const {
        player: { position, },
    } = usePlayerStore();
    const { bullets, } = useBulletStore();
    const miniatureRef = useRef<Group>(null);
    const { camera, } = useThree();

    useFrame(() => {
        // Spin mesh to the inverse of the default cameras matrix
        matrix.copy(camera.matrix).invert()
        miniatureRef.current?.quaternion.setFromRotationMatrix(matrix);
    })

    const miniatureTranslat: Vector3Tuple = useMemo(() => [
        -position[0],
        position[1],
        -position[2]
    ], [position]);

    const bulletsView = useMemo(() => bullets.map(({ id, position }) =>
        <mesh
            key={id}
            position={position}>
            <sphereGeometry args={[10, 12, 12]} />
            <meshStandardMaterial color={0xff9000} emissive={0xffba60} />
        </mesh>), [bullets]);

    return (
        <LeftBottomDisplay
            cameraName="minimap-camera"
            renderPriority={renderPriority}>
            <OrthographicCamera makeDefault name="minimap-camera" position={[0, 0, 1000]} />
            <group >
                <mesh >
                    <sphereGeometry args={[20, 12, 12]} />
                    <meshBasicMaterial
                        color={0x0000ff} />
                </mesh>
                <group ref={miniatureRef} >
                    <group position={miniatureTranslat}>
                        <directionalLight args={[0xffffff]} position={[1, 1, 1]} />
                        <directionalLight args={[0x002288]} position={[-1, -1, -1]} />

                        <axesHelper args={[100]} position={[0, 1, 0]} />
                        <RandomPyramids />
                        {bulletsView}

                        <Grid
                            position={[0, 0.05, 0]}
                            args={[100, 100]}
                            cellSize={10}
                            cellThickness={1.5}
                            cellColor='#6f6f6f'

                            sectionSize={100}
                            sectionThickness={1.5}
                            sectionColor='#9d4b4b'
                            fadeDistance={99999}
                            fadeStrength={0}
                            infiniteGrid

                        >
                            <meshPhongMaterial color="#33BBFF" />
                        </Grid>
                    </group>
                </group>
            </group>
        </LeftBottomDisplay>
    );
};
