import { useCallback, useMemo, useState } from "react"

import { usePlayerStore } from "@/store/usePlayerStore";


export const useMouseControls = () => {
    const [isPressed, setPressed] = useState(false);
    const { player: { status }, weapon: { validTarget }, attack, idle } = usePlayerStore();

    const handleMouseDown = useCallback<React.MouseEventHandler<HTMLDivElement>>(() => {
        setPressed(true);
        validTarget && attack();
    }, [attack, validTarget]);

    const handleMouseMove = useCallback<React.MouseEventHandler<HTMLDivElement>>(() => {
        if (!isPressed) {
            return;
        }

        if (status !== 'attack' && validTarget) {
            attack();
        }
    }, [attack, status, validTarget, isPressed]);

    const handleMouseUp = useCallback<React.MouseEventHandler<HTMLDivElement>>(() => {
        setPressed(false);
        idle();
    }, [idle]);

    const mouseHandlers = useMemo(() => ({
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onMouseMove: handleMouseMove,
    }), [
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
    ]);


    return { mouseHandlers };
}