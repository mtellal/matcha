
import './ButtonMedium.css'

type ButtonMediumProps = {
    title: string, 
    onClick: () => void, 
    style?: any
}

export function ButtonMedium(props: ButtonMediumProps)
{
    return (
        <button
            className="buttonmedium"
            onClick={props.onClick}
            style={props.style}
        >
            <p className="buttonmedium-title">{props.title}</p>
        </button>
    )
}