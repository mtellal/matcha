

import './Input.css'

type TInput = {
    value: string,
    setValue: (s: string) => void,
    placeholder: string,
    maxLength: number,
    onSubmit?: () => void,
    style?: {}
    onChange?: () => void, 
    type?: string
    id?: string
}


export default function Input(props: TInput) {

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.setValue(e.target.value);
        if (props.onChange) 
            props.onChange();
    }

    return (
        <input
            id={props.id}
            className="input"
            style={props.style}
            placeholder={props.placeholder}
            value={props.value}
            onChange={onChange}
            onSubmit={props.onSubmit}
            maxLength={props.maxLength}
            onKeyDown={e => e.key === "Enter" && props.onSubmit && props.onSubmit()}
            type={props.type || "text"}
        />
    )
}