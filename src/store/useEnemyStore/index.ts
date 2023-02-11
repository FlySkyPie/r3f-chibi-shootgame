
import { Vector3, Vector3Tuple } from 'three';
import { create } from 'zustand'
import { nanoid } from 'nanoid';

type IEnemy = {
    id: string;
    health: number;
    rotation: number;
    position: Vector3Tuple;
    velocity: Vector3Tuple;
};

const createRandEnemies = (): IEnemy[] => {
    return Array.from({ length: 10 }, () => ({
        id: nanoid(),
        health: 100.0,
        rotation: 0,
        position: [
            (Math.random() - 0.5) * 500,
            0,
            (Math.random() - 0.5) * 500,
        ],
        velocity: [0, 0, 0],
    }))
};

interface IEnemyStore {
    enemies: IEnemy[],
    add: (position: Vector3Tuple) => void;
    tick: (delta: number) => void;
}

export const useEnemyStore = create<IEnemyStore>((set) => ({
    enemies: createRandEnemies(),
    add: (position) => set(({ enemies }) => {
        return {
            enemies: [...enemies, {
                id: nanoid(),
                health: 100.0,
                rotation: 0,
                position,
                velocity: [0, 0, 0],
            }]
        };
    }),
    tick: (deltaSecond) => set(({ enemies }) => {
        const updated: IEnemy[] = enemies.map(({ id, position, velocity, ...others }) => ({
            id, velocity,
            position: position.map((t, i) =>
                t + velocity[i] * deltaSecond) as Vector3Tuple,
            ...others
        }));
        return {
            enemies: updated,
        };
    }),
}));
