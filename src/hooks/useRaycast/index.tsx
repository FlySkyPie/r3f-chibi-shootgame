import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { Mesh, Raycaster, Vector2 } from "three";

type IRayCastHookProps = {
    floorMesh: Mesh | null;
    setRaycastingPoint: React.Dispatch<React.SetStateAction<[number, number, number]>>;
};

const RaycastHook: React.FC<IRayCastHookProps> = ({ floorMesh, setRaycastingPoint }) => {
    const { camera, gl } = useThree();
    const [pointer, setPointer] = useState<[number, number]>([0, 0]);
    const [raycaster] = useState(() => new Raycaster());

    useFrame(() => {
        if (floorMesh === null) {
            return;
        }

        raycaster.setFromCamera(new Vector2(...pointer), camera);
        const intersects = raycaster.intersectObject(floorMesh);

        if (intersects.length > 0) {
            setRaycastingPoint(intersects[0].point.toArray());
        }
    })

    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
            setPointer([
                (event.clientX / gl.domElement.clientWidth) * 2 - 1,
                - (event.clientY / gl.domElement.clientHeight) * 2 + 1
            ]);
        }

        gl.domElement.addEventListener('pointermove', handlePointerMove);

        return () => {
            gl.domElement.removeEventListener('pointermove', handlePointerMove);
        }
    }, [gl, camera]);

    return null;
};

type IProps = {
    floorMesh: Mesh | null
};

export const useRaycast = ({ floorMesh }: IProps) => {
    const [raycastingPoint, setRaycastingPoint] = useState<[number, number, number]>([0, 0, 0]);
    const raycastHook = useMemo(() =>
        <RaycastHook
            floorMesh={floorMesh}
            setRaycastingPoint={setRaycastingPoint} />, [floorMesh]);

    return { raycastingPoint, raycastHook };
};
