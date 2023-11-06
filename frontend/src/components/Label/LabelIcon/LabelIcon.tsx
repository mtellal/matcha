import React from "react";

import './InputLabelIcon.css'
import { Icon } from "../../Icons/Icon";


type TInput = {
    icon: string, 
    label: string,
    value: string,
    setValue: (s: string) => void,
    placeholder: string,
    maxLength: number,
    onSubmit?: () => void,
    style?: {},
    styleInput?: {},
    disable?: boolean
}


export default function InputLabelIcon(props: TInput) {
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.setValue(e.target.value);
    }

    return (
        <div className="pickmenu" style={props.style}>
            <p className="title-input">{props.label}</p>
            <div 
                className="labelicon-c"
                style={props.disable ? {backgroundColor: '#4A4E69'} : {} }
            >
                <input
                    id="labelicon-input"
                    className="labelicon-input"
                    style={props.styleInput}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={onChange}
                    onSubmit={props.onSubmit}
                    maxLength={props.maxLength}
                    onKeyDown={e => e.key === "Enter" && props.onSubmit && props.onSubmit()}
                    disabled={props.disable}
                />
                {
                    !props.disable && 
                    <Icon
                        icon={props.icon}
                        style={{ height: '35px', width: '35px' }}
                        onClick={props.onSubmit}
                    />
                }
            </div>
        </div>
    )
}