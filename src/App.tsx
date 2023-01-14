import React, { useEffect } from 'react'
import { Canvas, } from '@react-three/fiber'

import { ChibiCharacter } from './components/ChibiCharacter';
import { DragonBonesTicker } from './components/DragonBonesTicker';
import { useWasdControls } from './hooks/useWasdControls';
import { RandomPyramids } from './components/RandomPyramids';
import { useFloor } from './hooks/useFloor';
import { useRaycast } from './hooks/useRaycast';
import { LaserPointer } from './components/LaserPointer';
import { useMouseControls } from './hooks/useMouseControls';

function App() {
  const { controlsHook, } = useWasdControls();
  const { floorView, floorMesh } = useFloor();
  const { raycastHook, raycastingPoint } = useRaycast({ floorMesh });
  const { isPressed, mouseHandlers } = useMouseControls();

  useEffect(() => console.log(isPressed), [isPressed]);

  return (
    <Canvas
      gl={{ antialias: true, }}
      camera={{ position: [40, 40, 40], far: 10000, near: 1 }}
      {...mouseHandlers}>
      <color attach="background" args={[0x69655b]} />
      <directionalLight args={[0xffffff]} position={[1, 1, 1]} />
      <directionalLight args={[0x002288]} position={[-1, -1, -1]} />
      <ambientLight args={[0x222222]} />
      <fogExp2 attach="fog" args={[0xcccccc, 0.005]} />

      {floorView}
      <RandomPyramids />

      <ChibiCharacter />

      <axesHelper args={[100]} position={[0, 1, 0]} />

      <LaserPointer
        point1={raycastingPoint} />

      {/* <MapControls /> */}
      {controlsHook}
      {raycastHook}
      <DragonBonesTicker />
    </Canvas >
  )
}

export default App
