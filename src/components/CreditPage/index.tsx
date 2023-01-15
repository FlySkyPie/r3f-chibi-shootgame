
import React, { useCallback, useMemo, useState } from 'react';
import './index.css'
import { Keyboard } from './Keyboard';
import { Mouse } from './Mouse';


export const CreditPage: React.FC = () => {
    const [open, setOpen] = useState(true);
    const [input, setInput] = useState<string>();

    const sfcCredit = useMemo(() => <div className='credit'>
        <h3>Credits</h3>
        <p>
            {"Character graphic by "}
            <a href="https://twitter.com/Pin_title" target="_blank" rel="noopener">ゆう</a>
        </p>
        <p>
            Sound Effect from
            <a href="https://pixabay.com/sound-effects/" target="_blank"> Pixabay</a>
        </p>
        <p>
            Music by <a href="https://pixabay.com/users/tommymutiu-17406877"
                target="_blank">Toma Mutiu</a> from
            <a href="https://pixabay.com/" target="_blank"> Pixabay</a>
        </p>
        <p>
            {"Gun Image from "}
            <a href="https://opengameart.org/content/cc0-flat-guns-west"
                target="_blank" rel="noopener">Pichuliru</a>
        </p>
    </div>, []);

    const handleHover = useCallback((name: string) => {
        setInput(name)
    }, [setInput]);

    const description = useMemo(() => {
        switch (input) {
            case "Q":
            case "E":
                return "Rotation"

            case "W":
            case "A":
            case "S":
            case "D":
                return "Move"

            case "Shift":
                return "Sprint"

            case "mouse-left":
                return "Shoot"
            case "mouse-move":
                return "Aim"
        }
        return null;
    }, [input]);


    return (
        <div className={open ? "credit-page" : "credit-page hide"}>
            <div className="controls">
                <Keyboard onHover={handleHover} />
                <Mouse onHover={handleHover} />
            </div>
            <div className='description'>
                {description}
            </div>
            <input
                onClick={() => setOpen(false)}
                className="start"
                type="button"
                value="Start" />
            {sfcCredit}
        </div>
    );
}