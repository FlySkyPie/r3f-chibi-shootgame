import { ThreeFactory } from "@flyskypie/dragonbones-threejs";
import { useFrame } from "@react-three/fiber";


export const DragonBonesTicker: React.FC = () => {
    useFrame(() => {
        ThreeFactory.factory.dragonBones.advanceTime(-1.0);
    })
    
    return null;
}