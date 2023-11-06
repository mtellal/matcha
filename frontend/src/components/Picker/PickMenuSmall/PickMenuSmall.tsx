import { useRef, useState } from "react";

import './PickMenuSmall.css'

import arrowIcon from '../../../assets/Unfold_More.svg'
import { useOutsideComponent } from "../../../hooks/useOutsideComponent";

type PickMenuSmallProps = {
    title: string,
    options: string[], 
    value: string, 
    setValue: (s:string) => void, 
    style?: {}, 
    displayUp?: boolean, 
    outside?: boolean
}

export default function PickMenuSmall(props: PickMenuSmallProps) {

    const [selecting, setSelecting] = useState(false);

    const menuRef = useRef();
    useOutsideComponent(menuRef, () => {
        setSelecting(false)
    })

    function select(option: string)
    {
        if (!option)
            option = "not specified"
        props.setValue(option);
        setSelecting((s:boolean) => !s);
    }

    function style()
    {
        let s = {};
        if (selecting)
            s = {visibility: "visible"};
        else
            s = {visibility: "hidden"};
        if (props.displayUp)
            s = {...s, bottom: '100%', top:'initial'}
        return (s)
    }

    return (
        <div className="pickmenusmall" style={props.style}>
            <p className="pickmenusmall-title">{props.title}</p>
            <div
                className="pickmenusmall-select"
                onClick={() => setSelecting((s: boolean) => !s)}
            >
                <p className="pickmenusmall-options-placeholder" >{props.value || "not specified"}</p>
                <img src={arrowIcon} style={{marginLeft: 'auto'}}/>
            </div>

            <div
                ref={menuRef}
                className="pickmenusmall-menu" 
                style={style()}>
                <p onClick={() => select("")}  className="pickmenusmall-options" style={{border: 'none'}} >not specified</p>
                {
                    props.options.map((o: string) =>
                        <p key={o} onClick={() => select(o)} className="pickmenusmall-options">{o}</p>
                    )
                }
            </div>

        </div>
    )
}