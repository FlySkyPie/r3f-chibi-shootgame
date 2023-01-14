import { useCallback, useMemo, useState } from "react"


export const useMouseControls = () => {
    const [isPressed, setIsPressed] = useState(false);

    const handleMouseDown = useCallback<React.MouseEventHandler<HTMLDivElement>>(() => {
        setIsPressed(true);
    }, []);

    const handleMouseUp = useCallback<React.MouseEventHandler<HTMLDivElement>>(() => {
        setIsPressed(false);
    }, []);

    const mouseHandlers = useMemo(() => ({
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
    }), [
        handleMouseDown,
        handleMouseUp
    ]);


    return { mouseHandlers, isPressed };
}