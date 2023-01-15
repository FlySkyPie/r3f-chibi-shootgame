
import { Vector3, Vector3Tuple } from 'three';
import { create } from 'zustand'
import { nanoid } from 'nanoid';

const muzzleVelocity = 10;

type IBullet = {
    id: string;
    position: Vector3Tuple;
    velocity: Vector3Tuple;
    life: number;
};

interface IBulletStore {
    bullets: IBullet[],
    add: (position: Vector3Tuple, direction: Vector3Tuple) => void;
    tick: (delta: number) => void;
}

export const useBulletStore = create<IBulletStore>((set) => ({
    bullets: [],
    add: (position, direction) => set(({ bullets }) => {
        const velocity = new Vector3(...direction).multiplyScalar(muzzleVelocity).toArray();
        return {
            bullets: [...bullets, {
                id: nanoid(),
                life: 2,
                position, velocity,
            }]
        };
    }),
    tick: (deltaSecond) => set(({ bullets }) => {
        const updated: IBullet[] = bullets.map(({ id, position, velocity, life }) => ({
            id, velocity,
            position: position.map((t, i) =>
                t + velocity[i] * deltaSecond ) as Vector3Tuple,
            life: life - deltaSecond,
        })).filter(v => v.life > 0);
        return {
            bullets: updated,
        };
    }),
}))