import { ProfileMenuSettings } from "../ProfileMenuSettings/ProfileMenuSettings";
import calendarIcon from '../../../../assets/Calendar_Days.svg';
import mapIcon from '../../../../assets/Map_Pin.svg';

import './ProfileInfosUser.css'
import { getUserAge } from "../../../../utils";
import { User } from "../../../../types";

export default function ProfileInfosUser(props: { user: User, isCurrentUser: boolean }) {

    return (
        <>
            <div className="profileinfosuser-name-c">
                <h1 className="profileinfosuser-name">{props.user && `${props.user.firstName} ${props.user.lastName}`}</h1>
                {
                    !props.isCurrentUser &&
                    <ProfileMenuSettings {...props} />
                }
            </div>
            <div className="profileinfosuser-infos">
                <img src={calendarIcon} className="profileinfosuser-infos-icon" />
                <p className="profileinfosuser-name" style={{ fontSize: '16px', fontWeight: '500' }}>{props.user && props.user.age ? `${getUserAge(props.user.age)} years old` : "Age not specified"}</p>
            </div>
            <div className="profileinfosuser-infos">
                <img src={mapIcon} className="profileinfosuser-infos-icon" />
                <p className="profileinfosuser-name" style={{ fontSize: '16px', fontWeight: '500' }}>
                    {props.user && props.user.city && props.user.city.name || "Location not specified"}
                </p>
            </div>
            {
                props.user && props.user.city &&
                props.user.region && props.user.department &&
                <div className="profileinfosuser-infos">
                    <p className="profileinfosuser-name" style={{ fontSize: '14px', fontWeight: '500' }}>
                        {`${props.user.department.name}, ${props.user.region.name}`}
                    </p>
                </div>
            }
        </>
    )
}
