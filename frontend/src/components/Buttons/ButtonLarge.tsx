import React from 'react';

import './ButtonLarge.css'

type ButtonLargeProps = {
    title: string
    onClick: () => void, 
    style?: Object
}

export function ButtonLarge(props: ButtonLargeProps)
{
    return (
        <button
            onClick={props.onClick}
            className='buttonlarge'
            style={props.style}
        >   
            <p className='buttonlarge-title' >{props.title}</p>
        </button>
    )
}