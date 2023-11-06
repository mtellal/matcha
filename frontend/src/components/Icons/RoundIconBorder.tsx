import './RoundIconBorder.css'

type RoundIconBorderProps = {
    onClick: () => void,
    style: any,
    icon: string
}


export function RoundIconBorder(props: RoundIconBorderProps) {
    return (
        <button
            className="roundicon"
            onClick={props.onClick}
            style={props.style}
        >
            <img
                className="roundicon-img"
                src={props.icon}
            />
        </button>
    )
} 