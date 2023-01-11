import { ThreeFactory } from '@flyskypie/dragonbones-threejs';
import { Billboard, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import { Group, sRGBEncoding } from 'three';

import skeJson from './lyana/lyana_ske.json';
import texJson from './lyana/lyana_tex.json';
import texPng from './lyana/lyana_tex.png';


export const ChibiCharacter: React.FC = () => {
    const [group, setGroup] = useState<Group | null>(null);
    const texture = useTexture(texPng);

    const armatureDisplay = useMemo(() => {
        const { factory } = ThreeFactory;
        factory.parseDragonBonesData(skeJson);
        factory.parseTextureAtlasData(texJson, texture);

        const armatureDisplay = factory.buildArmatureDisplay("Lyana");
        if (armatureDisplay === null) {
            throw new Error('');
        }

        console.log(texture);
        texture.encoding = sRGBEncoding;

        armatureDisplay.scale.setY(-1);
        armatureDisplay.translateY(1);

        armatureDisplay.animation.play("attack", 0);

        return armatureDisplay;
    }, [texture]);

    useEffect(() => {
        if (group === null) {
            return;
        }

        group.add(armatureDisplay);

        return () => {
            group.remove(armatureDisplay);
        }
    }, [group, armatureDisplay]);



    return <Billboard>
        <group ref={ref => setGroup(ref)} />
    </Billboard>;
}