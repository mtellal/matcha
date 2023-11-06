import React from "react";
import './InputRangeText.css'

type TInput = {
    label: string,
    value1: string,
    setValue1: (s: string) => void,
    value2: string,
    setValue2: (s: string) => void,
    placeholder1: string,
    placeholder2: string,
    maxLength: number,
    onSubmit?: () => void,
    style?: {},
    onChange?: (((s: string) => void) | (() => void))
    id: string
}


export default function InputRangeText(props: TInput) {
    function onChange1(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.value ||
            (e.target.value.match(/[0-9]/g))) {
            props.setValue1(e.target.value);
            if (props.onChange)
                props.onChange(e.target.value)
        }
    }

    function onChange2(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.value ||
            (e.target.value.match(/[0-9]/g))) {
            props.setValue2(e.target.value);
            if (props.onChange)
                props.onChange(e.target.value)
        }
    }

    return (
        <div className="pickmenu" style={props.style}>
            <p className="title-input">{props.label}</p>
            <div className="input-rangetext-c">
                <input
                    id={props.id + '1'}
                    className="inputRangeText"
                    style={props.style}
                    placeholder={props.placeholder1}
                    value={props.value1}
                    onChange={onChange1}
                    onSubmit={props.onSubmit}
                    maxLength={props.maxLength}
                    onKeyDown={e => e.key === "Enter" && props.onSubmit && props.onSubmit()}
                />
                <input
                    id={props.id + '2'}
                    className="inputRangeText"
                    style={props.style}
                    placeholder={props.placeholder2}
                    value={props.value2}
                    onChange={onChange2}
                    onSubmit={props.onSubmit}
                    maxLength={props.maxLength}
                    onKeyDown={e => e.key === "Enter" && props.onSubmit && props.onSubmit()}
                />
            </div>
        </div>
    )
}