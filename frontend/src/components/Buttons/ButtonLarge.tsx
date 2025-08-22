
import './ButtonLarge.css'

type ButtonLargeProps = {
    title: string
    onClick: () => void,
    style?: Object,
    onLoad?: boolean
}

export function ButtonLarge(props: ButtonLargeProps) {
    return (
        props.onLoad ?
            <span className="loader"></span> :
            <button
                onClick={props.onClick}
                className='buttonlarge'
                style={props.style}
                disabled={props.onLoad ? true : false}
            >
                <p className='buttonlarge-title' >{props.title}</p>
            </button>
    )
}