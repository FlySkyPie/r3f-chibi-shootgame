import { ThreeFactory } from '@flyskypie/dragonbones-threejs';
import { Billboard, useTexture } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';
import { Group, sRGBEncoding } from 'three';

import { usePlayerStore } from '@/store/usePlayerStore';

import skeJson from './lyana/lyana_ske.json';
import texJson from './lyana/lyana_tex.json';
import texPng from './lyana/lyana_tex.png';

export const ChibiCharacter: React.FC = () => {
    const {
        player: { position, direction, status },
    } = usePlayerStore();

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
        if (direction === 'right') {
            armatureDisplay.scale.set(0.1, -0.1, 0.1);
        } else {
            armatureDisplay.scale.set(-0.1, -0.1, 0.1);
        }

    }, [, armatureDisplay, direction,]);

    useEffect(() => {
        // console.log(status)
        if (status === 'moving') {
            armatureDisplay.animation.play("move", 0);
        }
        if (status === 'idle') {
            armatureDisplay.animation.play("wait", 0);
        }
        if (status === 'attack') {
            armatureDisplay.animation.play("attack", 0);
        }
        if (status === 'reloading') {
            armatureDisplay.animation.play("reload");
        }
    }, [armatureDisplay, status])

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
