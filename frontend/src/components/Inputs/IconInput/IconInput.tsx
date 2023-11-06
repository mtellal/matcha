import React, { ChangeEvent, EventHandler } from "react";

import './IconInput.css'

type TIconInput = {
    id: string,
    placeholder: string,
    value: string,
    setValue: (s: string) => void
    maxLength?: number
    icon: string
    style?: {}
}

export default function IconInput(props: TIconInput) {
    function onChange(e: ChangeEvent<HTMLInputElement>) {
        props.setValue(e.target.value)
    }

    return (
        <label
            id={props.id}
            className="iconinput"
            style={props.style}
        >
            <img src={props.icon} style={{ height: '80%' }} />
            <input
                type="text"
                id={props.id}
                className="iconinput-input font-14"
                maxLength={props.maxLength || 50}
                value={props.value}
                onChange={onChange}
                placeholder={props.placeholder}
            />
        </label>
    )
}