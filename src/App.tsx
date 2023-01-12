import { useMemo, useRef, useState } from 'react'
import { Canvas, MeshProps, useFrame } from '@react-three/fiber'
import { Grid, MapControls, OrbitControls } from '@react-three/drei';

import { ChibiCharacter } from './components/ChibiCharacter';
import { DragonBonesTicker } from './components/DragonBonesTicker';
import { useWasdControls } from './hooks/useWasdControls';
import { CameraTester } from './components/CameraTseter';

function App() {

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

  const { controlsHook, position, isMoving } = useWasdControls();

  return (
    <Canvas
      gl={{ antialias: true, }}
      camera={{ position: [100, 50, 100], far: 10000, near: 1 }}>
      {/* <fogExp2 attach="fog" args={[0xcccccc, 0.002]} /> */}
      <color attach="background" args={[0x69655b]} />
      {pyramids}
      {/* <directionalLight args={[0xffffff]} position={[1, 1, 1]} />
      <directionalLight args={[0x002288]} position={[-1, -1, -1]} />
      <ambientLight args={[0x222222]} /> */}
      <ambientLight args={[0xffffff, 1]} />

      {/* <CameraTester /> */}

      <MapControls />

      {controlsHook}

      <ChibiCharacter
        position={position}
        isMoving={isMoving} />

      {/* <mesh
        scale={100}
        position={[0, 200, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'orange'} />
      </mesh> */}

      <Grid
        position={[0, 0, 0]}
        args={[100, 100]}
        cellSize={10}
        cellThickness={1.5}
        cellColor='#6f6f6f'

        sectionSize={100}
        sectionThickness={1.5}
        sectionColor='#9d4b4b'
        fadeDistance={1000}
        //fadeStrength={1}
        //followCamera= false
        infiniteGrid
      />
      <DragonBonesTicker />
    </Canvas >
  )
}

export default App
