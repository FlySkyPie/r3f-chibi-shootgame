import { useMemo, useState, } from 'react';
import { Euler, Vector3Tuple } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Grid, OrthographicCamera, } from '@react-three/drei';

import { usePlayerStore } from '@/store/usePlayerStore';
import { useBulletStore } from '@/store/useBulletStore';
import { useEnemyStore } from '@/store/useEnemyStore';

import { RandomPyramids } from '../../objects/RandomPyramids';

import { LeftBottomDisplay } from './components/LeftBottomDisplay';

export const MinimapHud = ({ renderPriority = 1, }) => {
    const { player: { position } } = usePlayerStore();
    const { bullets, } = useBulletStore();
    const { enemies } = useEnemyStore();

    const { camera, } = useThree();

    const [rotation, setRoration] = useState<Parameters<THREE.Euler['set']>>([0, 0, 0])
    useFrame(() => {
        // Spin mesh to the inverse of the default cameras matrix
        const r = new Euler().setFromRotationMatrix(camera.matrix.clone().invert());
        setRoration(r.toArray() as Parameters<THREE.Euler['set']>);
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
            <meshBasicMaterial color={0xeec591} />
        </mesh>), [bullets]);

    const enemiesView = useMemo(() => enemies.map(({ id, position }) =>
        <mesh
            key={id}
            position={position}>
            <sphereGeometry args={[20, 12, 12]} />
            <meshBasicMaterial color={0xff0000} />
        </mesh>), [enemies]);

    return (
        <LeftBottomDisplay
            cameraName="minimap-camera"
            renderPriority={renderPriority}>
            <OrthographicCamera
                name="minimap-camera"
                makeDefault
                position={[0, 0, 1000]}
                left={-500}
                right={500}
                top={500}
                bottom={-500}
            />
            <group >
                <group rotation={rotation} position={[0, 0, -100]} >
                    <group position={miniatureTranslat}>
                        <mesh
                            rotation={[-Math.PI * 0.5, 0, 0]} >
                            <planeGeometry args={[2000, 2000]} />
                            <meshBasicMaterial color={0xcdc6b1} />
                        </mesh>
                    </group>
                </group>
                <group rotation={rotation} >
                    <directionalLight args={[0xffffff]} position={[1, 1, 1]} />
                    <directionalLight args={[0x002288]} position={[-1, -1, -1]} />
                    <ambientLight args={[0x222222]} />
                    <group position={miniatureTranslat}>
                        <axesHelper args={[100]} position={[0, 1, 0]} />
                        <RandomPyramids />

                        <Grid
                            position={[0, 0.05, 0]}
                            args={[2000, 2000]}
                            // cellSize={10}
                            // cellThickness={1.5}
                            // cellColor='#6f6f6f'

                            sectionSize={100}
                            sectionThickness={1.5}
                            sectionColor='#9d4b4b'
                            fadeDistance={5000}
                            fadeStrength={0}
                        // infiniteGrid
                        />
                    </group>
                </group>
                <group rotation={rotation} position={[0, 0, 100]} >
                    <group position={miniatureTranslat}>
                        {enemiesView}
                        {bulletsView}
                    </group>
                </group>
                <mesh position={[0, 0, 200]}>
                    <sphereGeometry args={[20, 12, 12]} />
                    <meshBasicMaterial
                        color={0x0000ff} />
                </mesh>
            </group>
        </LeftBottomDisplay>
    );
};
