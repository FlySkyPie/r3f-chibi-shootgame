import React, { useEffect } from 'react'
import { Canvas, } from '@react-three/fiber'

import {
  useWasdControls, useFloor, useRaycast, useMouseControls,
  useBGM
} from './hooks';
import { DragonBonesTicker, CreditPage } from './components';
import { Bullets, RandomPyramids, ChibiCharacter, Enemies, LaserPointer, } from './objects';
import { MinimapHud } from './components/MinimapHud';

function App() {
  // useBGM();
  const { controlsHook, } = useWasdControls();
  const { floorView, floorMesh } = useFloor();
  const { raycastHook } = useRaycast({ floorMesh });
  const { mouseHandlers } = useMouseControls();

  return (
    <>
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
        <Bullets />
        <Enemies />


        {/* <axesHelper args={[100]} position={[0, 1, 0]} /> */}

        <LaserPointer />

        <MinimapHud />

        {/* <MapControls /> */}
        {controlsHook}
        {raycastHook}
        <DragonBonesTicker />
      </Canvas >
      <CreditPage />
    </>

  )
}

export default App
