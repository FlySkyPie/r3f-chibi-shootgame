import React from 'react'
import { Canvas, } from '@react-three/fiber'

import { ChibiCharacter } from './components/ChibiCharacter';
import { DragonBonesTicker } from './components/DragonBonesTicker';
import { useWasdControls } from './hooks/useWasdControls';
import { RandomPyramids } from './components/RandomPyramids';
import { useFloor } from './hooks/useFloor';

function App() {
  const { controlsHook, position, isMoving, moveDirection } = useWasdControls();
  const { floorView, floorRef } = useFloor();

  return (
    <Canvas
      gl={{ antialias: true, }}
      camera={{ position: [40, 40, 40], far: 10000, near: 1 }}>
      <color attach="background" args={[0x69655b]} />
      <directionalLight args={[0xffffff]} position={[1, 1, 1]} />
      <directionalLight args={[0x002288]} position={[-1, -1, -1]} />
      <ambientLight args={[0x222222]} />
      <fogExp2 attach="fog" args={[0xcccccc, 0.005]} />

      {floorView}
      <RandomPyramids />

      <ChibiCharacter
        position={position}
        moveDirection={moveDirection}
        isMoving={isMoving} />

      {/* <MapControls /> */}
      {controlsHook}
      <DragonBonesTicker />
    </Canvas >
  )
}

export default App
