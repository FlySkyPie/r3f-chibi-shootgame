import { useCallback, useMemo, useState } from "react"

import { usePlayerStore } from "@/store/usePlayerStore";
import { Vector3Tuple } from "three";


export const useMouseControls = () => {
    const { attack, idle } = usePlayerStore();

    const handleMouseDown = useCallback<React.MouseEventHandler<HTMLDivElement>>(() => {
        attack();
    }, [attack,]);

    const handleMouseUp = useCallback<React.MouseEventHandler<HTMLDivElement>>(() => {
        idle();
    }, [idle]);

    const mouseHandlers = useMemo(() => ({
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
    }), [
        handleMouseDown,
        handleMouseUp
    ]);


    return { mouseHandlers };
}