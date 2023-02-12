
import { Vector3, Vector3Tuple } from 'three';
import { create } from 'zustand'
import { nanoid } from 'nanoid';

const bubleSpeed = 30;
const bubleLife = 4;

type IEnemy = {
    id: string;
    health: number;
    rotation: number;
    rotationType: 'R' | 'L';
    position: Vector3Tuple;
    speed: number;
    stopRange: number;
    damaged: number;
    cooldown: number;
};

type IBullet = {
    id: string;
    health: number;
    position: Vector3Tuple;
    velocity: Vector3Tuple;
    life: number;
};

const createRandEnemies = (center: Vector3Tuple, level = 1): IEnemy[] => {
    return Array.from({ length: 10 }, () => ({
        id: nanoid(),
        health: 100.0,
        rotation: 0,
        rotationType: Math.random() > 0.5 ? 'R' : 'L',
        position: [
            center[0] + (Math.random() - 0.5) * 500,
            center[1] + 8,
            center[2] + (Math.random() - 0.5) * 500,
        ],
        speed: 20.0 + Math.random() * 20 * Math.sqrt(level),
        stopRange: 100 + (Math.random() - 0.5) * 20,
        damaged: 0,
        cooldown: Math.random() * 2,
    }))
};

interface IEnemyStore {
    level: number;
    bullets: IBullet[],
    enemies: IEnemy[],
    // add: (position: Vector3Tuple) => void;
    removeBullet: (bulletId: string) => void
    damage: (targetId: string) => void;
    tick: (delta: number, targetPosition: Vector3Tuple) => void;
}

export const useEnemyStore = create<IEnemyStore>((set) => ({
    level: 1,
    bullets: [],
    enemies: createRandEnemies([0, 0, 0]),
    // add: (position) => set(({ enemies }) => {
    //     return {
    //         enemies: [...enemies, {
    //             id: nanoid(),
    //             health: 100.0,
    //             rotation: 0,
    //             rotationType: Math.random() > 0.5 ? 'R' : 'L',
    //             position,
    //             velocity: [0, 0, 0],
    //             damaged: 0,
    //             cooldown: 0,
    //         }]
    //     };
    // }),
    removeBullet: (bulletId) => set(({ bullets }) => {
        return { bullets: bullets.filter(item => item.id !== bulletId) };
    }),
    damage: (targetId) => set(({ enemies, bullets }) => {
        return {
            enemies: enemies.map(({ id, health, ...others }) => {
                if (targetId !== id) {
                    return { id, health, ...others };
                }
                return { id, health: health - 10, ...others, damaged: 0.2, };

            }).filter(({ health }) => health > 0),
            bullets: bullets.map(({ id, health, ...others }) => {
                if (targetId !== id) {
                    return { id, health, ...others };
                }
                return { id, health: health - 10, ...others, };

            }).filter(({ health }) => health > 0)
        }
    }),
    tick: (deltaSecond, _targetPosition) => set(({ level, enemies, bullets }) => {
        const targetPosition = new Vector3(..._targetPosition);
        const upVector = new Vector3(0, 1, 0);

        const preparedEnemies = enemies.map((enemy) => {
            const {
                id, position: _position, speed, damaged: _damaged, cooldown: _cooldown,
                rotationType, stopRange,
            } = enemy;
            const position = new Vector3(..._position);

            const difference = new Vector3(..._targetPosition).sub(position);
            const rotation = -Math.atan2(difference.z, difference.x);
            const damaged = (_damaged - deltaSecond) <= 0 ? 0 : _damaged - deltaSecond;
            const cooldown = (_cooldown - deltaSecond) <= 0 ? 0 : _cooldown - deltaSecond;

            const distance = difference.length();
            const angularVelocity = speed / distance / 180;
            const updatedPosition = distance > stopRange ?
                position.clone().add(difference.clone().normalize().multiplyScalar(speed * deltaSecond)) :
                targetPosition.clone().add(
                    difference.clone()
                        .multiplyScalar(-1)
                        .applyAxisAngle(upVector, rotationType === 'R' ?
                            angularVelocity :
                            -angularVelocity));

            return {
                ...enemy,
                id,
                position: updatedPosition.toArray(),
                damaged,
                rotation,
                difference,
                distance,
                cooldown,
            };
        });

        const newBullets: IBullet[] = preparedEnemies.filter(({ cooldown, distance }) =>
            cooldown <= 0 && distance <= 200).map(({ position, difference }) => {
                return {
                    id: nanoid(),
                    health: 10,
                    life: bubleLife,
                    position,
                    velocity: difference.clone().normalize().multiplyScalar(bubleSpeed).toArray(),
                }
            });

        const updatedEnemies: IEnemy[] = preparedEnemies.map(({
            cooldown, distance, difference: _, ...others }) => ({
                ...others,
                cooldown: (cooldown <= 0 && distance <= 200) ? 2 : cooldown,
            }));

        const updatedBullets: IBullet[] = bullets.map(({ id, position, velocity, life, health }) => ({
            id, velocity, health,
            position: position.map((t, i) =>
                t + velocity[i] * deltaSecond) as Vector3Tuple,
            life: life - deltaSecond,
        })).filter(({ life }) => life > 0);

        return {
            level: updatedEnemies.length === 0 ? level + 1 : level,
            enemies: updatedEnemies.length === 0 ?
                createRandEnemies(_targetPosition, level + 1) : updatedEnemies,
            bullets: [...updatedBullets, ...newBullets],
        };
    }),
}));
