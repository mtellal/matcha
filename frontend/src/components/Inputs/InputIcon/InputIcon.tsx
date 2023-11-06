

import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../Icons/Icon';
import './InputIcon.css'

import eyeIcon from '../../../assets/eye.svg'

type TInputIcon = {
    value: string,
    setValue: (s: string) => void,
    placeholder: string,
    maxLength: number,
    onSubmit?: () => void,
    style?: {}
    onChange?: () => void,
    type?: string,
    icon: string,
    onClick: () => void
}


export default function InputIcon(props: TInputIcon) {


    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.setValue(e.target.value);
        if (props.onChange)
        {
            props.onChange();
        }
    }

    return (
        <div className="inputicon" style={props.style}>
            <input
                id="inputicon-input"
                style={props.style}
                placeholder={props.placeholder}
                value={props.value}
                onChange={onChange}
                onSubmit={props.onSubmit}
                maxLength={props.maxLength}
                onKeyDown={e => e.key === "Enter" && props.onSubmit && props.onSubmit()}
                type={props.type || "text"}
            />
            <Icon style={{ height: '48%', padding: '1%', }} icon={props.icon} onClick={props.onClick} />
        </div>
    )
}



type TInputIconPassword = {
    value: string,
    setValue: (s: string) => void,
    placeholder: string,
    maxLength: number,
    onSubmit?: () => void,
    style?: {}
    onChange?: () => void,
    id?: string
}


export function InputIconPassword(props: TInputIconPassword) {

    const [type, setType] = useState("password");

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.setValue(e.target.value);
        if (props.onChange)
        {
            setType("password");
            props.onChange();
        }
    }

    return (
        <div className="inputicon" style={props.style}>
            <input
                id={props.id}
                className="inputicon-input"
                style={props.style}
                placeholder={props.placeholder}
                value={props.value}
                onChange={onChange}
                onSubmit={props.onSubmit}
                maxLength={props.maxLength}
                onKeyDown={e => e.key === "Enter" && props.onSubmit && props.onSubmit()}
                type={type}
            />
            <Icon
                style={{ height: '48%', padding: '1%', }}
                icon={eyeIcon}
                onClick={() => setType((s: string) => s === "password" ? "text" : "password")}
            />
        </div>
    )
}