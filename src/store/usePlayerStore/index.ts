import { Vector3, Vector3Tuple } from 'three';
import { create } from 'zustand'

interface IPlayerStore {
    player: {
        position: Vector3Tuple;
        rotation: number;
        status: 'moving' | 'idle' | 'attack' | 'reload';
        direction: 'right' | 'left';
    };
    constrols: {
        isMoving: boolean;
    },
    moveRelativeY: (distance: number) => void;
    moveRelativeX: (distance: number) => void;
    rotate: (value: number) => void;
    setMoving: (value: boolean) => void;
    resetMove: () => void;
};


export const usePlayerStore = create<IPlayerStore>((set) => ({
    player: {
        position: [0, 0, 0,],
        rotation: 0,
        status: 'idle',
        direction: 'right',
    },
    constrols: {
        isMoving: false,
    },
    moveRelativeY: (distance: number) => set(({ player, constrols }) => {
        const { rotation, position } = player;
        const forward = new Vector3(-1, 0, 0).applyAxisAngle(new Vector3(0, 1, 0), rotation)
        return {
            player: {
                ...player,
                position: new Vector3(...position).addScaledVector(forward, distance).toArray()
            },
            constrols: {
                ...constrols,
                isMoving: true,
            },
        }
    }),
    moveRelativeX: (distance: number) => set(({ player, constrols }) => {
        const { rotation, position } = player;
        const right = new Vector3(0, 0, -1).applyAxisAngle(new Vector3(0, 1, 0), rotation)
        return {
            player: {
                ...player,
                direction: distance >= 0 ? 'right' : 'left',
                position: new Vector3(...position).addScaledVector(right, distance).toArray()
            },
            constrols: {
                ...constrols,
                isMoving: true,
            },
        }
    }),
    rotate: (value: number) => set(({ player }) => {
        const { rotation } = player;
        return {
            player: {
                ...player,
                rotation: rotation + value,
            },
        }
    }),
    setMoving: (value: boolean) => set(({ constrols }) => {
        return {
            constrols: {
                ...constrols,
                isMoving: value,
            },
        }
    }),
    resetMove: () => set(({ constrols }) => {
        return {
            constrols: {
                ...constrols,
                isMoving: false,
            },
        }
    }),
}))