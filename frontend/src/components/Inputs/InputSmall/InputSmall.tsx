import React from "react";

import './InputSmall.css'
import { Icon } from "../../Icons/Icon";

type InputProps = {
    label: string,
    value: string,
    setValue: (s: string) => void,
    placeholder?: string,
    maxLength?: number,
    onSubmit?: () => void,
    style?: {},
    icon?: string,
    onClick?: () => void,
    onChange?: (((s: string) => void) | (() => void))
    type?: string,
    id?: string
}

export default function InputSmall(props: InputProps) {
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.setValue(e.target.value);
        if (props.onChange)
            props.onChange(e.target.value)
    }

    return (
        <div className="inputsmall-c" style={props.style}>
            <p className="title-input">{props.label}</p>
            <div style={{ position: 'relative' }}>
                <input
                    id={props.id}
                    className="inputsmall"
                    style={props.style}
                    placeholder={props.placeholder || ""}
                    value={props.value || ""}
                    onChange={onChange}
                    onSubmit={props.onSubmit}
                    maxLength={props.maxLength}
                    onKeyDown={e => e.key === "Enter" && props.onSubmit && props.onSubmit()}
                    type={props.type || "text"}
                />
                {
                    props.icon &&
                    <Icon
                        icon={props.icon}
                        onClick={props.onClick}
                        style={{ position: 'absolute', right: '0', top: '10%', height: '80%' }}
                    />
                }
            </div>
        </div>
    )
}