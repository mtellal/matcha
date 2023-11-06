import './BioLabel.css'
import { RoundIconBorder } from "../../Icons/RoundIconBorder";

import editIcon from '../../../assets/Edit_Pencil.svg';
import checkIcon from '../../../assets/Check.svg';
import { ChangeEvent } from 'react';

type BiolabelProps = {
    title: string,
    value: string,
    isCurrentUser?: boolean,
    editing?: boolean,
    editClick?: () => void,
    style?: {},

    setValue?: (s: string) => void,
    placeholder?: string,
    maxLength?: number,
    ronly?: boolean,
}

export default function Biolabel(props: BiolabelProps) {

    function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
        props.setValue(e.target.value);
    }

    return (
        <div className="biolabel">
            <p className="title-input">{props.title}</p>
            <div style={{ position: 'relative' }}>
                {
                    !props.value && !props.editing &&
                    <p className="font-14 biolabel-nobio">No biography</p>
                }
                <textarea
                    id="inputbio"
                    className="inputbio-input"
                    style={props.style}
                    placeholder={props.placeholder}
                    value={props.value || ""}
                    onChange={onChange}
                    maxLength={props.maxLength}
                    rows={15}
                    disabled={!props.editing}
                />
            </div>
            {
                props.isCurrentUser &&
                <div className="biolabel-absolute-c">
                    {
                        props.editing &&
                        <p className="font-14" style={{ backgroundColor: 'var(--blue3)', margin: '0', padding: '0', height: '15px' }}>{props.value.length} / {props.maxLength}</p>
                    }
                    <div className="biolabel-editicon">
                        <RoundIconBorder
                            icon={props.editing ? checkIcon : editIcon}
                            onClick={props.editClick}
                            style={{ height: '100%', width: '100%' }}
                        />
                    </div>
                </div>

            }
        </div>
    )
}