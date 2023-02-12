
import { Vector2Tuple, Vector3, Vector3Tuple } from 'three';
import { create } from 'zustand'
import { nanoid } from 'nanoid';

type IEnemy = {
    id: string;
    health: number;
    rotation: number;
    position: Vector3Tuple;
    velocity: Vector3Tuple;
    damaged: number;
    cooldown: number;
};

type IBullet = {
    id: string;
    position: Vector3Tuple;
    velocity: Vector3Tuple;
    life: number;
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
        cooldown: 0,
    }))
};

interface IEnemyStore {
    bullets: IBullet[],
    enemies: IEnemy[],
    add: (position: Vector3Tuple) => void;
    removeBullet: (bulletId: string) => void
    damage: (targetId: string) => void;
    tick: (delta: number, targetPosition: Vector3Tuple) => void;
}

export const useEnemyStore = create<IEnemyStore>((set) => ({
    bullets: [],
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
                cooldown: 0,
            }]
        };
    }),
    removeBullet: (bulletId) => set(({ bullets }) => {
        return { bullets: bullets.filter(item => item.id !== bulletId) };
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
    tick: (deltaSecond, _targetPosition) => set(({ enemies, bullets }) => {
        const targetPosition = new Vector3(..._targetPosition);
        const upVector = new Vector3(0, 1, 0);

        const updatedEnemies: IEnemy[] = enemies.map((enemy) => {
            const { id, position: _position, velocity, damaged: _damaged, } = enemy;
            const position = new Vector3(..._position);
            
            const difference = new Vector3(..._targetPosition).sub(position);
            const rotation = -Math.atan2(difference.z, difference.x);
            const damaged = (_damaged - deltaSecond) <= 0 ? 0 : _damaged - deltaSecond;

            const distance = difference.length();
            const updatedPosition = distance > 100 ?
                position.clone().add(difference.clone().normalize().multiplyScalar(10.0 * deltaSecond)) :
                targetPosition.clone().add(
                    difference.clone()
                        .multiplyScalar(-1)
                        .applyAxisAngle(upVector, 0.01));

            return {
                ...enemy,
                id, velocity,
                position: updatedPosition.toArray(),
                damaged,
                rotation,
            };
        });

        const updatedBullets: IBullet[] = bullets.map(({ id, position, velocity, life, }) => ({
            id, velocity,
            position: position.map((t, i) =>
                t + velocity[i] * deltaSecond) as Vector3Tuple,
            life: life - deltaSecond,
        })).filter(v => v.life > 0);

        return {
            enemies: updatedEnemies,
            bullets: updatedBullets,
        };
    }),
}));
