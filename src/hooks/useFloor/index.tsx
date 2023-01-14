import { Grid } from "@react-three/drei";
import { useMemo, useState } from "react"
import { Mesh } from "three";

export const useFloor = () => {
    const [meshRef, setMeshRef] = useState<Mesh | null>(null)

    const floorMesh = useMemo(() =>
        <mesh
            ref={ref => setMeshRef(ref)}
            rotation={[-Math.PI * 0.5, 0, 0]} >
            <planeGeometry args={[2000, 2000]} />
            <meshStandardMaterial color={0xcdc6b1} />
        </mesh>, []);

    const floorView = useMemo(() =>
        <>
            {floorMesh}
            <Grid
                position={[0, 0.05, 0]}
                args={[100, 100]}
                cellSize={10}
                cellThickness={1.5}
                cellColor='#6f6f6f'

                sectionSize={100}
                sectionThickness={1.5}
                sectionColor='#9d4b4b'
                fadeDistance={1000}
                infiniteGrid
            />
        </>, [floorMesh]);

    return { floorRef: meshRef, floorView };
}