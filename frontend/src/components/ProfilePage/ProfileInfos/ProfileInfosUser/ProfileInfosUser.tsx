import { ProfileMenuSettings } from "../ProfileMenuSettings/ProfileMenuSettings";
import calendarIcon from '../../../../assets/Calendar_Days.svg';
import mapIcon from '../../../../assets/Map_Pin.svg';

import './ProfileInfosUser.css'
import { getUserAge } from "../../../../utils";
import { User } from "../../../../types";

export default function ProfileInfosUser(props: { user: User, isCurrentUser: boolean }) {

    return (
        <div style={{display: 'flex', flexDirection: 'column', 
        justifyContent: 'center', alignItems: 'center', gap:'10px'}}>
                <h1 className="profileinfosuser-name">{props.user && `${props.user.firstName} ${props.user.lastName}`}</h1>
                {
                    !props.isCurrentUser &&
                    <ProfileMenuSettings {...props} />
                }
            <div className="profileinfosuser-infos">
                <img src={calendarIcon} className="profileinfosuser-infos-icon" />
                <p className="profileinfosuser-name" style={{ fontSize: '14px', fontWeight: '400' }}>{props.user && props.user.age ? `${getUserAge(props.user.age)} years old` : "Age not specified"}</p>
            </div>
            <div className="profileinfosuser-infos">
                <img src={mapIcon} className="profileinfosuser-infos-icon" />
                <p className="profileinfosuser-name" style={{ fontSize: '14px', fontWeight: '500' }}>
                    {props.user && props.user.city && props.user.city.name ?  `${props.user.department.name}, ${props.user.region.name}` : "Location not specified"}
                </p>
            </div>
        </div>
    )
}
