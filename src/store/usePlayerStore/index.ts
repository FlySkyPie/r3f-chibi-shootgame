import { Vector3, Vector3Tuple } from 'three';
import { create } from 'zustand'

interface IPlayerStore {
    player: {
        position: Vector3Tuple;
        rotation: number;
        status: 'moving' | 'idle' | 'attack' | 'reloading';
        direction: 'right' | 'left';
    };
    weapon: {
        reloadable: boolean;
        ammo: number;
        validTarget: boolean;
        target: Vector3Tuple;
    };
    constrols: {
        isMoving: boolean;
    },
    moveRelativeY: (distance: number) => void;
    moveRelativeX: (distance: number) => void;
    rotate: (value: number) => void;
    stopMoving: () => void;
    idle: () => void;
    attack: () => void;
    aim: (target: Vector3Tuple) => void;

    /**
     * Not Support yet.
     */
    reload: () => void;
    reloadDone: () => void;
};


export const usePlayerStore = create<IPlayerStore>((set) => ({
    player: {
        position: [0, 0, 0,],
        rotation: 0,
        status: 'idle',
        direction: 'right',
    },
    weapon: {
        reloadable: false,
        ammo: 64,
        validTarget: true,
        target: [0, 0, 0],
    },
    constrols: {
        isMoving: false,
    },
    moveRelativeY: (distance: number) => set(({ player, }) => {
        const { rotation, position, status } = player;
        if (status !== 'idle' && status !== 'moving') {
            return {};
        }
        const forward = new Vector3(-1, 0, 0).applyAxisAngle(new Vector3(0, 1, 0), rotation);
        const newPosition = new Vector3(...position).addScaledVector(forward, distance).toArray();
        if (newPosition[0] < -1000 || newPosition[0] > 1000 ||
            newPosition[2] < -1000 || newPosition[2] > 1000) {
            return { player: { ...player, status: 'moving' } };
        }
        return {
            player: {
                ...player,
                status: 'moving',
                position: newPosition,
            },
        }
    }),
    moveRelativeX: (distance: number) => set(({ player, }) => {
        const { rotation, position, status } = player;
        if (status !== 'idle' && status !== 'moving') {
            return {};
        }
        const right = new Vector3(0, 0, -1).applyAxisAngle(new Vector3(0, 1, 0), rotation)
        const newPosition = new Vector3(...position).addScaledVector(right, distance).toArray();
        if (newPosition[0] < -1000 || newPosition[0] > 1000 ||
            newPosition[2] < -1000 || newPosition[2] > 1000) {
            return { player: { ...player, status: 'moving' } };
        }
        return {
            player: {
                ...player,
                status: 'moving',
                direction: distance >= 0 ? 'right' : 'left',
                position: newPosition,
            },
        }
    }),
    rotate: (value: number) => set(({ player }) => {
        const { rotation, status } = player;
        if (status !== 'idle' && status !== 'moving') {
            return {};
        }
        return {
            player: {
                ...player,
                status: 'moving',
                rotation: rotation + value,
            },
        }
    }),
    stopMoving: () => set(({ player, }) => {
        const { status } = player;
        if (status !== 'moving') {
            return {};
        }
        return {
            player: {
                ...player,
                status: 'idle'
            },
        }
    }),
    idle: () => set(({ player, }) => {
        return {
            player: {
                ...player,
                status: 'idle'
            },
        }
    }),
    attack: () => set(({ player, weapon }) => {
        const { status, position, rotation, direction: prevDirection } = player;
        if (status === 'reloading' || weapon.ammo === 0) {
            return {};
        }

        let direction = prevDirection;
        if (status === 'attack') {
            const right = new Vector3(0, 0, -1).applyAxisAngle(new Vector3(0, 1, 0), rotation);
            const directionVec = new Vector3(...weapon.target).sub(new Vector3(...position)).normalize();
            const v = right.dot(directionVec);
            if (v >= 0) {
                direction = 'right';
            } else {
                direction = 'left';
            }
        }

        return {
            player: {
                ...player,
                direction,
                status: 'attack'
            },
        }
    }),
    aim: (target: Vector3Tuple) => set(({ player, weapon }) => {
        const { position, status, rotation, direction: prevDirection } = player;

        const cameraDir = new Vector3(1, 0, 0).applyAxisAngle(new Vector3(0, 1, 0), rotation);
        const relativeTarget = new Vector3(...target).sub(new Vector3(...position));
        const angle = cameraDir.angleTo(relativeTarget);
        const validTarget = Math.PI / 12.0 * 5 <= angle && angle <= Math.PI / 12.0 * 7;

        if (status === 'attack' && !weapon.validTarget) {
            return {
                player: {
                    ...player,
                    status: 'idle'
                },
            };
        }

        let direction = prevDirection;
        if (status === 'attack') {
            const right = new Vector3(0, 0, -1).applyAxisAngle(new Vector3(0, 1, 0), rotation);
            const directionVec = new Vector3(...weapon.target).sub(new Vector3(...position)).normalize();
            const v = right.dot(directionVec);
            if (v >= 0) {
                direction = 'right';
            } else {
                direction = 'left';
            }
        }
        return {
            player: {
                ...player,
                direction,
            },
            weapon: {
                ...weapon,
                validTarget,
                target,
            }
        }
    }),
    reload: () => set(({ player }) => {
        return {};  // not support yet, because don't have animation.
        return {
            player: {
                ...player,
                status: 'reloading'
            },
        }
    }),
    reloadDone: () => set(({ player, weapon }) => {
        return {};  // not support yet, because don't have animation.
        return {
            weapon: {
                ...weapon,
                reloadable: false,
                ammo: 64,
            },
            player: {
                ...player,
                status: 'idle'
            },
        }
    }),
}))