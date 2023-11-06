import { useRef } from "react";
import { ButtonWrapper } from "../../../../components/Buttons/ButtonWrapper";

import './ConsentLocation.css'
import { useOutsideComponent } from "../../../../hooks/useOutsideComponent";

type ConsentLocationProps = {
    authorize: () => void, 
    deny: () => void
} 

export default function ConsentLocation(props: ConsentLocationProps) {

    const containerRef = useRef()

    useOutsideComponent(containerRef, () => {
        props.deny()
    })

    return (
        <div className="csntlocation">
            <div className="csntlocation-c" ref={containerRef}>
                <h4 className="csntlocation-title">Do you authorize Matcha (this site) to geolocate your position ?</h4>
                <p className="csntlocation-description">You can change your location later in your profile page.</p>
                <div className="csntlocation-buttons-c">
                    <ButtonWrapper onClick={props.authorize}>
                        <p className='font-18' style={{ width: '100%', textAlign: 'center' }}>Authorize</p>
                    </ButtonWrapper>

                    <ButtonWrapper onClick={props.deny}>
                        <p className='font-18' style={{ width: '100%', textAlign: 'center' }} >Deny</p>
                    </ButtonWrapper>
                </div>
            </div>
        </div>
    )
}
