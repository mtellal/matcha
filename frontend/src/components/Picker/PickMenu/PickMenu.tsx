import React, { useRef, useState } from "react";

import './PickMenu.css'
import { useOutsideComponent } from "../../../hooks/useOutsideComponent";

type PickMenuProps = {
    title: string,
    options: string[],
    value: string,
    setValue: (s: string) => void,
    style?: {}
}


export default function PickMenu(props: PickMenuProps) {

    const [selecting, setSelecting] = useState(false);

    const menuRef = useRef();

    useOutsideComponent(menuRef, () => { setSelecting(false) })

    function select(option: string) {
        props.setValue(option);
        setSelecting((s: boolean) => !s);
    }

    return (
        <div className="pickmenu" style={props.style} ref={menuRef}>
            <p className="title-input">{props.title}</p>
            <div
                className="pickmenu-select"
                onClick={() => setSelecting((s: boolean) => !s)}
            >
                <p className="pickmenu-options-placeholder" >{props.value || "not specified"}</p>
            </div>

            <div
                className="pickmenu-menu"
                style={selecting ? { visibility: 'visible' } : { visibility: 'hidden' }}>
                <p onClick={() => select("")} className="pickmenu-options" style={{ border: 'none' }} >not specified</p>
                {
                    props.options.map((o: string) =>
                        <p key={o} onClick={() => select(o)} className="pickmenu-options">{o}</p>
                    )
                }
            </div>

        </div>
    )
}