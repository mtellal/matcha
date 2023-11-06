import React, { HTMLInputTypeAttribute, useState } from "react";


import './InputRange.css'


type TInputRange = {
    title: string, 
    min: number, 
    max: number, 
    value: string, 
    setValue?: (s:string | number) => void, 
    step?: number,
    id?: string
}

export default function InputRange(props: TInputRange) {

    function onChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        if (e.target.value)
        {
            props.setValue(e.target.value)
        }
    }

    return (
        <div className="inputrange">
            <div style={{display: 'flex', gap: '10px'}}>
                <label id={props.title} className="title-input">{props.title} :</label>
                <p className="title-input">{props.value}</p>
            </div>
            <input
                id={props.id}
                type="range"
                min={props.min}
                max={props.max}
                value={props.value}
                onChange={onChange}
                step={props.step}
            />
        </div>
    )
}