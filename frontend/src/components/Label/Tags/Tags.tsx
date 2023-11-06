import { useState } from "react";
import { Icon } from "../../Icons/Icon";

import crossIcon from '../../../assets/Cross_White.svg'

import './Tags.css'

type TTag = {
    tag: string,
    onClick?: () => void,
}

export default function Tags(props: TTag) {
    const [hover, setHover] = useState(false);

    return (
        <div
            className="tags"
            style={hover ? { backgroundColor: '#9A8C98' } : {}}
            onMouseEnter={() => setHover((p: boolean) => !p)}
            onMouseLeave={() => setHover((p: boolean) => !p)}
            onClick={props.onClick ? props.onClick : null}
        >
            <p className="tag-text" style={{ margin: '0' }} >#{props.tag}</p>
            <Icon
                disableHover={true}
                icon={crossIcon}
                style={{ height: '25px', width: '25px' }}
            />
        </div>
    )
}

type TTagPick = {
    tag: string,
    selected: boolean, 
    addTag: () => void, 
    removeTag: () => void,
    onClick?: () => void,
}

export function TagsPick(props: TTagPick) {

    function onClick()
    {
        if (props.onClick)
            props.onClick();
        if (props.selected)
            props.removeTag();
        else
            props.addTag();
    }

    return (
        <div
            className="tags tagspick"
            style={props.selected ? { backgroundColor: '#9A8C98' } : {}}
            onClick={onClick}
        >
            <p className="tag-text" style={{ margin: '0' }} >#{props.tag}</p>
        </div>
    )
}


type TTagRaw = {
    tag: string, 
    selected?: boolean
}

export function TagsRaw(props: TTagRaw) {
    return (
        <div
            className="tags"
            style={props.selected ? {cursor: 'unset', paddingRight: '5px', backgroundColor: 'var(--purple4'} : {cursor: 'unset', paddingRight: '5px'}}
        >
            <p className="tag-text" style={{ margin: '0' }} >#{props.tag}</p>
        </div>
    )
}