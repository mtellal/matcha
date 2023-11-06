import React from "react";

import './InputLabel.css'

type TInput = {
    label: string,
    value: string,
    setValue: (s: string) => void,
    placeholder: string,
    maxLength?: number,
    onSubmit?: () => void,
    style?: {},
    type?: string,
    onChange?: (s: string) => void,
    max?: string, 
    min?: string
}


export default function InputLabel(props: TInput) {
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.setValue(e.target.value);
        if (props.onChange)
            props.onChange(e.target.value)
    }

    return (
        <div className="pickmenu" style={props.style}>
            <p className="title-input">{props.label}</p>
            <input
                id="inputlabel"
                className="inputlabel"
                style={props.style}
                placeholder={props.placeholder}
                value={props.value}
                onChange={onChange}
                onSubmit={props.onSubmit}
                maxLength={props.maxLength}
                onKeyDown={e => e.key === "Enter" && props.onSubmit && props.onSubmit()}
                type={props.type || "text"}
                min={props.min}
                max={props.max}
            />
        </div>
    )
}