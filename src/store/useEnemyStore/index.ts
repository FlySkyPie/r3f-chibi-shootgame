
import { Vector3, Vector3Tuple } from 'three';
import { create } from 'zustand'
import { nanoid } from 'nanoid';

type IEnemy = {
    id: string;
    health: number;
    rotation: number;
    position: Vector3Tuple;
    velocity: Vector3Tuple;
    damaged: number;
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
        damaged: 0,
    }))
};

interface IEnemyStore {
    enemies: IEnemy[],
    add: (position: Vector3Tuple) => void;
    damage: (targetId: string) => void;
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
                damaged: 0,

            }]
        };
    }),
    damage: (targetId) => set(({ enemies }) => {
        return {
            enemies: enemies.map(({ id, health, ...others }) => {
                if (targetId !== id) {
                    return { id, health, ...others };
                }
                return { id, health: health - 10, ...others, damaged: 0.2, };

            }).filter(({ health, }) => health > 0)
        }
    }),
    tick: (deltaSecond) => set(({ enemies }) => {
        const updated: IEnemy[] = enemies.map(({ id, position, velocity, damaged, ...others }) => ({
            id, velocity,
            position: position.map((t, i) =>
                t + velocity[i] * deltaSecond) as Vector3Tuple,
            damaged: (damaged - deltaSecond) <= 0 ? 0 : damaged - deltaSecond,
            ...others
        }));
        return {
            enemies: updated,
        };
    }),
}));
