import { useCallback, useEffect, useMemo, useState } from "react";
import { Vector3Tuple } from "three";

import { usePlayerStore } from "@/store/usePlayerStore";

type IBullet = {
    id: string;
    position: Vector3Tuple;
    velocity: Vector3Tuple;
};

type IProps = {
    characterPosition: Vector3Tuple;
    targetPosition: Vector3Tuple;
};

export const useWeapon = ({ characterPosition, targetPosition }: IProps) => {
    const { player: { status }, weapon: { reloadable }, reload, reloadDone } = usePlayerStore();
    //const [isFiring, setIsFire] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [ammo, setAmmo] = useState(44);
    const [bullets, setBullets] = useState<IBullet[]>([]);

    const handleReload = useCallback(() => {
        if (status === 'reloading' || !reloadable) {
            return;
        }
        reload();
        const timer = setTimeout(() => {
            reloadDone();
        }, 1000);
        return timer;
    }, [status, reloadable, reload, reloadDone]);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined = undefined;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code !== 'KeyR') {
                return;
            }
            timer = handleReload();
        };
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            if (timer !== undefined) {
                clearTimeout(timer);
            }
        }
    }, [handleReload]);

    const fire = useCallback(() => {

    }, []);



    return {};
}