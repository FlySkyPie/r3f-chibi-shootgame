import { ThreeFactory } from '@flyskypie/dragonbones-threejs';
import { Billboard, useTexture } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';
import { Group, sRGBEncoding } from 'three';

import skeJson from './lyana/lyana_ske.json';
import texJson from './lyana/lyana_tex.json';
import texPng from './lyana/lyana_tex.png';

type IProps = {
    position: [number, number, number];
    isMoving: boolean;
    moveDirection: "right" | "left";
};

export const ChibiCharacter: React.FC<IProps> = ({ position, isMoving, moveDirection }) => {
    const [group, setGroup] = useState<Group | null>(null);
    const texture = useTexture(texPng, (texture) => {
        if (Array.isArray(texture)) {
            texture.forEach(t => {
                t.encoding = sRGBEncoding;
            })
            return;
        }
        texture.encoding = sRGBEncoding;
    });

    const armatureDisplay = useMemo(() => {
        const { factory } = ThreeFactory;
        factory.parseDragonBonesData(skeJson);
        factory.parseTextureAtlasData(texJson, texture);

        const armatureDisplay = factory.buildArmatureDisplay("Lyana");
        if (armatureDisplay === null) {
            throw new Error('');
        }

        armatureDisplay.scale.set(0.1, -0.1, 0.1);
        armatureDisplay.translateY(1);
        armatureDisplay.animation.play("attack", 0);

        return armatureDisplay;
    }, [texture]);

    useEffect(() => {
        if (isMoving) {
            armatureDisplay.animation.play("move", 0);
        } else {
            armatureDisplay.animation.play("wait", 0);
        }
    }, [armatureDisplay, isMoving])

    useEffect(() => {
        if (moveDirection === 'right') {
            armatureDisplay.scale.set(0.1, -0.1, 0.1);
        } else {
            armatureDisplay.scale.set(-0.1, -0.1, 0.1);
        }

    }, [, armatureDisplay, moveDirection,]);

    useEffect(() => {
        if (group === null) {
            return;
        }

        group.add(armatureDisplay);

        return () => {
            group.remove(armatureDisplay);
        }
    }, [group, armatureDisplay]);



    return (
        <Billboard position={position}>
            <group ref={ref => setGroup(ref)} />
        </Billboard>
    );
};
