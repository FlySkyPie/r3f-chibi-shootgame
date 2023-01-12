import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";
import { Group } from "three";



export const CameraTester = () => {
    const { camera } = useThree();
    const [group, setGroup] = useState<Group | null>(null);

    useFrame(() => {
        group?.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);
    })

    return (
        <group ref={ref => setGroup(ref)}>
            <axesHelper args={[100]} />
        </group>
    );
}