
type IProps = {
    onHover: (name: string) => void;
};

export const Keyboard: React.FC<IProps> = ({ onHover }) => {

    return (
        <div className="keyboard-base">
            <div className="key">~</div>
            <div className="key">1</div>
            <div className="key">2</div>
            <div className="key">3</div>
            <div className="key">4</div>
            <div className="key">5</div>
            <div className="key">6</div>
            <div className="key">7</div>
            <div className="key">8</div>
            <div className="key">9</div>
            <div className="key">0</div>
            <div className="key">-</div>
            <div className="key">+</div>
            <div className="key delete">Delete</div>
            <div className="key tab">Tab</div>
            <div className="key active" onMouseOver={() => onHover('Q')}>Q</div>
            <div className="key active" onMouseOver={() => onHover('W')}>w</div>
            <div className="key active" onMouseOver={() => onHover('E')}>E</div>
            <div className="key">R</div>
            <div className="key">T</div>
            <div className="key">Y</div>
            <div className="key">U</div>
            <div className="key">I</div>
            <div className="key">O</div>
            <div className="key">P</div>
            <div className="key">[</div>
            <div className="key">]</div>
            <div className="key backslash">\</div>
            <div className="key capslock">CapsLock</div>
            <div className="key active" onMouseOver={() => onHover('A')}>A</div>
            <div className="key active" onMouseOver={() => onHover('S')}>S</div>
            <div className="key active" onMouseOver={() => onHover('D')}>D</div>
            <div className="key">F</div>
            <div className="key">G</div>
            <div className="key">H</div>
            <div className="key">J</div>
            <div className="key">K</div>
            <div className="key">L</div>
            <div className="key">;</div>
            <div className="key">'</div>
            <div className="key return">Return</div>
            <div className="key leftshift active" onMouseOver={() => onHover('Shift')}>Shift</div>
            <div className="key">Z</div>
            <div className="key">X</div>
            <div className="key">C</div>
            <div className="key">V</div>
            <div className="key">B</div>
            <div className="key">N</div>
            <div className="key">M</div>
            <div className="key">,</div>
            <div className="key">.</div>
            <div className="key">/</div>
            <div className="key rightshift">Shift</div>
            <div className="key leftctrl">Ctrl</div>
            <div className="key">Alt</div>
            <div className="key command">Command</div>
            <div className="key space">Space</div>
            <div className="key command">command</div>
            <div className="key">Alt</div>
            <div className="key">Ctrl</div>
            <div className="key">Fn</div>
        </div>
    );
}