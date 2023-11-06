import { ReactNode } from 'react'
import './ButtonWrapper.css'

type ButtonWrapperProps = {
    onClick: () => void, 
    children: ReactNode
}

export function ButtonWrapper({children, ...props} : ButtonWrapperProps)
{
    return (
        <button
            className="buttonwrapper"
            onClick={props.onClick}
        >
            {children}
        </button>
    )
}